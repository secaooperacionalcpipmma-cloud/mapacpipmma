import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CPAI, Battalion } from '../types/cpi';
import { BrasaoPMMA, BrasaoCPI } from './CrestLogos';
import {
  Sparkles,
  Layers,
  RotateCcw,
  Shield,
  ZoomIn,
  ZoomOut,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sun,
  Tag,
} from 'lucide-react';
import {
  getCPAIPolygon,
  getCPAIBounds,
  getMaranhaoBounds,
  MARANHAO_CENTER,
  MARANHAO_DEFAULT_ZOOM,
  HIGHWAY_NETWORK,
  MARANHAO_OUTER_BOUNDARY,
  getMaranhaoMaskPolygon,
  NEIGHBOR_LABELS,
} from '../utils/geoUtils';

interface CleanStaticMapProps {
  allCPAIs: CPAI[];
  selectedCPAIId: string | null;
  onSelectCPAI: (id: string | null) => void;
  onSelectBattalion: (bat: Battalion, cpai: CPAI) => void;
  onSwitchToInteractive: () => void;
  onOpenSubunidades?: () => void;
}

// High-contrast, rich official military briefing palette for each CPAI
const HIGH_CONTRAST_PALETTE: Record<
  string,
  { fill: string; border: string; badge: string; text: string }
> = {
  'CPAI-1': { fill: '#F59E0B', border: '#78350F', badge: '#D97706', text: '#FFFFFF' }, // Mearim / Bacabal
  'CPAI-2': { fill: '#0284C7', border: '#0C4A6E', badge: '#0369A1', text: '#FFFFFF' }, // Centro / Barra do Corda
  'CPAI-3': { fill: '#EA580C', border: '#7C2D12', badge: '#C2410C', text: '#FFFFFF' }, // Tocantina / Imperatriz
  'CPAI-4': { fill: '#2563EB', border: '#1E3A8A', badge: '#1D4ED8', text: '#FFFFFF' }, // Leste / Caxias
  'CPAI-5': { fill: '#D946EF', border: '#701A75', badge: '#C026D3', text: '#FFFFFF' }, // Baixada / Pinheiro
  'CPAI-6': { fill: '#0D9488', border: '#134E4A', badge: '#0F766E', text: '#FFFFFF' }, // Sul / Balsas
  'CPAI-7': { fill: '#16A34A', border: '#064E3B', badge: '#15803D', text: '#FFFFFF' }, // Lençóis / Rosário
  'CPAI-8': { fill: '#7C3AED', border: '#4C1D95', badge: '#6D28D9', text: '#FFFFFF' }, // Alto Turiaçu / Zé Doca
  'CPAI-9': { fill: '#E11D48', border: '#881337', badge: '#BE123C', text: '#FFFFFF' }, // Médio Parnaíba / Patos
};

// Calibrated centroid coordinates for the 9 large CPAI regional floating badges
const CPAI_CENTROIDS: Record<string, [number, number]> = {
  'CPAI-1': [-4.38, -44.82],
  'CPAI-2': [-5.45, -44.85],
  'CPAI-3': [-5.40, -46.75],
  'CPAI-4': [-4.85, -43.40],
  'CPAI-5': [-2.50, -45.10],
  'CPAI-6': [-8.10, -45.80],
  'CPAI-7': [-3.15, -43.20],
  'CPAI-8': [-3.30, -46.10],
  'CPAI-9': [-6.50, -43.80],
};

export const CleanStaticMap: React.FC<CleanStaticMapProps> = ({
  allCPAIs,
  selectedCPAIId,
  onSelectCPAI,
  onSelectBattalion,
  onSwitchToInteractive,
  onOpenSubunidades,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const maskLayerRef = useRef<L.LayerGroup | null>(null);
  const polygonsLayerRef = useRef<L.LayerGroup | null>(null);
  const cpaiLabelsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const highwaysLayerRef = useRef<L.LayerGroup | null>(null);
  const neighborsLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<'cartografica' | 'relevo' | 'satelite' | 'vetorial'>('cartografica');
  const [showNeighborStates, setShowNeighborStates] = useState(false);
  const [highContrast, setHighContrast] = useState(true);
  const [detailedLabels, setDetailedLabels] = useState(false);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Hard boundary lock so user cannot pan outside Maranhão
    const maxBounds: L.LatLngBoundsExpression = [
      [-11.2, -49.6],
      [-0.4, -40.6],
    ];

    const map = L.map(mapContainerRef.current, {
      center: MARANHAO_CENTER,
      zoom: MARANHAO_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      minZoom: 6,
      maxZoom: 16,
      maxBounds: maxBounds,
      maxBoundsViscosity: 1.0,
      fadeAnimation: true,
    });

    mapInstanceRef.current = map;

    // Create custom panes with explicit z-index hierarchy
    const maskPane = map.createPane('maranhaoMaskPane');
    maskPane.style.zIndex = '350';

    const cpaiLabelsPane = map.createPane('cpaiLabelsPane');
    cpaiLabelsPane.style.zIndex = '450';

    // Layer Groups
    maskLayerRef.current = L.layerGroup().addTo(map);
    polygonsLayerRef.current = L.layerGroup().addTo(map);
    highwaysLayerRef.current = L.layerGroup().addTo(map);
    neighborsLayerRef.current = L.layerGroup().addTo(map);
    cpaiLabelsLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Initial fit strictly on Maranhão
    const bounds = getMaranhaoBounds();
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Theme, Mask and Neighbor States View
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Remove previous tile layer if any
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    // 2. Add high-reliability basemap without any watermarks
    if (mapTheme === 'cartografica') {
      const tile = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = tile;
      tile.bringToBack();
    } else if (mapTheme === 'relevo') {
      const tile = L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = tile;
      tile.bringToBack();
    } else if (mapTheme === 'satelite') {
      const tile = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = tile;
      tile.bringToBack();
    }

    // 3. Manage Surrounding States (Mask vs Revealed Neighbors)
    const maskGroup = maskLayerRef.current;
    const neighborsGroup = neighborsLayerRef.current;

    if (maskGroup) maskGroup.clearLayers();
    if (neighborsGroup) neighborsGroup.clearLayers();

    if (!showNeighborStates) {
      // MASK IS ACTIVE: Completely hide surrounding states with solid background
      if (maskGroup) {
        const maskBgColor = mapTheme === 'satelite' ? '#070b14' : '#f8fafc';
        const borderColor = mapTheme === 'satelite' ? '#38bdf8' : '#002B55';

        // Solid Inverse Mask Polygon
        const maskPolygon = L.polygon(getMaranhaoMaskPolygon(), {
          pane: 'maranhaoMaskPane',
          stroke: false,
          fillColor: maskBgColor,
          fillOpacity: 1.0,
          interactive: false,
        });
        maskGroup.addLayer(maskPolygon);

        // State Border Outline
        const borderLine = L.polyline(MARANHAO_OUTER_BOUNDARY, {
          pane: 'maranhaoMaskPane',
          color: borderColor,
          weight: 4,
          opacity: 0.95,
          interactive: false,
        });
        maskGroup.addLayer(borderLine);

        // Border halo for visual elevation
        const borderHalo = L.polyline(MARANHAO_OUTER_BOUNDARY, {
          pane: 'maranhaoMaskPane',
          color: mapTheme === 'satelite' ? 'rgba(56,189,248,0.3)' : 'rgba(0,43,85,0.2)',
          weight: 8,
          opacity: 0.8,
          interactive: false,
        });
        maskGroup.addLayer(borderHalo);
      }

      // Restrict panning strictly to Maranhão
      map.setMaxBounds([
        [-11.2, -49.6],
        [-0.4, -40.6],
      ]);
    } else {
      // NEIGHBORS ARE VISIBLE: Reveal Pará, Tocantins, Piauí, Ceará and Ocean
      map.setMaxBounds([
        [-13.5, -53.0],
        [1.0, -37.5],
      ]);

      // Highlight the Maranhão official border with a clear demarcation line
      if (maskGroup) {
        const borderLine = L.polyline(MARANHAO_OUTER_BOUNDARY, {
          pane: 'maranhaoMaskPane',
          color: '#002B55',
          weight: 4,
          opacity: 0.95,
          dashArray: '8, 5',
          interactive: false,
        });
        maskGroup.addLayer(borderLine);
      }

      // Render subtle, high-contrast labels for neighboring regions
      if (neighborsGroup) {
        NEIGHBOR_LABELS.forEach((label) => {
          if (label.type === 'state') {
            const stateHtml = `
              <div class="pointer-events-none select-none text-center">
                <span style="
                  font-size: 13px;
                  font-weight: 900;
                  letter-spacing: 0.25em;
                  color: #1e293b;
                  background: rgba(255,255,255,0.9);
                  border: 2px solid #64748b;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                  padding: 3px 12px;
                  border-radius: 6px;
                  text-transform: uppercase;
                  font-family: serif;
                  white-space: nowrap;
                ">
                  ${label.name}
                </span>
              </div>
            `;
            const icon = L.divIcon({
              html: stateHtml,
              className: 'custom-neighbor-state',
              iconSize: [140, 30],
              iconAnchor: [70, 15],
            });
            neighborsGroup.addLayer(L.marker([label.lat, label.lng], { icon, interactive: false }));
          } else if (label.type === 'ocean') {
            const oceanHtml = `
              <div class="pointer-events-none select-none text-center">
                <span style="
                  font-size: 12px;
                  font-weight: 900;
                  letter-spacing: 0.25em;
                  color: #0369a1;
                  background: rgba(240,249,255,0.95);
                  border: 1.5px solid #38bdf8;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                  padding: 3px 10px;
                  border-radius: 6px;
                  text-transform: uppercase;
                  font-family: serif;
                  white-space: nowrap;
                ">
                  🌊 ${label.name}
                </span>
              </div>
            `;
            const icon = L.divIcon({
              html: oceanHtml,
              className: 'custom-neighbor-ocean',
              iconSize: [220, 28],
              iconAnchor: [110, 14],
            });
            neighborsGroup.addLayer(L.marker([label.lat, label.lng], { icon, interactive: false }));
          } else if (label.type === 'city') {
            const cityHtml = `
              <div class="pointer-events-none select-none flex items-center gap-1.5 bg-white/95 px-2 py-0.5 rounded border border-slate-400 text-[10px] font-bold text-slate-700 shadow-xs whitespace-nowrap">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>${label.name}</span>
              </div>
            `;
            const icon = L.divIcon({
              html: cityHtml,
              className: 'custom-border-city',
              iconSize: [110, 22],
              iconAnchor: [55, 11],
            });
            neighborsGroup.addLayer(L.marker([label.lat, label.lng], { icon, interactive: false }));
          }
        });
      }
    }
  }, [mapTheme, showNeighborStates]);

  // Render Realistic Highways
  useEffect(() => {
    const layer = highwaysLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    HIGHWAY_NETWORK.forEach((hw) => {
      const line = L.polyline(hw.points, {
        color: highContrast ? '#b91c1c' : '#dc2626',
        weight: highContrast ? 2.5 : 2.0,
        opacity: highContrast ? 0.75 : 0.55,
        dashArray: '6, 4',
      });
      layer.addLayer(line);
    });
  }, [highContrast]);

  // Render High-Contrast CPAI Polygons, Regional Badges, and Battalion Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyLayer = polygonsLayerRef.current;
    const labelsLayer = cpaiLabelsLayerRef.current;
    const markLayer = markersLayerRef.current;
    if (!map || !polyLayer || !labelsLayer || !markLayer) return;

    polyLayer.clearLayers();
    labelsLayer.clearLayers();
    markLayer.clearLayers();

    allCPAIs.forEach((cpai) => {
      const isSelected = selectedCPAIId === cpai.id;
      const isDimmed = selectedCPAIId !== null && !isSelected;
      const contrast = HIGH_CONTRAST_PALETTE[cpai.id];

      const fillColor = highContrast ? (contrast?.fill || cpai.cor) : cpai.cor;
      const borderColor = isSelected
        ? '#ffffff'
        : highContrast
        ? (contrast?.border || '#0f172a')
        : (cpai.corEscura || cpai.cor);

      const fillOpacity = isDimmed
        ? 0.12
        : isSelected
        ? 0.78
        : highContrast
        ? 0.52 // Enhanced presentation contrast: vibrant, solid and clearly distinguished
        : 0.28;

      const polygonCoords = getCPAIPolygon(cpai);
      if (polygonCoords.length > 2) {
        const poly = L.polygon(polygonCoords, {
          color: borderColor,
          weight: isSelected ? 4.5 : highContrast ? 3.0 : 2.0,
          opacity: isDimmed ? 0.25 : 0.95,
          fillColor: fillColor,
          fillOpacity: fillOpacity,
        });

        poly.on('click', () => {
          onSelectCPAI(isSelected ? null : cpai.id);
        });

        poly.bindTooltip(
          `<strong>${cpai.id}</strong><br/>${cpai.batalhoes.length} Batalhões Subordinados`,
          { sticky: true, className: 'cpi-leaflet-tooltip' }
        );

        polyLayer.addLayer(poly);
      }

      // 1. Prominent Floating Region Badge in Centroid
      const centroid = CPAI_CENTROIDS[cpai.id] || [-5.0, -45.0];
      const badgeHtml = `
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          background: ${isSelected ? '#ffffff' : '#002B55'};
          color: ${isSelected ? (contrast?.border || '#002B55') : '#ffffff'};
          border: 2.5px solid ${isSelected ? (contrast?.border || '#002B55') : '#facc15'};
          box-shadow: 0 4px 14px rgba(0,0,0,0.55);
          padding: 3px 9px;
          border-radius: 9999px;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          pointer-events: auto;
          transition: transform 0.15s ease;
        ">
          <span style="width: 9px; height: 9px; border-radius: 50%; background: ${fillColor}; border: 1.5px solid #ffffff; flex-shrink: 0;"></span>
          <span>${cpai.id}</span>
          <span style="font-size: 9.5px; opacity: 0.85; font-weight: 700; background: rgba(0,0,0,0.25); padding: 0.5px 5px; border-radius: 9999px;">${cpai.batalhoes.length} BPMs</span>
        </div>
      `;

      const badgeIcon = L.divIcon({
        html: badgeHtml,
        className: 'static-cpai-badge',
        iconSize: [0, 0],
      });

      const badgeMarker = L.marker(centroid, {
        icon: badgeIcon,
        pane: 'cpaiLabelsPane',
        interactive: true,
      });

      badgeMarker.on('click', () => {
        onSelectCPAI(isSelected ? null : cpai.id);
      });

      labelsLayer.addLayer(badgeMarker);

      // 2. Battalion Markers with High Contrast and Clutter Prevention
      cpai.batalhoes.forEach((bat) => {
        const isBatSelected = isSelected;
        const isCosar = bat.cosar;

        let iconHtml = '';

        if (isCosar) {
          // Special distinct badge for COSAR in Bacabal
          iconHtml = `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background: #047857;
              color: #ffffff;
              font-size: 11px;
              font-weight: 900;
              padding: 2.5px 8px;
              border-radius: 9999px;
              border: 2px solid #facc15;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              cursor: pointer;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span>🌲</span>
              <span>COSAR</span>
              <span style="opacity: 0.85; font-size: 9.5px;">(${bat.numero})</span>
            </div>
          `;
        } else if (detailedLabels) {
          // Detailed Mode: Shows BPM number + Headquarters city
          iconHtml = `
            <div style="
              display: flex;
              align-items: center;
              gap: 3px;
              background: ${isBatSelected ? '#ffffff' : (contrast?.badge || cpai.cor)};
              color: ${isBatSelected ? (contrast?.border || '#000000') : '#ffffff'};
              font-size: 10px;
              font-weight: 900;
              padding: 2px 6px;
              border-radius: 5px;
              border: 1.5px solid ${isBatSelected ? (contrast?.border || '#000') : '#ffffff'};
              box-shadow: 0 3px 8px rgba(0,0,0,0.45);
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <span>${bat.numero}</span>
              <span style="font-size: 8.5px; opacity: 0.9; font-weight: 700;">(${bat.sede})</span>
            </div>
          `;
        } else {
          // Compact Mode: High contrast circular badge (avoids overlapping clutters)
          iconHtml = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${isBatSelected ? '#ffffff' : (contrast?.badge || cpai.cor)};
              color: ${isBatSelected ? (contrast?.border || '#000000') : '#ffffff'};
              font-size: 10.5px;
              font-weight: 900;
              padding: 2px 6px;
              border-radius: 9999px;
              border: 2px solid ${isBatSelected ? (contrast?.border || '#000') : '#ffffff'};
              box-shadow: 0 3px 8px rgba(0,0,0,0.5);
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              ${bat.numero}
            </div>
          `;
        }

        const icon = L.divIcon({
          html: iconHtml,
          className: 'static-bat-marker',
          iconSize: [0, 0],
        });

        const marker = L.marker([bat.sedeLat, bat.sedeLng], { icon });
        marker.on('click', () => {
          onSelectBattalion(bat, cpai);
        });

        marker.bindTooltip(
          `<strong>${bat.numero} — ${bat.nome}</strong><br/>Sede: <strong>${bat.sede}</strong>${
            isCosar ? '<br/><span style="color:#059669;font-weight:bold;">🌲 Base Estadual COSAR</span>' : ''
          }`,
          { direction: 'top', offset: [0, -10] }
        );

        markLayer.addLayer(marker);
      });
    });

    // Animate map when selection changes
    if (selectedCPAIId) {
      const selected = allCPAIs.find((c) => c.id === selectedCPAIId);
      if (selected) {
        const bounds = getCPAIBounds(selected);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10, animate: true, duration: 1 });
      }
    } else {
      const bounds = getMaranhaoBounds();
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8, animate: true, duration: 1 });
    }
  }, [allCPAIs, selectedCPAIId, highContrast, detailedLabels, onSelectCPAI, onSelectBattalion]);

  const handleResetView = () => {
    onSelectCPAI(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(getMaranhaoBounds(), {
        padding: [20, 20],
        maxZoom: 8,
        animate: true,
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] flex flex-col select-none overflow-hidden font-sans">
      {/* 1. TOP POSTER HEADER - ONLY PMMA CREST (Left crest removed per user request) */}
      <header
        id="static-poster-header"
        className="bg-white border-b-2 border-slate-800 shadow-md px-3 sm:px-6 py-2.5 flex items-center justify-between z-30 shrink-0"
      >
        {/* Left: APENAS O BRASÃO DA PMMA (Símbolo da esquerda removido) */}
        <div className="flex items-center gap-3">
          <BrasaoPMMA className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md flex-shrink-0" />
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-600 uppercase block leading-tight">
              ESTADO DO MARANHÃO • SECRETARIA DE SEGURANÇA PÚBLICA
            </span>
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight font-serif uppercase leading-tight">
              POLÍCIA MILITAR DO MARANHÃO
            </h1>
          </div>
        </div>

        {/* Center: CPI Title & Quick Subunidades Button */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002D5C] text-white font-black text-xs uppercase tracking-wider shadow-sm border border-amber-400/40">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>COMANDOS DO POLICIAMENTO DO INTERIOR (CPI)</span>
          </div>

          {onOpenSubunidades && (
            <button
              onClick={onOpenSubunidades}
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm border border-amber-500 transition flex items-center gap-1.5 cursor-pointer"
              title="Pesquisar localização exata de Companhias e Pelotões de cada Batalhão"
            >
              <Building2 className="w-4 h-4 text-slate-900" />
              <span>Onde Ficam Cias & Pelotões (PDF)</span>
            </button>
          )}
        </div>

        {/* Right: Switch Mode + CPI Crest */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-300 shadow-inner">
            <button
              onClick={() => {}}
              className="px-2.5 py-1 rounded bg-[#002D5C] text-amber-300 font-black text-xs shadow-xs flex items-center gap-1.5 cursor-default"
              title="Você está no Modo Mapa Estático Realista com Leaflet"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mapa Realista</span>
            </button>
            <button
              onClick={onSwitchToInteractive}
              className="px-2.5 py-1 rounded hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ml-1"
              title="Alternar para o Modo Mapa Interativo Completo com barra lateral e painéis"
            >
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">Modo Interativo</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <BrasaoCPI className="w-9 h-11 sm:w-11 sm:h-14 drop-shadow-md hover:scale-105 transition-transform" />
          </div>
        </div>
      </header>

      {/* 2. CPAI QUICK SELECTION BAR */}
      <div className="bg-[#002B55] text-white px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-xs border-b border-white/10 z-20 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1 mr-1 flex-shrink-0">
            <Shield className="w-3.5 h-3.5" />
            CPAI:
          </span>

          <button
            onClick={handleResetView}
            className={`px-2.5 py-1 rounded text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCPAIId === null
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            Maranhão Completo
          </button>

          {allCPAIs.map((cpai) => {
            const isSelected = selectedCPAIId === cpai.id;
            return (
              <button
                key={cpai.id}
                onClick={() => onSelectCPAI(isSelected ? null : cpai.id)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-white text-slate-950 font-black shadow-md'
                    : 'text-white hover:opacity-90 border border-white/20'
                }`}
                style={{
                  backgroundColor: isSelected ? '#ffffff' : cpai.cor,
                  color: isSelected ? cpai.corEscura : '#ffffff',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/40"
                  style={{ backgroundColor: cpai.cor }}
                />
                <span>{cpai.id}</span>
              </button>
            );
          })}
        </div>

        {/* Controls: Estados ao Redor, Alto Contraste, Rótulos, e Temas de Mapa */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold flex-wrap justify-end">
          {/* BOTÃO SOLICITADO: Ativar/Desativar Visualização dos Estados ao Redor */}
          <button
            onClick={() => setShowNeighborStates(!showNeighborStates)}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              showNeighborStates
                ? 'bg-emerald-500 text-white font-black ring-1 ring-white'
                : 'bg-white/15 hover:bg-white/25 text-slate-100 border border-white/20'
            }`}
            title={
              showNeighborStates
                ? 'Estados ao redor VISÍVEIS (Pará, Tocantins, Piauí, etc.). Clique para ocultar e isolar apenas o Maranhão'
                : 'Clique para ATIVAR a visualização dos Estados ao Redor (Pará, Tocantins, Piauí, Ceará)'
            }
          >
            {showNeighborStates ? (
              <>
                <Eye className="w-3.5 h-3.5 text-white" />
                <span>Estados ao Redor: ON</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                <span>Ativar Estados ao Redor</span>
              </>
            )}
          </button>

          {/* BOTÃO: Alto Contraste de Apresentação */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 cursor-pointer shadow-sm ${
              highContrast
                ? 'bg-amber-400 text-slate-950 font-black ring-1 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
            }`}
            title="Alternar paleta vibrante de Alto Contraste (ideal para projetores, TV e visualização militar nítida)"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Alto Contraste: {highContrast ? 'ON' : 'OFF'}</span>
          </button>

          {/* BOTÃO: Rótulos Detalhados */}
          <button
            onClick={() => setDetailedLabels(!detailedLabels)}
            className={`px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer hidden md:flex ${
              detailedLabels
                ? 'bg-blue-500 text-white font-black'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
            }`}
            title="Mostrar número do batalhão e nome da cidade-sede diretamente no mapa"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{detailedLabels ? 'Rótulos: Detalhados' : 'Rótulos: Compactos'}</span>
          </button>

          {/* Theme Selector (Cartográfica / Relevo / Satélite / Vetor) */}
          <div className="hidden lg:flex items-center gap-1 ml-1 pl-2 border-l border-white/20">
            <span className="text-slate-300 text-[10.5px]">Camada:</span>
            <button
              onClick={() => setMapTheme('cartografica')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                mapTheme === 'cartografica' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Mapa Cartográfico Oficial com cidades e rodovias"
            >
              Cartográfica
            </button>
            <button
              onClick={() => setMapTheme('relevo')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                mapTheme === 'relevo' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Mapa de Topografia e Relevo"
            >
              Relevo
            </button>
            <button
              onClick={() => setMapTheme('satelite')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                mapTheme === 'satelite' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Imagem de Satélite Híbrida de Alta Resolução"
            >
              Satélite
            </button>
            <button
              onClick={() => setMapTheme('vetorial')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                mapTheme === 'vetorial' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Vetor Puro com Fundo Institucional Limpo (ideal para apresentações e impressão)"
            >
              Vetor Puro
            </button>
          </div>
        </div>
      </div>

      {/* 3. REALISTIC LEAFLET MAP CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Controls (Zoom & Reset) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded bg-white hover:bg-slate-100 text-slate-800 font-black border border-slate-300 flex items-center justify-center transition cursor-pointer shadow-sm"
            title="Aproximar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded bg-white hover:bg-slate-100 text-slate-800 font-black border border-slate-300 flex items-center justify-center transition cursor-pointer shadow-sm"
            title="Afastar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="w-8 h-8 rounded bg-[#002D5C] hover:bg-[#003875] text-amber-300 font-black border border-white/20 flex items-center justify-center transition cursor-pointer shadow-sm"
            title="Reenquadrar Maranhão Completo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Quick Action: Procurar Companhias e Pelotões */}
        {onOpenSubunidades && (
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={onOpenSubunidades}
              className="px-3.5 py-2 rounded-lg bg-[#002D5C] hover:bg-[#003d7a] text-white font-black text-xs shadow-xl border-2 border-amber-400 flex items-center gap-2 cursor-pointer transition"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Onde Ficam Cias e Pelotões?</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-black">
                PDF
              </span>
            </button>
          </div>
        )}

        {/* Bottom Left Legend Box (Collapsible) */}
        <div className="absolute bottom-4 left-4 z-20 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-300 overflow-hidden text-xs">
          <div
            onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
            className="bg-[#002D5C] text-white px-3 py-1.5 flex items-center justify-between font-bold cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>CONVENÇÕES CARTOGRÁFICAS</span>
            </div>
            {isLegendCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>

          {!isLegendCollapsed && (
            <div className="p-2.5 space-y-1.5 text-[11px] text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-white shadow-xs"></span>
                <span>
                  <strong>Base COSAR</strong> (Bacabal/MA) — Op. Rurais & Selva
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-white shadow-xs"></span>
                <span>
                  <strong>Sede de Batalhão (BPM)</strong> — Comando de Unidade
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-red-600 border-t border-dashed border-red-600"></span>
                <span>
                  <strong>Rodovias Federais</strong> (BR-135, BR-222, BR-316, BR-010)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-[#002B55] rounded-xs shadow-2xs"></span>
                <span>
                  <strong>Divisa Estadual</strong> — Limite Territorial do Maranhão
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 text-[10.5px] font-bold flex items-center gap-1">
                <span className={showNeighborStates ? 'text-blue-700' : 'text-emerald-800'}>
                  {showNeighborStates ? '🌐' : '✓'}
                </span>
                <span className={showNeighborStates ? 'text-blue-800' : 'text-emerald-800'}>
                  {showNeighborStates
                    ? 'Estados vizinhos visíveis para contexto geográfico'
                    : 'Visualização Exclusiva do Maranhão (sem interferência externa)'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                Divisão Policial Militar Oficial • Medida Provisória nº 542/2026
              </div>
            </div>
          )}
        </div>

        {/* Bottom Right Synopsis Table (Collapsible) */}
        <div className="absolute bottom-4 right-4 z-20 max-w-xs sm:max-w-md bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-300 overflow-hidden text-xs hidden md:block">
          <div
            onClick={() => setIsTableCollapsed(!isTableCollapsed)}
            className="bg-[#002D5C] text-white px-3 py-1.5 flex items-center justify-between font-bold cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>QUADRO SINÓPTICO DOS 9 CPAIs</span>
            </div>
            {isTableCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>

          {!isTableCollapsed && (
            <div className="max-h-48 overflow-y-auto p-1.5">
              <table className="w-full text-[10.5px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left py-0.5 px-1 font-bold">CPAI</th>
                    <th className="text-left py-0.5 px-1 font-bold">Batalhões Subordinados</th>
                    <th className="text-center py-0.5 px-1 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {allCPAIs.map((c) => {
                    const rowColor = highContrast ? (HIGH_CONTRAST_PALETTE[c.id]?.fill || c.cor) : c.cor;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => onSelectCPAI(selectedCPAIId === c.id ? null : c.id)}
                        className={`hover:bg-slate-100 cursor-pointer transition ${
                          selectedCPAIId === c.id ? 'bg-amber-100 font-bold' : ''
                        }`}
                      >
                        <td className="py-1 px-1 flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: rowColor }} />
                          <span className="font-bold">{c.id}</span>
                        </td>
                        <td className="py-1 px-1 text-slate-600 truncate max-w-[200px]">
                          {c.batalhoes.map((b) => b.numero).join(', ')}
                        </td>
                        <td className="py-1 px-1 text-center font-bold text-slate-800">
                          {c.batalhoes.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
