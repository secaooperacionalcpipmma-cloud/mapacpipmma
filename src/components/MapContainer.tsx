import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CPAI, Battalion, Municipality, FilterType } from '../types/cpi';
import {
  getCPAIPolygon,
  getCPAIBounds,
  getMaranhaoBounds,
  getCPAICentroid,
  MARANHAO_CENTER,
  MARANHAO_DEFAULT_ZOOM,
  NEIGHBOR_LABELS,
  HIGHWAY_NETWORK,
  MARANHAO_OUTER_BOUNDARY,
  getMaranhaoMaskPolygon,
} from '../utils/geoUtils';
import { Maximize2, Minimize2, RotateCcw, Monitor, Layers } from 'lucide-react';
import { MapTileTheme } from './ProjectionHUD';
import { OfficialPosterOverlay } from './OfficialPosterOverlay';

interface MapContainerProps {
  allCPAIs: CPAI[];
  selectedCPAIId: string | null;
  selectedBattalionId: string | null;
  activeFilter: FilterType;
  showMunicipalities: boolean;
  showPolygons: boolean;
  showLabels?: boolean;
  mapTheme?: MapTileTheme;
  isProjectionMode?: boolean;
  isPosterView?: boolean;
  onTogglePosterView?: () => void;
  onEnterProjection?: () => void;
  onSelectCPAI: (id: string | null) => void;
  onSelectBattalion: (bat: Battalion, cpai: CPAI) => void;
  onSelectMunicipality: (
    mun: Municipality,
    bat: Battalion,
    cpai: CPAI
  ) => void;
}

const TILE_URLS: Record<MapTileTheme, { url: string; subdomains: string | string[]; maxZoom: number }> = {
  'google-roadmap': {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
  },
  'google-hybrid': {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
  },
  'google-terrain': {
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
  },
  voyager: {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
  },
  dark: {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
  },
  satellite: {
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    maxZoom: 19,
  },
};

export const MapContainer: React.FC<MapContainerProps> = ({
  allCPAIs,
  selectedCPAIId,
  selectedBattalionId,
  activeFilter,
  showMunicipalities,
  showPolygons,
  showLabels = true,
  mapTheme = 'voyager',
  isProjectionMode = false,
  isPosterView = false,
  onTogglePosterView,
  onEnterProjection,
  onSelectCPAI,
  onSelectBattalion,
  onSelectMunicipality,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const currentThemeRef = useRef<MapTileTheme>(mapTheme);

  const maskLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const cpaiLabelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const highwaysLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const neighborLabelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const battalionsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const municipalitiesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const maxBounds: L.LatLngBoundsExpression = [
      [-11.2, -49.6],
      [-0.4, -40.6],
    ];

    const map = L.map(mapContainerRef.current, {
      center: MARANHAO_CENTER,
      zoom: MARANHAO_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: maxBounds,
      maxBoundsViscosity: 1.0,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    const cfg = TILE_URLS[mapTheme] || TILE_URLS['google-roadmap'];
    const tileLayer = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;
    currentThemeRef.current = mapTheme;

    // Create custom pane for the Inverse Mask
    const maskPane = map.createPane('maranhaoMaskPane');
    maskPane.style.zIndex = '350';

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution
    L.control
      .attribution({
        position: 'bottomright',
        prefix: 'PMMA / CPI • Cartografia Maranhão (MP nº 542/2026)',
      })
      .addTo(map);

    // Create Layer Groups in optimal z-index stack order
    maskLayerGroupRef.current = L.layerGroup().addTo(map);
    polygonsLayerGroupRef.current = L.layerGroup().addTo(map);
    highwaysLayerGroupRef.current = L.layerGroup().addTo(map);
    neighborLabelsLayerGroupRef.current = L.layerGroup().addTo(map);
    cpaiLabelsLayerGroupRef.current = L.layerGroup().addTo(map);
    municipalitiesLayerGroupRef.current = L.layerGroup().addTo(map);
    battalionsLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Initial fit without animation
    try {
      const bounds = getMaranhaoBounds(allCPAIs);
      map.fitBounds(bounds, { padding: [20, 20], animate: false });
    } catch {
      map.setView(MARANHAO_CENTER, MARANHAO_DEFAULT_ZOOM);
    }

    return () => {
      try {
        map.stop();
        map.remove();
      } catch {
        // Safe cleanup
      }
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      maskLayerGroupRef.current = null;
      polygonsLayerGroupRef.current = null;
      highwaysLayerGroupRef.current = null;
      neighborLabelsLayerGroupRef.current = null;
      cpaiLabelsLayerGroupRef.current = null;
      battalionsLayerGroupRef.current = null;
      municipalitiesLayerGroupRef.current = null;
    };
  }, []);

  // Handle map theme change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || currentThemeRef.current === mapTheme) return;

    currentThemeRef.current = mapTheme;

    try {
      if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
        map.removeLayer(tileLayerRef.current);
      }

      const cfg = TILE_URLS[mapTheme] || TILE_URLS.voyager;
      const newTile = L.tileLayer(cfg.url, {
        subdomains: cfg.subdomains,
        maxZoom: cfg.maxZoom,
      }).addTo(map);

      tileLayerRef.current = newTile;
      newTile.bringToBack();
    } catch (err) {
      console.warn('Could not update map theme layer:', err);
    }
  }, [mapTheme]);

  // Handle map resizing when projection or poster mode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      try {
        map.invalidateSize({ pan: false });
        if (!selectedCPAIId && !selectedBattalionId) {
          const bounds = getMaranhaoBounds(allCPAIs);
          map.fitBounds(bounds, { padding: [30, 30], animate: false });
        }
      } catch (err) {
        console.warn('Map resize error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isProjectionMode, isPosterView]);

  // Update Layers when CPAI, filters, or selections change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const maskGroup = maskLayerGroupRef.current;
    const polyGroup = polygonsLayerGroupRef.current;
    const highwaysGroup = highwaysLayerGroupRef.current;
    const neighborGroup = neighborLabelsLayerGroupRef.current;
    const cpaiLabelsGroup = cpaiLabelsLayerGroupRef.current;
    const batGroup = battalionsLayerGroupRef.current;
    const munGroup = municipalitiesLayerGroupRef.current;

    if (!polyGroup || !batGroup || !munGroup || !highwaysGroup || !neighborGroup || !cpaiLabelsGroup) return;

    if (maskGroup) maskGroup.clearLayers();
    polyGroup.clearLayers();
    highwaysGroup.clearLayers();
    neighborGroup.clearLayers();
    cpaiLabelsGroup.clearLayers();
    batGroup.clearLayers();
    munGroup.clearLayers();

    // 1. Draw Maranhão Boundary & Inverse Mask (Hiding neighboring states completely)
    if (maskGroup) {
      const isDarkTheme = mapTheme === 'dark' || mapTheme === 'satellite' || mapTheme === 'google-hybrid';
      const maskBgColor = isDarkTheme ? '#090d16' : '#f8fafc';
      const borderColor = isDarkTheme ? '#38bdf8' : '#002B55';

      // Solid Polygon covering all surrounding states outside Maranhão
      const maskPolygon = L.polygon(getMaranhaoMaskPolygon(), {
        pane: 'maranhaoMaskPane',
        stroke: false,
        fillColor: maskBgColor,
        fillOpacity: 1.0,
        interactive: false,
      });
      maskGroup.addLayer(maskPolygon);

      // Official State Boundary Line
      const borderLine = L.polyline(MARANHAO_OUTER_BOUNDARY, {
        pane: 'maranhaoMaskPane',
        color: borderColor,
        weight: 3.5,
        opacity: 0.95,
        interactive: false,
      });
      maskGroup.addLayer(borderLine);

      // Border halo for visual elevation
      const borderHalo = L.polyline(MARANHAO_OUTER_BOUNDARY, {
        pane: 'maranhaoMaskPane',
        color: isDarkTheme ? 'rgba(56,189,248,0.2)' : 'rgba(0,43,85,0.15)',
        weight: 8,
        opacity: 0.8,
        interactive: false,
      });
      maskGroup.addLayer(borderHalo);
    }

    // 2. Draw Federal Highways (BR Network)
    HIGHWAY_NETWORK.forEach((hw) => {
      const polyline = L.polyline(hw.points, {
        color: hw.color,
        weight: 2.2,
        opacity: 0.7,
        dashArray: '6, 4',
      });
      polyline.bindTooltip(
        `<span class="font-bold text-xs">${hw.name}</span> <span class="text-[10px] text-slate-500">(Rodovia Federal)</span>`,
        { sticky: true }
      );
      highwaysGroup.addLayer(polyline);
    });

    // 3. Draw CPAI Polygons and Centroid Titles
    if (showPolygons) {
      allCPAIs.forEach((cpai) => {
        const isCPAISelected = selectedCPAIId === cpai.id;
        const isDimmed = selectedCPAIId !== null && !isCPAISelected;

        const coords = getCPAIPolygon(cpai);
        if (coords.length > 2) {
          const latLngs = coords.map(([lat, lng]) => L.latLng(lat, lng));

          const polygon = L.polygon(latLngs, {
            color: cpai.corEscura || '#1e293b',
            weight: isCPAISelected ? 3.5 : 2.0,
            opacity: isDimmed ? 0.3 : 0.9,
            fillColor: cpai.cor,
            fillOpacity: isCPAISelected ? 0.45 : isDimmed ? 0.08 : 0.28,
            dashArray: cpai.isNovo ? '6, 4' : undefined,
          });

          polygon.bindTooltip(
            `<div class="text-xs p-1">
              <strong style="color: ${cpai.cor}">${cpai.id}</strong><br/>
              <span>${cpai.batalhoes.length} Unidades • ${cpai.batalhoes.reduce(
              (acc, b) => acc + b.municipios.length,
              0
            )} Municípios</span>
              ${cpai.isNovo ? '<br/><span class="text-purple-700 font-bold">★ MP nº 542/2026</span>' : ''}
            </div>`,
            { sticky: true }
          );

          polygon.on('click', () => {
            onSelectCPAI(cpai.id);
          });

          polyGroup.addLayer(polygon);

          // 4. Draw Big CPAI Watermark / Centroid Label (like in the print)
          if (showLabels) {
            const centroid = getCPAICentroid(cpai);
            const cpaiBadgeHtml = `
              <div class="cursor-pointer select-none text-center transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-115">
                <div class="px-2 py-0.5 rounded shadow-sm border font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1"
                     style="background-color: ${cpai.cor}; color: #ffffff; border-color: ${cpai.corEscura}; box-shadow: 0 2px 5px rgba(0,0,0,0.25)">
                  <span>${cpai.id}</span>
                  ${cpai.isNovo ? '<span class="text-amber-200 text-[9px]">★</span>' : ''}
                </div>
              </div>
            `;
            const cpaiIcon = L.divIcon({
              className: 'custom-cpai-centroid',
              html: cpaiBadgeHtml,
              iconSize: [80, 30],
              iconAnchor: [40, 15],
            });

            const cpaiMarker = L.marker(centroid, { icon: cpaiIcon });
            cpaiMarker.on('click', () => {
              onSelectCPAI(cpai.id);
            });
            cpaiLabelsGroup.addLayer(cpaiMarker);
          }
        }
      });
    }

    // 5. Draw Battalion HQ Markers (Estrela PMMA Style)
    allCPAIs.forEach((cpai) => {
      // If a CPAI is selected, only show markers for that CPAI to eliminate visual pollution
      if (selectedCPAIId !== null && selectedCPAIId !== cpai.id) {
        return;
      }

      const isCPAIActive = true;

      cpai.batalhoes.forEach((bat) => {
        // Apply Feature Filters
        if (activeFilter === 'ft' && !bat.ft) return;
        if (activeFilter === 'goe' && !bat.goe) return;
        if (activeFilter === 'cosar' && !bat.cosar) return;
        if (activeFilter === 'novos' && !bat.isNovo && !bat.migradoDe && !cpai.isNovo) return;
        if (activeFilter === 'especiais' && bat.tipo === 'BPM') return;

        const isBatSelected = selectedBattalionId === bat.id;

        // Custom HTML Marker Icon with PMMA Star and Badges
        const markerHtml = `
          <div class="group relative cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-115">
            <div class="flex items-center gap-1 px-2 py-1 rounded shadow-md border text-[11px] font-bold text-white whitespace-nowrap"
                 style="background-color: ${cpai.cor}; border-color: ${isBatSelected ? '#ffffff' : cpai.corEscura}; box-shadow: ${
          isBatSelected
            ? '0 0 0 3px #3b82f6, 0 8px 16px rgba(0,0,0,0.35)'
            : '0 4px 8px rgba(0,0,0,0.22)'
        }">
              
              <!-- Red Star Emblem (PMMA Estrela) -->
              <span class="text-red-700 font-serif text-xs filter drop-shadow-2xs">⭐️</span>
              
              <span>${bat.numero}</span>
              
              <!-- COSAR Badge -->
              ${
                bat.cosar
                  ? `<span class="bg-emerald-600 text-white border border-emerald-300 text-[8.5px] px-1 rounded-2xs font-black shadow-2xs" title="COSAR: Base Operacional em Bacabal/MA (Comando de Operações e Sobrevivência em Áreas Rurais)">COSAR</span>`
                  : ''
              }

              <!-- FT Badge -->
              ${
                bat.ft
                  ? `<span class="bg-blue-600 text-white border border-blue-400 text-[8.5px] px-1 rounded-2xs font-black shadow-2xs" title="Força Tática: SIM (${bat.efetivoFT} efetivo)">FT</span>`
                  : ''
              }

              <!-- GOE Badge -->
              ${
                bat.goe
                  ? `<span class="bg-amber-500 text-white border border-amber-300 text-[8.5px] px-1 rounded-2xs font-black shadow-2xs" title="GOE: SIM (${bat.efetivoGOE} efetivo)">GOE</span>`
                  : ''
              }

              <!-- Novo / Migrado Badge -->
              ${
                bat.isNovo || cpai.isNovo
                  ? `<span class="text-[9px] text-amber-200">★</span>`
                  : ''
              }
            </div>

            <!-- Sede Label below marker -->
            ${
              showLabels
                ? `<div class="text-center mt-0.5 pointer-events-none">
                    <span class="inline-block bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm border border-slate-700 whitespace-nowrap">
                      ${bat.sede} ${bat.cosar ? '• COSAR' : ''}
                    </span>
                  </div>`
                : ''
            }
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: markerHtml,
          iconSize: [85, 42],
          iconAnchor: [42, 21],
        });

        const marker = L.marker([bat.sedeLat, bat.sedeLng], {
          icon: customIcon,
          zIndexOffset: isBatSelected ? 1000 : 500,
        });

        marker.on('click', () => {
          onSelectBattalion(bat, cpai);
        });

        batGroup.addLayer(marker);

        // 6. Draw Subordinate Municipalities (if enabled or CPAI selected)
        if (showMunicipalities || isCPAIActive) {
          bat.municipios.forEach((mun) => {
            if (mun.isSede) return; // Sede is already shown as BPM marker

            const munCircle = L.circleMarker([mun.lat, mun.lng], {
              radius: 4.5,
              color: cpai.corEscura,
              fillColor: cpai.cor,
              fillOpacity: isCPAIActive ? 0.85 : 0.25,
              weight: 1.5,
            });

            munCircle.bindTooltip(
              `<div class="text-[11px] font-medium leading-tight">
                <strong>${mun.nome}</strong><br/>
                <span class="text-slate-300">Resp: ${bat.numero} (${cpai.id})</span>
              </div>`,
              { sticky: true }
            );

            munCircle.on('click', () => {
              onSelectMunicipality(mun, bat, cpai);
            });

            munGroup.addLayer(munCircle);
          });
        }
      });
    });
  }, [
    allCPAIs,
    selectedCPAIId,
    selectedBattalionId,
    activeFilter,
    showMunicipalities,
    showPolygons,
    showLabels,
    onSelectCPAI,
    onSelectBattalion,
    onSelectMunicipality,
  ]);

  // Handle Zoom and Center changes when CPAI or Battalion is selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (activeFilter === 'cosar') {
        map.stop();
        map.flyTo([-4.2431, -44.7806], 10, { duration: 1.0 });
        return;
      }

      if (selectedBattalionId) {
        // Find battalion
        for (const cpai of allCPAIs) {
          const bat = cpai.batalhoes.find((b) => b.id === selectedBattalionId);
          if (bat) {
            map.stop();
            map.flyTo([bat.sedeLat, bat.sedeLng], 10, { duration: 1.0 });
            return;
          }
        }
      }

      if (selectedCPAIId) {
        const cpai = allCPAIs.find((c) => c.id === selectedCPAIId);
        if (cpai) {
          const bounds = getCPAIBounds(cpai);
          map.stop();
          map.flyToBounds(bounds, { duration: 1.0, padding: [40, 40] });
          return;
        }
      }
    } catch (err) {
      console.warn('Map animation error:', err);
    }
  }, [selectedCPAIId, selectedBattalionId, activeFilter, allCPAIs]);

  const handleResetToMaranhao = () => {
    const map = mapInstanceRef.current;
    if (map) {
      try {
        const bounds = getMaranhaoBounds(allCPAIs);
        map.stop();
        map.flyToBounds(bounds, { duration: 1.0, padding: [30, 30] });
      } catch {
        map.setView(MARANHAO_CENTER, MARANHAO_DEFAULT_ZOOM);
      }
      onSelectCPAI(null);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full flex-1 bg-slate-950 overflow-hidden">
      {/* Leaflet Map Root */}
      <div
        id="leaflet-map-root"
        ref={mapContainerRef}
        className="w-full h-full"
      />

      {/* Official Poster Overlay (Visual do Print PMMA) */}
      {isPosterView && (
        <OfficialPosterOverlay
          allCPAIs={allCPAIs}
          selectedCPAIId={selectedCPAIId}
          onSelectCPAI={onSelectCPAI}
          onSelectBattalion={onSelectBattalion}
          isPosterView={isPosterView}
          onTogglePosterView={onTogglePosterView}
        />
      )}

      {/* Floating Isolated CPAI Indicator */}
      {selectedCPAIId && !isPosterView && (
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-xl border-2 border-slate-800 flex items-center gap-3 select-none">
          <div
            className="w-3.5 h-3.5 rounded-full shadow-xs flex-shrink-0"
            style={{
              backgroundColor: allCPAIs.find((c) => c.id === selectedCPAIId)?.cor || '#3b82f6',
            }}
          />
          <div>
            <div className="text-xs font-black text-slate-900 uppercase">
              FOCO OPERACIONAL: {selectedCPAIId}
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              Exibindo apenas as unidades do {selectedCPAIId}
            </div>
          </div>
          <button
            onClick={() => onSelectCPAI(null)}
            className="ml-2 px-2.5 py-1 rounded bg-[#002D5C] hover:bg-[#001D3D] text-amber-300 font-black text-[10.5px] uppercase tracking-wider transition cursor-pointer shadow-xs"
          >
            Ver Todo o Maranhão
          </button>
        </div>
      )}

      {/* Floating Map Actions (Top Right) - When NOT in poster mode or in projection mode */}
      {!isProjectionMode && !isPosterView && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {onTogglePosterView && (
            <button
              onClick={onTogglePosterView}
              className="p-2 rounded bg-amber-400 text-slate-950 shadow-xl border border-amber-300 hover:bg-amber-300 transition flex items-center gap-1.5 text-xs font-black backdrop-blur cursor-pointer"
              title="Alternar para o Modo Cartaz Oficial PMMA (Visual Oficial)"
            >
              <Layers className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Modo Cartaz PMMA</span>
            </button>
          )}

          {onEnterProjection && (
            <button
              onClick={onEnterProjection}
              className="p-2 rounded bg-[#003366] text-white shadow-xl border border-blue-400/40 hover:bg-[#002244] transition flex items-center gap-1.5 text-xs font-bold backdrop-blur cursor-pointer"
              title="Modo Projeção / Apenas Mapa (Oculta painéis para telão)"
            >
              <Monitor className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Apenas Mapa</span>
            </button>
          )}

          <button
            onClick={handleResetToMaranhao}
            className="p-2 rounded bg-white/95 text-slate-700 shadow-lg border border-slate-200 hover:bg-slate-50 hover:text-[#003366] transition flex items-center gap-1.5 text-xs font-bold backdrop-blur cursor-pointer"
            title="Enquadrar todo o Estado do Maranhão"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#003366]" />
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Maranhão</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded bg-white/95 text-slate-700 shadow-lg border border-slate-200 hover:bg-slate-50 hover:text-[#003366] transition flex items-center justify-center backdrop-blur cursor-pointer"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-[#003366]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-[#003366]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
