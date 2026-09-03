import React, { useState } from 'react';
import { CPAI, FilterType } from '../types/cpi';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';
import {
  Monitor,
  Minimize2,
  Maximize2,
  RotateCcw,
  Layers,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';

export type MapTileTheme =
  | 'google-roadmap'
  | 'google-hybrid'
  | 'google-terrain'
  | 'voyager'
  | 'dark'
  | 'satellite'
  | 'street';

interface ProjectionHUDProps {
  allCPAIs: CPAI[];
  selectedCPAIId: string | null;
  activeFilter: FilterType;
  showMunicipalities: boolean;
  showPolygons: boolean;
  showLabels: boolean;
  mapTheme: MapTileTheme;
  isFullscreen: boolean;
  onExitProjection: () => void;
  onResetMaranhao: () => void;
  onSelectCPAI: (id: string | null) => void;
  onSelectFilter: (filter: FilterType) => void;
  onToggleMunicipalities: () => void;
  onTogglePolygons: () => void;
  onToggleLabels: () => void;
  onChangeMapTheme: (theme: MapTileTheme) => void;
  onToggleFullscreen: () => void;
}

export const ProjectionHUD: React.FC<ProjectionHUDProps> = ({
  allCPAIs,
  selectedCPAIId,
  activeFilter,
  showMunicipalities,
  showPolygons,
  showLabels,
  mapTheme,
  isFullscreen,
  onExitProjection,
  onResetMaranhao,
  onSelectCPAI,
  onSelectFilter,
  onToggleMunicipalities,
  onTogglePolygons,
  onToggleLabels,
  onChangeMapTheme,
  onToggleFullscreen,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  if (isMinimized) {
    return (
      <div
        id="cpi-projection-minimized-hud"
        className="absolute top-4 left-4 z-40 flex items-center gap-2"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 rounded bg-[#003366]/90 hover:bg-[#003366] text-white text-xs font-bold shadow-2xl border border-white/20 backdrop-blur-md transition cursor-pointer"
          title="Expandir barra de controle de projeção"
        >
          <Monitor className="w-4 h-4 text-blue-300" />
          <span className="uppercase tracking-wider text-[11px]">Controles do Telão</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/70" />
        </button>

        <button
          onClick={onResetMaranhao}
          className="p-2 rounded bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 backdrop-blur text-xs font-bold transition cursor-pointer"
          title="Enquadrar Estado do Maranhão"
        >
          <RotateCcw className="w-4 h-4 text-[#003366]" />
        </button>

        <button
          onClick={onExitProjection}
          className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xl border border-red-400/40 backdrop-blur transition flex items-center gap-1.5 cursor-pointer"
          title="Sair do modo tela cheia e voltar ao painel (ESC)"
        >
          <X className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-widest">Sair (ESC)</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="cpi-projection-full-hud"
      className="absolute top-3 inset-x-3 md:inset-x-6 z-40 max-w-6xl mx-auto flex flex-col gap-2 pointer-events-none"
    >
      {/* Main Floating Presentation Dock */}
      <div className="bg-[#002244]/95 text-white backdrop-blur-md rounded-md shadow-2xl border border-white/15 p-2.5 sm:p-3 pointer-events-auto flex flex-col gap-2.5">
        {/* Top Line: Brand, State Fit, Presentation Mode, Exit */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Institutional Badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 flex-shrink-0">
              <BrasaoCPI className="w-8 h-10 drop-shadow-md" />
              <BrasaoPMMA className="w-8 h-8 drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                  CPI / PMMA — SALA DE SITUAÇÃO
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  PROJEÇÃO HD
                </span>
                <span className="hidden sm:inline text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-amber-300 border border-white/20 uppercase">
                  MP 542/2026
                </span>
              </div>
              <p className="text-[9px] text-blue-200/70 uppercase tracking-widest hidden md:block">
                POLÍCIA MILITAR DO MARANHÃO • COMANDOS DO POLICIAMENTO DO INTERIOR
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Fit Maranhão */}
            <button
              onClick={onResetMaranhao}
              className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold border border-blue-400/40 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Enquadrar exatamente todo o Estado do Maranhão no telão"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span className="uppercase text-[10px] tracking-wider">Maranhão</span>
            </button>

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu((prev) => !prev)}
                className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition cursor-pointer"
                title="Alterar estilo visual do mapa (Claro / Noturno / Satélite)"
              >
                {mapTheme.startsWith('google') && <Globe className="w-3.5 h-3.5 text-blue-400" />}
                {mapTheme === 'voyager' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                {mapTheme === 'dark' && <Moon className="w-3.5 h-3.5 text-blue-300" />}
                {mapTheme === 'satellite' && <Globe className="w-3.5 h-3.5 text-emerald-300" />}
                <span className="uppercase text-[10px] tracking-wider hidden sm:inline">
                  {mapTheme === 'google-roadmap'
                    ? 'Google Maps'
                    : mapTheme === 'google-hybrid'
                    ? 'Google Satélite'
                    : mapTheme === 'google-terrain'
                    ? 'Google Relevo'
                    : mapTheme === 'voyager'
                    ? 'Claro'
                    : mapTheme === 'dark'
                    ? 'Tático Noturno'
                    : 'Satélite'}
                </span>
              </button>

              {showThemeMenu && (
                <div
                  onClick={() => setShowThemeMenu(false)}
                  className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded shadow-2xl p-1 z-50 text-xs font-medium space-y-1"
                >
                  <button
                    onClick={() => onChangeMapTheme('google-roadmap')}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left ${
                      mapTheme === 'google-roadmap' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google Maps (Ruas)</span>
                  </button>
                  <button
                    onClick={() => onChangeMapTheme('google-hybrid')}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left ${
                      mapTheme === 'google-hybrid' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Satélite (Híbrido)</span>
                  </button>
                  <button
                    onClick={() => onChangeMapTheme('google-terrain')}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left ${
                      mapTheme === 'google-terrain' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Google Relevo (Topografia)</span>
                  </button>
                  <button
                    onClick={() => onChangeMapTheme('voyager')}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left ${
                      mapTheme === 'voyager' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Carto Voyager (Claro)</span>
                  </button>
                  <button
                    onClick={() => onChangeMapTheme('dark')}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left ${
                      mapTheme === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-blue-300" />
                    <span>Tático Escuro (COPOM)</span>
                  </button>
                  <button
                    onClick={() => onChangeMapTheme('satellite')}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left ${
                      mapTheme === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Imagem Satélite</span>
                  </button>
                </div>
              )}
            </div>

            {/* Toggle Fullscreen Browser */}
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer"
              title={isFullscreen ? 'Sair da tela cheia do navegador' : 'Tela Cheia do Navegador (F11)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Minimize / Hide HUD Controls */}
            <button
              onClick={() => setIsMinimized(true)}
              className="px-2 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-1 transition cursor-pointer"
              title="Ocultar esta barra para visualização 100% limpa"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span className="hidden lg:inline uppercase text-[9px] tracking-wider">Ocultar Barra</span>
            </button>

            {/* Exit Projection Mode */}
            <button
              onClick={onExitProjection}
              className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md border border-red-400/40 flex items-center gap-1.5 transition cursor-pointer"
              title="Voltar ao Painel Completo do CPI (Atalho: ESC)"
            >
              <X className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px] tracking-widest">Sair (ESC)</span>
            </button>
          </div>
        </div>

        {/* Bottom Line: CPAI Quick Jump & Filter Toggles */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 flex-wrap text-xs">
          {/* CPAI Quick Jump Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-white/60 mr-1 flex-shrink-0 tracking-wider">
              CPAI:
            </span>
            <button
              onClick={() => onSelectCPAI(null)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex-shrink-0 ${
                selectedCPAIId === null
                  ? 'bg-white text-[#003366] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Todos (MA)
            </button>
            {allCPAIs.map((cpai) => {
              const isSelected = selectedCPAIId === cpai.id;
              return (
                <button
                  key={cpai.id}
                  onClick={() => onSelectCPAI(isSelected ? null : cpai.id)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'ring-2 ring-white text-white font-black shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  style={{
                    backgroundColor: isSelected ? cpai.cor : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-xs"
                    style={{ backgroundColor: cpai.cor }}
                  />
                  <span>{cpai.id}</span>
                  {cpai.isNovo && <span className="text-[8px] text-amber-300">★</span>}
                </button>
              );
            })}
          </div>

          {/* Quick Layer & Filter Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Filter FT */}
            <button
              onClick={() => onSelectFilter(activeFilter === 'ft' ? 'all' : 'ft')}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                activeFilter === 'ft'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              FT (318)
            </button>

            {/* Filter GOE */}
            <button
              onClick={() => onSelectFilter(activeFilter === 'goe' ? 'all' : 'goe')}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                activeFilter === 'goe'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              GOE (62)
            </button>

            {/* Filter MP 542 Novos */}
            <button
              onClick={() => onSelectFilter(activeFilter === 'novos' ? 'all' : 'novos')}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                activeFilter === 'novos'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              MP 542
            </button>

            <span className="text-white/20">|</span>

            {/* Toggle Polygons */}
            <button
              onClick={onTogglePolygons}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                showPolygons ? 'bg-white/20 text-white' : 'bg-transparent text-white/40 line-through'
              }`}
              title="Exibir ou ocultar as áreas territoriais dos CPAIs"
            >
              <Layers className="w-3 h-3" />
              <span>Áreas</span>
            </button>

            {/* Toggle Municipalities */}
            <button
              onClick={onToggleMunicipalities}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                showMunicipalities ? 'bg-white/20 text-white' : 'bg-transparent text-white/40 line-through'
              }`}
              title="Exibir ou ocultar municípios subordinados"
            >
              <span>Municípios</span>
            </button>

            {/* Toggle Labels */}
            <button
              onClick={onToggleLabels}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                showLabels ? 'bg-white/20 text-white' : 'bg-transparent text-white/40 line-through'
              }`}
              title="Exibir ou ocultar nomes das cidades sedes"
            >
              <span>Rótulos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
