import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Shield,
  Building2,
  X,
  Sparkles,
  ChevronDown,
  Crosshair,
} from 'lucide-react';
import { CPAI, Battalion } from '../types/cpi';
import {
  CityJurisdictionInfo,
  searchCities,
  getAllCitiesJurisdiction,
  normalizeText,
} from '../utils/citySearchUtils';

interface TacticalSearchBarProps {
  allCPAIs: CPAI[];
  onSelectBattalion: (bat: Battalion, cpai: CPAI) => void;
  onSelectCity?: (city: CityJurisdictionInfo) => void;
  onSelectCPAI?: (cpaiId: string) => void;
  onOpenSubunidades?: () => void;
  className?: string;
  placeholder?: string;
}

export const TacticalSearchBar: React.FC<TacticalSearchBarProps> = ({
  allCPAIs,
  onSelectBattalion,
  onSelectCity,
  onSelectCPAI,
  onOpenSubunidades,
  className = '',
  placeholder = '🔍 Localizar Batalhão (ex: 15º BPM), Cidade (ex: Bacabal, Pinheiro) ou Comando de Área (CPAI)...',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-type Search Results: Batalhões, Cidades, CPAIs, COSAR
  const results = useMemo(() => {
    const q = normalizeText(query);
    if (!q || q.length < 1) return [];

    const out: Array<{
      type: 'bat' | 'city' | 'cpai' | 'cosar';
      title: string;
      subtitle: string;
      tag: string;
      tagColor?: string;
      badge?: string;
      batData?: Battalion;
      cpaiData?: CPAI;
      cityData?: CityJurisdictionInfo;
    }> = [];

    // Special COSAR detection
    if (q.includes('cosar') || 'cosar'.includes(q) || q.includes('rural')) {
      const cpai1 = allCPAIs.find((c) => c.id === 'CPAI-1');
      const bat15 = cpai1?.batalhoes.find((b) => b.cosar || b.id === '15-bpm');
      if (bat15 && cpai1) {
        out.push({
          type: 'cosar',
          title: '🌲 COSAR — Base Estadual de Operações Rurais & Selva',
          subtitle: 'Sede no 15º BPM em Bacabal / MA • CPAI-1 (Médio Mearim)',
          tag: 'TROPA DE ELITE',
          tagColor: 'bg-emerald-600 text-white',
          badge: 'SEDE BACABAL',
          batData: bat15,
          cpaiData: cpai1,
        });
      }
    }

    // 1. Search Batalhões
    allCPAIs.forEach((cpai) => {
      cpai.batalhoes.forEach((bat) => {
        const batNorm = normalizeText(bat.numero);
        const nomeNorm = normalizeText(bat.nome);
        const sedeNorm = normalizeText(bat.sede);

        if (
          batNorm.includes(q) ||
          nomeNorm.includes(q) ||
          sedeNorm.includes(q) ||
          (bat.cosar && q.includes('cosar'))
        ) {
          out.push({
            type: 'bat',
            title: `${bat.numero} — ${bat.nome}`,
            subtitle: `Sede: ${bat.sede} • ${cpai.id} (${cpai.nome}) • ${bat.municipios.length} municípios`,
            tag: bat.cosar ? 'COSAR + FT' : bat.tipo,
            tagColor: bat.cosar ? 'bg-emerald-700 text-white' : 'bg-blue-700 text-white',
            badge: cpai.id,
            batData: bat,
            cpaiData: cpai,
          });
        }
      });
    });

    // 2. Search CPAIs
    allCPAIs.forEach((cpai) => {
      const idNorm = normalizeText(cpai.id);
      const nomeNorm = normalizeText(cpai.nome);
      if (idNorm.includes(q) || nomeNorm.includes(q)) {
        out.push({
          type: 'cpai',
          title: `${cpai.id} — ${cpai.nome}`,
          subtitle: `${cpai.batalhoes.length} Batalhões subordinados: ${cpai.batalhoes
            .map((b) => b.numero)
            .join(', ')}`,
          tag: 'COMANDO DE ÁREA',
          tagColor: 'bg-amber-600 text-white',
          badge: `${cpai.batalhoes.length} BPMs`,
          cpaiData: cpai,
        });
      }
    });

    // 3. Search Cities (up to 8)
    const cityMatches = searchCities(q, 8);
    cityMatches.forEach((c) => {
      const cpai = allCPAIs.find((cp) => cp.id === c.cpaiId);
      const bat = cpai?.batalhoes.find((b) => b.id === c.batalhaoId);
      out.push({
        type: 'city',
        title: `📍 ${c.cidade} / MA`,
        subtitle: `${c.cpaiId} • Batalhão: ${c.batalhaoNumero} (Sede: ${c.batalhaoSede}) • ${c.subunidade}`,
        tag: c.isSede ? 'SEDE BPM' : 'MUNICÍPIO',
        tagColor: c.isSede ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 text-white',
        badge: c.batalhaoNumero,
        cityData: c,
        batData: bat,
        cpaiData: cpai,
      });
    });

    return out.slice(0, 12);
  }, [query, allCPAIs]);

  const handleSelect = (item: (typeof results)[0]) => {
    if (item.type === 'city' && item.cityData && onSelectCity) {
      onSelectCity(item.cityData);
    } else if (item.batData && item.cpaiData) {
      onSelectBattalion(item.batData, item.cpaiData);
    } else if (item.type === 'cpai' && item.cpaiData && onSelectCPAI) {
      onSelectCPAI(item.cpaiData.id);
    }
    setQuery('');
    setIsOpen(false);
  };

  // Direct select jump
  const handleDirectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;

    if (val === 'cosar') {
      const cpai1 = allCPAIs.find((c) => c.id === 'CPAI-1');
      const bat15 = cpai1?.batalhoes.find((b) => b.cosar || b.id === '15-bpm');
      if (bat15 && cpai1) onSelectBattalion(bat15, cpai1);
      e.target.value = '';
      return;
    }

    const [cpaiId, batId] = val.split('::');
    const cpai = allCPAIs.find((c) => c.id === cpaiId);
    if (cpai) {
      const bat = cpai.batalhoes.find((b) => b.id === batId);
      if (bat) {
        onSelectBattalion(bat, cpai);
      }
    }
    e.target.value = '';
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-2 w-full ${className}`}
    >
      {/* 1. Main Search Input Box */}
      <div className="relative flex-1">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="tactical-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-900/90 border border-amber-400/50 text-white placeholder:text-slate-400 text-xs sm:text-sm rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-medium transition"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && results.length > 0 && (
          <div
            id="tactical-search-dropdown"
            className="absolute left-0 right-0 top-full mt-1 bg-slate-950/98 border-2 border-amber-400/80 rounded-lg shadow-2xl overflow-hidden z-[1100] divide-y divide-white/10 max-h-80 overflow-y-auto backdrop-blur-md"
          >
            <div className="px-3 py-1.5 bg-[#002D5C] text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center justify-between border-b border-amber-400/40">
              <span>Resultados Táticos Encontrados ({results.length})</span>
              <span className="text-slate-300 font-medium">Batalhões • Cidades • CPAIs</span>
            </div>

            {results.map((item, idx) => (
              <button
                key={`${item.type}-${idx}`}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-blue-900/40 flex items-center justify-between gap-2 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-1.5 rounded-md bg-white/10 text-white shrink-0 group-hover:scale-105 transition-transform">
                    {item.type === 'bat' || item.type === 'cosar' ? (
                      <Shield className="w-4 h-4 text-amber-400" />
                    ) : item.type === 'city' ? (
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Building2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-amber-200 border border-white/15">
                      {item.badge}
                    </span>
                  )}
                  <span
                    className={`text-[9.5px] font-black px-2 py-0.5 rounded uppercase ${
                      item.tagColor || 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && query.trim().length >= 2 && results.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-slate-950/95 border border-amber-400/60 rounded-lg p-3 text-center text-xs text-slate-300 z-[1100] shadow-xl">
            Nenhuma unidade ou cidade encontrada para &quot;{query}&quot;. Tente o número do batalhão (ex: 15º BPM) ou o nome do município (ex: Bacabal, Imperatriz, Pinheiro).
          </div>
        )}
      </div>

      {/* 2. Direct Battalion Quick Dropdown Selector (<select>) */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        <select
          id="direct-bpm-selector"
          onChange={handleDirectSelect}
          defaultValue=""
          className="bg-slate-900 border border-amber-400/60 text-amber-300 text-xs font-bold px-2.5 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm"
          title="Seletor rápido para ir direto a qualquer um dos 33 Batalhões da PMMA"
        >
          <option value="" disabled>
            🎯 Ir direto ao Batalhão (33 BPMs)...
          </option>
          <option value="cosar">🌲 Base COSAR (Bacabal / 15º BPM)</option>
          {allCPAIs.map((cpai) => (
            <optgroup key={cpai.id} label={`${cpai.id} — ${cpai.nome}`}>
              {cpai.batalhoes.map((bat) => (
                <option key={bat.id} value={`${cpai.id}::${bat.id}`}>
                  {bat.numero} — Sede: {bat.sede}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* 3. Quick COSAR Shortcut Button */}
      <button
        onClick={() => {
          const cpai1 = allCPAIs.find((c) => c.id === 'CPAI-1');
          const bat15 = cpai1?.batalhoes.find((b) => b.cosar || b.id === '15-bpm');
          if (bat15 && cpai1) onSelectBattalion(bat15, cpai1);
        }}
        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-black border border-emerald-400 shadow-sm cursor-pointer whitespace-nowrap"
        title="Localizar Base do COSAR (Comando de Operações Rurais sediado em Bacabal / 15º BPM)"
      >
        <span>🌲</span>
        <span>COSAR (Bacabal)</span>
      </button>

      {/* 4. Quick Cias & Pelotões Button */}
      {onOpenSubunidades && (
        <button
          onClick={onOpenSubunidades}
          className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black border border-amber-300 shadow-sm cursor-pointer whitespace-nowrap"
          title="Pesquisar Companhias e Pelotões em todos os 217 municípios"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Cias & Pelotões (PDF)</span>
        </button>
      )}
    </div>
  );
};
