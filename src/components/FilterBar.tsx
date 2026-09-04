import React from 'react';
import {
  Filter,
  Shield,
  Crosshair,
  Award,
  Sparkles,
  Layers,
  X,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { CPAI, FilterType } from '../types/cpi';

interface FilterBarProps {
  selectedCPAIId: string | null;
  onSelectCPAI: (id: string | null) => void;
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  allCPAIs: CPAI[];
  showMunicipalities: boolean;
  onToggleMunicipalities: () => void;
  showPolygons: boolean;
  onTogglePolygons: () => void;
  isPosterView?: boolean;
  onTogglePosterView?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCPAIId,
  onSelectCPAI,
  activeFilter,
  onSelectFilter,
  allCPAIs,
  showMunicipalities,
  onToggleMunicipalities,
  showPolygons,
  onTogglePolygons,
  isPosterView,
  onTogglePosterView,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div
      id="cpi-filter-bar"
      className="bg-[#F1F5F9] border-b border-slate-200 px-4 sm:px-6 py-2 shadow-2xs sticky top-[73px] sm:top-[65px] z-30 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-700 shrink-0"
    >
      {/* CPAI Quick Selection Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`px-2.5 py-1 rounded font-bold text-xs border transition flex items-center gap-1.5 cursor-pointer mr-1 flex-shrink-0 ${
              isSidebarOpen
                ? 'bg-[#002B55] text-white border-[#002B55] shadow-xs'
                : 'bg-amber-400 text-slate-950 border-amber-300 font-black hover:bg-amber-300 shadow-xs'
            }`}
            title={isSidebarOpen ? 'Ocultar Barra Lateral (Estrutura CPI)' : 'Mostrar Barra Lateral (Estrutura CPI)'}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="w-3.5 h-3.5 text-amber-300" />
                <span>Ocultar Barra</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-3.5 h-3.5 text-slate-950" />
                <span>Mostrar Barra</span>
              </>
            )}
          </button>
        )}

        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1 mr-1 flex-shrink-0">
          <Shield className="w-3.5 h-3.5 text-[#003366]" />
          CPAI:
        </span>

        <button
          onClick={() => onSelectCPAI(null)}
          className={`px-3 py-1 rounded font-bold text-xs transition whitespace-nowrap cursor-pointer ${
            selectedCPAIId === null
              ? 'bg-[#003366] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos
        </button>

        {allCPAIs.map((cpai) => {
          const isSelected = selectedCPAIId === cpai.id;
          return (
            <button
              key={cpai.id}
              onClick={() => onSelectCPAI(isSelected ? null : cpai.id)}
              style={{
                borderColor: isSelected ? cpai.cor : undefined,
                backgroundColor: isSelected ? cpai.cor : undefined,
                color: isSelected ? '#ffffff' : undefined,
              }}
              className={`px-2.5 py-1 rounded font-bold text-xs border transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'shadow-xs text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: isSelected ? '#ffffff' : cpai.cor }}
              />
              {cpai.id}
              {cpai.isNovo && (
                <span
                  className={`text-[8px] px-1 py-0.2 rounded font-black uppercase ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  Novo
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Operational Feature Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-600" />
          Filtros:
        </span>

        <button
          onClick={() => onSelectFilter('all')}
          className={`px-3 py-1 rounded font-bold text-xs transition cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#003366] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tudo
        </button>

        <button
          onClick={() => onSelectFilter('ft')}
          className={`px-3 py-1 rounded font-bold text-xs border transition flex items-center gap-1 cursor-pointer ${
            activeFilter === 'ft'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          }`}
        >
          <Crosshair className="w-3 h-3" />
          FILTRAR FT
        </button>

        <button
          onClick={() => onSelectFilter('goe')}
          className={`px-3 py-1 rounded font-bold text-xs border transition flex items-center gap-1 cursor-pointer ${
            activeFilter === 'goe'
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Award className="w-3 h-3" />
          FILTRAR GOE
        </button>

        <button
          onClick={() => onSelectFilter('cosar')}
          className={`px-3 py-1 rounded font-black text-xs border transition flex items-center gap-1 cursor-pointer ${
            activeFilter === 'cosar'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          }`}
          title="Filtrar base do COSAR (Comando de Operações e Sobrevivência em Áreas Rurais - Bacabal/MA)"
        >
          <Shield className="w-3 h-3 text-emerald-600" />
          COSAR (Bacabal)
        </button>

        <button
          onClick={() => onSelectFilter('novos')}
          className={`px-3 py-1 rounded font-bold text-xs border transition flex items-center gap-1 cursor-pointer ${
            activeFilter === 'novos'
              ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
              : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          MP 542/2026
        </button>

        {/* Map Layers Toggles */}
        <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block"></div>

        <button
          onClick={onToggleMunicipalities}
          className={`px-2.5 py-1 rounded font-bold text-xs border transition flex items-center gap-1 cursor-pointer ${
            showMunicipalities
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Alternar exibição de pontos de municípios subordinados"
        >
          <Map className="w-3 h-3" />
          <span>Municípios</span>
        </button>

        <button
          onClick={onTogglePolygons}
          className={`px-2.5 py-1 rounded font-bold text-xs border transition flex items-center gap-1 cursor-pointer ${
            showPolygons
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Alternar polígonos territoriais dos CPAI"
        >
          <Layers className="w-3 h-3" />
          <span>Áreas CPAI</span>
        </button>

        {/* Map Mode: Mapa Estático vs Mapa Interativo */}
        {onTogglePosterView && (
          <>
            <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block"></div>
            <div className="flex items-center bg-white rounded border border-slate-300 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={onTogglePosterView}
                className={`px-2 py-0.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  isPosterView
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-transparent text-slate-700 hover:bg-slate-100'
                }`}
                title="Modo Mapa Estático Oficial (Visual fiel e sem poluição)"
              >
                <Shield className="w-3 h-3 text-[#003366]" />
                <span>Mapa Estático</span>
              </button>
              <button
                type="button"
                onClick={isPosterView ? onTogglePosterView : undefined}
                className={`px-2 py-0.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  !isPosterView
                    ? 'bg-[#002D5C] text-white font-black shadow-xs'
                    : 'bg-transparent text-slate-700 hover:bg-slate-100'
                }`}
                title="Modo Mapa Interativo (Navegável com zoom e detalhes operacionais)"
              >
                <Layers className="w-3 h-3 text-blue-300" />
                <span>Mapa Interativo</span>
              </button>
            </div>
          </>
        )}

        {(selectedCPAIId !== null || activeFilter !== 'all') && (
          <button
            onClick={() => {
              onSelectCPAI(null);
              onSelectFilter('all');
            }}
            className="p-1 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
            title="Limpar todos os filtros"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
