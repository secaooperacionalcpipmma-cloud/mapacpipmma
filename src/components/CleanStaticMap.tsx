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
} from 'lucide-react';
import {
  getCPAIPolygon,
  getCPAIBounds,
  getMaranhaoBounds,
  MARANHAO_CENTER,
  MARANHAO_DEFAULT_ZOOM,
  HIGHWAY_NETWORK,
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
  const polygonsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const highwaysLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<'voyager' | 'terrain' | 'satellite'>('voyager');
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MARANHAO_CENTER,
      zoom: MARANHAO_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      minZoom: 6,
      maxZoom: 16,
      fadeAnimation: true,
    });

    mapInstanceRef.current = map;

    // Tile Layer: Default Voyager for high-contrast official cartographic aesthetic
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer Groups
    polygonsLayerRef.current = L.layerGroup().addTo(map);
    highwaysLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Initial fit
    const bounds = getMaranhaoBounds();
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Theme
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains: string | string[] = 'abcd';

    if (mapTheme === 'terrain') {
      url = 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      subdomains = ['0', '1', '2', '3'];
    } else if (mapTheme === 'satellite') {
      url = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      subdomains = ['0', '1', '2', '3'];
    }

    const newTileLayer = L.tileLayer(url, { subdomains, maxZoom: 19 }).addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapTheme]);

  // Render Realistic Highways
  useEffect(() => {
    const layer = highwaysLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    HIGHWAY_NETWORK.forEach((hw) => {
      const line = L.polyline(hw.points, {
        color: '#b91c1c',
        weight: 2,
        opacity: 0.6,
        dashArray: '5, 5',
      });
      layer.addLayer(line);
    });
  }, []);

  // Render CPAI Polygons and Battalion Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyLayer = polygonsLayerRef.current;
    const markLayer = markersLayerRef.current;
    if (!map || !polyLayer || !markLayer) return;

    polyLayer.clearLayers();
    markLayer.clearLayers();

    allCPAIs.forEach((cpai) => {
      const isSelected = selectedCPAIId === cpai.id;
      const isDimmed = selectedCPAIId !== null && !isSelected;

      const polygonCoords = getCPAIPolygon(cpai);
      if (polygonCoords.length > 2) {
        const poly = L.polygon(polygonCoords, {
          color: cpai.corEscura || cpai.cor,
          weight: isSelected ? 3.5 : 2,
          opacity: isDimmed ? 0.25 : 0.9,
          fillColor: cpai.cor,
          fillOpacity: isDimmed ? 0.08 : isSelected ? 0.45 : 0.25,
        });

        poly.on('click', () => {
          onSelectCPAI(isSelected ? null : cpai.id);
        });

        // Tooltip
        poly.bindTooltip(
          `<strong>${cpai.id}</strong><br/>${cpai.batalhoes.length} Batalhões`,
          { sticky: true, className: 'cpi-leaflet-tooltip' }
        );

        polyLayer.addLayer(poly);
      }

      // Battalion Markers
      cpai.batalhoes.forEach((bat) => {
        const isBatSelected = isSelected;
        const isCosar = bat.cosar;

        // Custom HTML Marker Icon
        const iconHtml = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${isCosar ? '#059669' : cpai.cor};
            color: #ffffff;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 5px;
            border-radius: 4px;
            border: 1.5px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            ${isCosar ? '🌲 COSAR • ' : ''}${bat.numero}
          </div>
        `;

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
          `<strong>${bat.numero} — ${bat.nome}</strong><br/>Sede: ${bat.sede}${
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
  }, [allCPAIs, selectedCPAIId, onSelectCPAI, onSelectBattalion]);

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

        {/* Theme Selector (Voyager / Terrain / Satellite) */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold">
          <span className="text-slate-300 mr-1">Camada:</span>
          <button
            onClick={() => setMapTheme('voyager')}
            className={`px-2 py-0.5 rounded transition ${
              mapTheme === 'voyager' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Cartográfica
          </button>
          <button
            onClick={() => setMapTheme('terrain')}
            className={`px-2 py-0.5 rounded transition ${
              mapTheme === 'terrain' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Relevo
          </button>
          <button
            onClick={() => setMapTheme('satellite')}
            className={`px-2 py-0.5 rounded transition ${
              mapTheme === 'satellite' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Satélite
          </button>
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
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
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
                  {allCPAIs.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCPAI(selectedCPAIId === c.id ? null : c.id)}
                      className={`hover:bg-slate-100 cursor-pointer transition ${
                        selectedCPAIId === c.id ? 'bg-amber-100 font-bold' : ''
                      }`}
                    >
                      <td className="py-1 px-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.cor }} />
                        <span className="font-bold">{c.id}</span>
                      </td>
                      <td className="py-1 px-1 text-slate-600 truncate max-w-[200px]">
                        {c.batalhoes.map((b) => b.numero).join(', ')}
                      </td>
                      <td className="py-1 px-1 text-center font-bold text-slate-800">
                        {c.batalhoes.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
