import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Shield,
  X,
  Sparkles,
  ChevronRight,
  Compass,
} from 'lucide-react';
import {
  CityJurisdictionInfo,
  searchCities,
  getAllCitiesJurisdiction,
} from '../utils/citySearchUtils';

interface CitySearchBarProps {
  onSelectCity: (city: CityJurisdictionInfo) => void;
  selectedCity?: CityJurisdictionInfo | null;
  placeholder?: string;
  className?: string;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  onSelectCity,
  selectedCity,
  placeholder = 'Buscar cidade (ex: Bacabal, Imperatriz, Caxias, Pinheiro)...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if a city was selected externally
  useEffect(() => {
    if (selectedCity) {
      setQuery(selectedCity.cidade);
    }
  }, [selectedCity]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute suggestions
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      // Suggest top major regional centers when empty
      const popularCities = [
        'Bacabal',
        'Imperatriz',
        'Caxias',
        'Pinheiro',
        'Pedreiras',
        'Santa Inês',
        'Balsas',
        'Timon',
        'Presidente Dutra',
        'Barra do Corda',
        'Açailândia',
        'Grajaú',
      ];
      const all = getAllCitiesJurisdiction();
      return all.filter((c) => popularCities.includes(c.cidade));
    }
    return searchCities(q, 15);
  }, [query]);

  const handleSelect = (city: CityJurisdictionInfo) => {
    setQuery(city.cidade);
    setIsOpen(false);
    onSelectCity(city);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div
      ref={containerRef}
      id="city-search-bar-container"
      className={`relative w-full ${className}`}
    >
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-slate-900/90 text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium rounded-lg border border-white/20 hover:border-amber-400/60 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition shadow-inner"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
            title="Limpar pesquisa"
            aria-label="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && results.length > 0 && (
        <div
          id="city-search-dropdown-menu"
          className="absolute left-0 right-0 top-full mt-1.5 bg-[#001D3D] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden z-[2000] max-h-80 overflow-y-auto divide-y divide-white/10 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-1.5 bg-black/40 text-[10px] uppercase font-bold text-amber-300/90 tracking-wider flex items-center justify-between">
            <span>
              {query ? `Cidades encontradas (${results.length})` : 'Cidades Principais / Sugestões'}
            </span>
            <span className="text-white/40 normal-case font-normal">
              Selecione para localizar no mapa
            </span>
          </div>

          {results.map((city, idx) => (
            <button
              key={`${city.cidade}-${city.batalhaoId}-${idx}`}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-3.5 py-2.5 hover:bg-blue-600/30 active:bg-blue-600/50 flex items-center justify-between gap-2.5 text-xs transition cursor-pointer group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 rounded bg-black/40 text-amber-300 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm flex items-center gap-2 flex-wrap">
                    <span>{city.cidade}</span>
                    {city.isSede && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-500 text-slate-950">
                        SEDE
                      </span>
                    )}
                    {city.cosar && (
                      <span className="text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                        COSAR
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-blue-200/90 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-white/90">
                      {city.batalhaoNumero}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="truncate">{city.subunidade}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded text-white border shadow-2xs"
                  style={{
                    backgroundColor: city.cpaiCor,
                    borderColor: city.cpaiCorEscura,
                  }}
                >
                  {city.cpaiId}
                </span>
                <span className="text-[9.5px] text-white/50 group-hover:text-amber-300 transition-colors flex items-center gap-0.5">
                  Localizar <ChevronRight className="w-3 h-3 inline" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#001D3D] border border-white/20 rounded-lg shadow-2xl p-4 text-center text-xs text-white/70 z-[2000]">
          Nenhuma cidade encontrada com "<strong>{query}</strong>". Verifique a ortografia ou digite apenas parte do nome.
        </div>
      )}
    </div>
  );
};
