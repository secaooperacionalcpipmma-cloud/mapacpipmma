import React from 'react';
import {
  Shield,
  Search,
  RotateCcw,
  Download,
  CheckCircle2,
  Menu,
  Sparkles,
  MapPin,
  Monitor,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { CPAI, Battalion } from '../types/cpi';
import { BrasaoPMMA, BrasaoCPI } from './CrestLogos';
import { CityJurisdictionInfo, searchCities } from '../utils/citySearchUtils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetView: () => void;
  onOpenExport: () => void;
  onOpenValidation: () => void;
  onToggleSidebar: () => void;
  onEnterProjection?: () => void;
  isPosterView?: boolean;
  onTogglePosterView?: () => void;
  isSidebarOpen: boolean;
  onSelectSearchResult: (type: 'cpai' | 'bpm' | 'municipio' | 'cidade', id: string, extra?: string) => void;
  onSelectCity?: (city: CityJurisdictionInfo) => void;
  allCPAIs: CPAI[];
  onOpenSubunidades?: () => void;
  onFilterCOSAR?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onResetView,
  onOpenExport,
  onOpenValidation,
  onToggleSidebar,
  onEnterProjection,
  isPosterView = false,
  onTogglePosterView,
  isSidebarOpen,
  onSelectSearchResult,
  allCPAIs,
  onOpenSubunidades,
  onFilterCOSAR,
  onSelectCity,
}) => {
  // Search autocompletion suggestions
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const results: Array<{
      type: 'cpai' | 'bpm' | 'municipio' | 'cidade';
      title: string;
      subtitle: string;
      id: string;
      extra?: string;
      badge?: string;
      cityData?: CityJurisdictionInfo;
    }> = [];

    // 1. Search Cities with full CPAI, Batalhão & Subunidade jurisdiction
    const cityMatches = searchCities(q, 5);
    cityMatches.forEach((c) => {
      results.push({
        type: 'cidade',
        title: `📍 ${c.cidade}`,
        subtitle: `${c.cpaiId} • ${c.batalhaoNumero} • ${c.subunidade}`,
        id: c.cidade,
        badge: c.cpaiId,
        cityData: c,
      });
    });

    allCPAIs.forEach((cpai) => {
      if (
        cpai.id.toLowerCase().includes(q) ||
        cpai.nome.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'cpai',
          title: cpai.id,
          subtitle: cpai.nome,
          id: cpai.id,
          badge: cpai.isNovo ? 'MP 542/2026' : undefined,
        });
      }

      cpai.batalhoes.forEach((bat) => {
        // Direct COSAR detection
        if (
          bat.cosar &&
          (q.includes('cosar') ||
            'cosar'.includes(q) ||
            q.includes('rural') ||
            q.includes('sobreviv') ||
            bat.sede.toLowerCase().includes(q))
        ) {
          results.unshift({
            type: 'bpm',
            title: `COSAR — Base Operacional em ${bat.sede}`,
            subtitle: `Tropa de Elite Rural • 15º BPM (${cpai.id})`,
            id: bat.id,
            extra: cpai.id,
            badge: '🌲 COSAR ELITE',
          });
        }

        if (
          bat.numero.toLowerCase().includes(q) ||
          bat.nome.toLowerCase().includes(q) ||
          bat.sede.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'bpm',
            title: `${bat.numero} — Sede: ${bat.sede}`,
            subtitle: `${cpai.id} • ${bat.municipios.length} municípios`,
            id: bat.id,
            extra: cpai.id,
            badge: bat.cosar ? 'COSAR + FT' : bat.ft && bat.goe ? 'FT + GOE' : bat.ft ? 'FT' : bat.goe ? 'GOE' : undefined,
          });
        }
      });
    });

    return results.slice(0, 10);
  }, [searchQuery, allCPAIs]);

  return (
    <header
      id="cpi-header"
      className="bg-[#003366] text-white border-b border-white/10 shadow-sm sticky top-0 z-40 shrink-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand and Title */}
          <div className="flex items-center gap-3">
            <button
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className={`px-2.5 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0 ${
                isSidebarOpen
                  ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                  : 'bg-amber-400 text-slate-950 font-black hover:bg-amber-300 shadow-sm border border-amber-300'
              }`}
              title={isSidebarOpen ? "Ocultar Barra Lateral (Estrutura CPI)" : "Mostrar Barra Lateral (Estrutura CPI)"}
              aria-label={isSidebarOpen ? "Ocultar Barra Lateral" : "Mostrar Barra Lateral"}
            >
              {isSidebarOpen ? (
                <>
                  <PanelLeftClose className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Ocultar Barra</span>
                </>
              ) : (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-slate-950" />
                  <span className="hidden sm:inline">Mostrar Barra</span>
                </>
              )}
            </button>

            {/* Official Crests (PMMA & CPI) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <BrasaoPMMA className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md hover:scale-105 transition-transform" />
              <BrasaoCPI className="w-8 h-10 sm:w-10 sm:h-12 drop-shadow-md hover:scale-105 transition-transform" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base md:text-lg font-black leading-tight uppercase tracking-tight text-white flex items-center gap-2">
                  COMANDO DO POLICIAMENTO DO INTERIOR — CPI / PMMA
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/15 text-amber-300 px-2 py-0.5 rounded border border-white/20 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  MP nº 542/2026
                </span>
              </div>
              <p className="text-[10px] text-blue-100/80 uppercase font-medium tracking-[0.15em] hidden sm:block">
                POLÍCIA MILITAR DO MARANHÃO • INTELIGÊNCIA CARTOGRÁFICA & GESTÃO OPERACIONAL
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onOpenSubunidades && (
              <button
                id="btn-open-subunidades-header"
                onClick={onOpenSubunidades}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm border border-amber-300 transition cursor-pointer"
                title="Pesquisar localização exata de Companhias e Pelotões de cada Batalhão"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-950" />
                <span className="uppercase tracking-wider text-[11px]">Cias & Pelotões (PDF)</span>
              </button>
            )}

            {onFilterCOSAR && (
              <button
                id="btn-cosar-header-quick"
                onClick={onFilterCOSAR}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-400 transition cursor-pointer"
                title="COSAR - Comando de Operações e Sobrevivência em Áreas Rurais (Sede em Bacabal)"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span className="uppercase tracking-wider text-[11px]">COSAR (Bacabal)</span>
              </button>
            )}

            {onTogglePosterView && (
              <button
                id="btn-toggle-poster-header"
                onClick={onTogglePosterView}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                  isPosterView
                    ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-300 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Modo Cartaz Oficial PMMA (Visual Oficial)"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span className="uppercase tracking-wider text-[11px]">Modo Cartaz PMMA</span>
              </button>
            )}

            {onEnterProjection && (
              <button
                id="btn-enter-projection-header"
                onClick={onEnterProjection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-xs font-black text-slate-950 shadow-sm border border-amber-300 transition cursor-pointer"
                title="Modo Projeção / Apenas Mapa (Ideal para telão e apresentações)"
              >
                <Monitor className="w-3.5 h-3.5 text-slate-950" />
                <span className="uppercase tracking-wider text-[11px]">Apenas Mapa / Telão</span>
              </button>
            )}

            <button
              id="btn-reset-maranhao-view"
              onClick={onResetView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition cursor-pointer"
              title="Centralizar em todo o Estado do Maranhão"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden md:inline">Visão Geral</span>
            </button>

            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-xs border border-blue-400/40 transition"
              title="Exportar dados operacionais do CPI"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">Exportar</span>
            </button>

            <button
              id="btn-open-validation"
              onClick={onOpenValidation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700/80 hover:bg-emerald-600 text-xs font-bold text-emerald-100 border border-emerald-500/40 transition"
              title="Conferência de dados com os PDFs oficiais"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden lg:inline">Auditoria</span>
            </button>
          </div>
        </div>

        {/* Search Bar with live autocomplete */}
        <div className="mt-2.5 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="main-cpi-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Pesquisar CPAI (ex: CPAI-9), Batalhão (ex: 35º BPM), ou Município (ex: Imperatriz, Barra do Corda)..."
              className="w-full pl-10 pr-4 py-1.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs px-2 py-0.5 rounded bg-white/20"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div
              id="search-suggestions-panel"
              className="absolute left-0 right-0 top-full mt-1.5 bg-[#002244] border border-white/20 rounded-md shadow-2xl overflow-hidden z-50 divide-y divide-white/10"
            >
              {searchResults.map((res, idx) => (
                <button
                  key={`${res.type}-${res.id}-${idx}`}
                  onClick={() => {
                    if (res.type === 'cidade' && res.cityData && onSelectCity) {
                      onSelectCity(res.cityData);
                      onSearchChange('');
                    } else {
                      onSelectSearchResult(res.type, res.id, res.extra);
                    }
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center justify-between gap-2 text-sm transition"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="p-1.5 rounded bg-white/10 text-white/90">
                      {res.type === 'cpai' ? (
                        <Shield className="w-3.5 h-3.5 text-blue-300" />
                      ) : res.type === 'cidade' ? (
                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">
                        {res.title}
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        {res.subtitle}
                      </div>
                    </div>
                  </div>

                  {res.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40 flex-shrink-0">
                      {res.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
