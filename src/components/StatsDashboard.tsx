import React from 'react';
import {
  Shield,
  Building2,
  MapPin,
  Crosshair,
  Award,
  Users,
  Compass,
} from 'lucide-react';
import { CPIStats } from '../types/cpi';

interface StatsDashboardProps {
  stats: CPIStats;
  selectedCPAIId: string | null;
  onFilterFT: () => void;
  onFilterGOE: () => void;
  onFilterCOSAR: () => void;
  onSelectTotalCPAI: () => void;
  onSelectTotalBatalhoes: () => void;
  onSelectTotalMunicipios: () => void;
  activeFilter: string;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  selectedCPAIId,
  onFilterFT,
  onFilterGOE,
  onFilterCOSAR,
  onSelectTotalCPAI,
  onSelectTotalBatalhoes,
  onSelectTotalMunicipios,
  activeFilter,
}) => {
  return (
    <section
      id="cpi-stats-dashboard"
      aria-label="Indicadores Operacionais do CPI"
      className="bg-white border-b border-slate-200 text-slate-800 py-3 px-3 sm:px-6 shadow-xs shrink-0 select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {/* 1. Total CPAI */}
          <button
            id="stat-card-cpai"
            onClick={onSelectTotalCPAI}
            className={`p-2.5 rounded-md border text-left flex flex-col justify-between transition cursor-pointer ${
              selectedCPAIId
                ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                : 'bg-[#F8FAFC] border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
            title="Clique para enquadrar os 9 Comandos Regionais do Maranhão"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                Total CPAI
              </span>
              <Shield className="w-3.5 h-3.5 text-[#003366]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight">
                0{stats.totalCPAI}
              </span>
              <span className="text-[9.5px] text-blue-600 font-bold">
                (1 ao 9)
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 truncate">
              Comandos Regionais
            </span>
          </button>

          {/* 2. Total Batalhões / Unidades */}
          <button
            id="stat-card-unidades"
            onClick={onSelectTotalBatalhoes}
            className="p-2.5 rounded-md text-left bg-[#F8FAFC] border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col justify-between cursor-pointer"
            title="Clique para listar todas as 39 Unidades Operacionais e Batalhões"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                Batalhões
              </span>
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight">
                {stats.totalUnidades}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                ({stats.totalBatalhoes} BPM + {stats.totalUnidadesEspeciais} Esp.)
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 truncate">
              Estruturas Operacionais
            </span>
          </button>

          {/* 3. Municípios Atendidos */}
          <button
            id="stat-card-municipios"
            onClick={onSelectTotalMunicipios}
            className="p-2.5 rounded-md text-left bg-[#F8FAFC] border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition flex flex-col justify-between cursor-pointer"
            title="Clique para visualizar todos os 211 municípios cobertos pelo CPI"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                Municípios
              </span>
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight">
                {stats.totalMunicipios}
              </span>
              <span className="text-[9.5px] text-emerald-700 font-bold">
                Interior MA
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 truncate">
              Cobertura Territorial
            </span>
          </button>

          {/* 4. Unidades com FT */}
          <button
            id="stat-btn-ft"
            onClick={onFilterFT}
            className={`p-2.5 rounded-md text-left border transition flex flex-col justify-between cursor-pointer ${
              activeFilter === 'ft'
                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                : 'bg-[#F8FAFC] border-slate-200 hover:bg-blue-50/40 hover:border-blue-300'
            }`}
            title="Filtrar e focar nas 26 Unidades com pelotões de Força Tática"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-700 uppercase font-bold tracking-wider">
                Unidades FT
              </span>
              <Crosshair className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">
                {stats.unidadesComFT}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                Efetivo: {stats.efetivoTotalFT}
              </span>
            </div>
            <span className="text-[9.5px] text-blue-600 font-semibold flex items-center gap-1 truncate">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              23 Unidades com FT
            </span>
          </button>

          {/* 5. Unidades com GOE */}
          <button
            id="stat-btn-goe"
            onClick={onFilterGOE}
            className={`p-2.5 rounded-md text-left border transition flex flex-col justify-between cursor-pointer ${
              activeFilter === 'goe'
                ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 shadow-xs'
                : 'bg-[#F8FAFC] border-slate-200 hover:bg-amber-50/40 hover:border-amber-300'
            }`}
            title="Filtrar e focar nas 6 Unidades com Grupos de Operações Especiais"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">
                Unidades GOE
              </span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight">
                0{stats.unidadesComGOE}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                Efetivo: {stats.efetivoTotalGOE}
              </span>
            </div>
            <span className="text-[9.5px] text-amber-600 font-semibold flex items-center gap-1 truncate">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Op. Especiais (5 Unid.)
            </span>
          </button>

          {/* 6. COSAR (Comando de Operações e Sobrevivência em Áreas Rurais - Bacabal/MA) */}
          <button
            id="stat-btn-cosar"
            onClick={onFilterCOSAR}
            className={`p-2.5 rounded-md text-left border transition flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              activeFilter === 'cosar'
                ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 shadow-md'
                : 'bg-emerald-50/40 border-emerald-300 hover:bg-emerald-100/70 hover:border-emerald-500'
            }`}
            title="Clique para focar no COSAR na cidade de Bacabal/MA (Comando de Operações e Sobrevivência em Áreas Rurais)"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-900 uppercase font-black tracking-wider flex items-center gap-1">
                COSAR
              </span>
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
                01
              </span>
              <span className="text-[9.5px] font-bold text-emerald-900 bg-emerald-200/80 px-1 py-0.2 rounded">
                Bacabal/MA
              </span>
            </div>
            <span className="text-[9.5px] text-emerald-800 font-bold flex items-center gap-1 truncate">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Op. Rurais & Selva
            </span>
          </button>

          {/* 7. Efetivo FT */}
          <button
            id="stat-card-efetivo-ft"
            onClick={onFilterFT}
            className="p-2.5 rounded-md text-left bg-[#F8FAFC] border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col justify-between cursor-pointer"
            title="Filtrar pelos 369 policiais da Força Tática"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                Efetivo FT
              </span>
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight">
                {stats.efetivoTotalFT}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                operadores
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 truncate">
              Força Tática Ativa
            </span>
          </button>

          {/* 8. Efetivo GOE */}
          <button
            id="stat-card-efetivo-goe"
            onClick={onFilterGOE}
            className="p-2.5 rounded-md text-left bg-[#F8FAFC] border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between cursor-pointer"
            title="Filtrar pelos 77 policiais do GOE"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                Efetivo GOE
              </span>
              <Users className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight">
                {stats.efetivoTotalGOE}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                operadores
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 truncate">
              Operações Especiais
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

