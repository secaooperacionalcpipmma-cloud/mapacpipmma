import React from 'react';
import { CPAI, Battalion } from '../types/cpi';
import { BrasaoMaranhao, BrasaoPMMA, BrasaoCPI } from './CrestLogos';
import { Sparkles, MapPin, Shield, Layers, X, Maximize2 } from 'lucide-react';

interface OfficialPosterOverlayProps {
  allCPAIs: CPAI[];
  selectedCPAIId: string | null;
  onSelectCPAI: (id: string | null) => void;
  onSelectBattalion: (bat: Battalion, cpai: CPAI) => void;
  isPosterView: boolean;
  onTogglePosterView?: () => void;
}

export const OfficialPosterOverlay: React.FC<OfficialPosterOverlayProps> = ({
  allCPAIs,
  selectedCPAIId,
  onSelectCPAI,
  onSelectBattalion,
  isPosterView,
  onTogglePosterView,
}) => {
  const [showIslandDetail, setShowIslandDetail] = React.useState(false);
  const [isTableCollapsed, setIsTableCollapsed] = React.useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = React.useState(false);

  return (
    <>
      {/* 1. TOP POSTER HEADER (Exact typography and official crests from the printed poster) */}
      <div
        id="cpi-poster-header"
        className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-b-2 border-[#1e293b] shadow-md px-3 sm:px-6 py-2 flex items-center justify-between select-none"
      >
        {/* Left Side: Brasão do Estado do Maranhão + SSP Header */}
        <div className="flex items-center gap-2.5">
          <BrasaoMaranhao className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm flex-shrink-0" />
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-600 uppercase block leading-tight">
              ESTADO DO MARANHÃO • SECRETARIA DE SEGURANÇA PÚBLICA
            </span>
            <h1 className="text-sm sm:text-xl md:text-2xl font-black text-slate-950 tracking-tight font-serif uppercase leading-tight">
              POLÍCIA MILITAR DO MARANHÃO
            </h1>
          </div>
        </div>

        {/* Center: CPI Ribbon & MP 542 Badge */}
        <div className="hidden md:flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#002D5C] text-white font-black text-xs uppercase tracking-wider shadow-sm border border-amber-400/40">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>COMANDO DO POLICIAMENTO DO INTERIOR (CPI)</span>
          </div>
          <span className="text-[10px] font-bold text-amber-800 mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Configuração Territorial Oficial • Medida Provisória nº 542/2026
          </span>
        </div>

        {/* Right Side: Brasão Escudo CPI + Brasão Circular PMMA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onTogglePosterView && (
            <button
              onClick={onTogglePosterView}
              className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isPosterView
                  ? 'bg-amber-400 text-slate-950 border border-amber-500 font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
              title="Alternar entre layout cartaz oficial e painel operacional"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Modo Cartaz</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            <BrasaoCPI className="w-9 h-11 sm:w-11 sm:h-14 drop-shadow-md hover:scale-105 transition-transform" />
            <BrasaoPMMA className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md hover:scale-105 transition-transform" />
          </div>
        </div>
      </div>

      {/* 2. TOP-RIGHT INSET MAP: ILHA DE SÃO LUÍS (CPAM & CPE) */}
      <div
        id="cpi-island-inset"
        className="absolute top-20 right-4 z-20 bg-white/95 backdrop-blur-md rounded-md shadow-xl border-2 border-slate-800 p-2.5 w-60 sm:w-68 select-none transition-all"
      >
        <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
            <span className="font-serif font-black text-xs text-slate-900 uppercase tracking-tight">
              ILHA DE SÃO LUÍS — CPAM / CPE
            </span>
          </div>
          <button
            onClick={() => setShowIslandDetail(!showIslandDetail)}
            className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
          >
            {showIslandDetail ? 'Ocultar' : 'Detalhes'}
          </button>
        </div>

        {/* Vector representation of Ilha de São Luís */}
        <div className="relative bg-teal-50/80 rounded border border-teal-200 p-2 overflow-hidden">
          {/* Island polygon graphic */}
          <svg viewBox="0 0 160 100" className="w-full h-24 drop-shadow-xs">
            {/* Bay waters */}
            <path
              d="M0 0 L160 0 L160 100 L0 100 Z"
              fill="#E0F2FE"
              opacity="0.6"
            />
            {/* Island of São Luís shape */}
            <path
              d="M30 65 C20 50 35 30 55 25 C75 20 110 15 135 25 C145 35 130 55 120 70 C105 85 85 85 65 80 C50 78 38 75 30 65 Z"
              fill="#0D9488"
              stroke="#042F2E"
              strokeWidth="1.5"
            />
            {/* Municipalities in Island */}
            {/* São Luís */}
            <circle cx="58" cy="52" r="5" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
            <text x="58" y="44" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#042F2E" fontFamily="sans-serif">
              SÃO LUÍS
            </text>

            {/* São José de Ribamar */}
            <circle cx="95" cy="45" r="3.5" fill="#F59E0B" stroke="#042F2E" strokeWidth="1" />
            <text x="110" y="42" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#042F2E" fontFamily="sans-serif">
              Ribamar
            </text>

            {/* Paço do Lumiar */}
            <circle cx="82" cy="40" r="3.5" fill="#3B82F6" stroke="#042F2E" strokeWidth="1" />
            <text x="82" y="34" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#042F2E" fontFamily="sans-serif">
              Paço do Lumiar
            </text>

            {/* Raposa */}
            <circle cx="88" cy="24" r="3" fill="#10B981" stroke="#042F2E" strokeWidth="1" />
            <text x="105" y="24" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#042F2E" fontFamily="sans-serif">
              Raposa
            </text>
          </svg>

          <div className="mt-1 flex items-center justify-between text-[9px] font-bold text-slate-700">
            <span className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded">4 Municípios</span>
            <span className="text-slate-500 uppercase">Região Metropolitana</span>
          </div>
        </div>

        {/* Detailed Units in CPAM / CPE */}
        {showIslandDetail && (
          <div className="mt-2 text-[10px] space-y-1 bg-slate-50 p-2 rounded border border-slate-200">
            <div className="font-bold text-blue-950 uppercase border-b border-slate-200 pb-0.5">
              Estruturas da Ilha:
            </div>
            <p className="text-slate-700">
              • <strong>CPAM Leste / Norte / Sul</strong>: Policiamento Metropolitano
            </p>
            <p className="text-slate-700">
              • <strong>CPE (Especializado)</strong>: BOPE, BPCHOQUE, BPA (Ambiental), BPRV (Rodoviário), BPMon (Cavalaria), CTA.
            </p>
          </div>
        )}
      </div>

      {/* 3. BOTTOM-RIGHT CARTOGRAPHIC INSTITUTIONAL TABLE (Exact table from poster) */}
      <div
        id="cpi-poster-table"
        className="absolute bottom-3 right-4 z-20 bg-white/95 backdrop-blur-md rounded-md shadow-2xl border-2 border-slate-800 text-slate-900 w-80 sm:w-[480px] max-h-[46vh] flex flex-col overflow-hidden select-none"
      >
        {/* Table Header */}
        <div
          onClick={() => setIsTableCollapsed(!isTableCollapsed)}
          className="bg-slate-900 text-white px-3 py-1.5 font-bold flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-serif">
            <span className="w-2 h-2 rounded-xs bg-amber-400"></span>
            <span>COMANDOS DO POLICIAMENTO DO INTERIOR (CPI) - PMMA</span>
          </div>
          <span className="text-[10px] text-slate-300 font-sans hover:text-white">
            {isTableCollapsed ? '▲ Expandir' : '▼ Recolher'}
          </span>
        </div>

        {!isTableCollapsed && (
          <div className="overflow-y-auto p-2 divide-y divide-slate-200 text-[10px]">
            {/* Table Rows for CPAI 1 to 9 */}
            {allCPAIs.map((cpai) => {
              const isSelected = selectedCPAIId === cpai.id;
              return (
                <div
                  key={cpai.id}
                  className={`py-1.5 px-1 flex items-start gap-2 rounded transition cursor-pointer hover:bg-slate-100 ${
                    isSelected ? 'bg-blue-50 ring-1 ring-blue-500 font-semibold' : ''
                  }`}
                  onClick={() => onSelectCPAI(isSelected ? null : cpai.id)}
                >
                  {/* CPAI Badge Pill */}
                  <div
                    className="px-2 py-0.5 rounded text-white font-black text-[10px] flex-shrink-0 shadow-xs flex items-center gap-1"
                    style={{ backgroundColor: cpai.cor }}
                  >
                    <span>{cpai.id}</span>
                    {cpai.isNovo && <span className="text-amber-200 text-[8px]">★</span>}
                  </div>

                  {/* Battalion list */}
                  <div className="flex-1 flex flex-wrap gap-1 items-center">
                    {cpai.batalhoes.map((bat) => (
                      <button
                        key={bat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBattalion(bat, cpai);
                        }}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                        title={`${bat.nome} — Sede: ${bat.sede} (${bat.municipios.length} municípios)`}
                      >
                        <span className="text-red-700 font-serif">⭐️</span>
                        <span>{bat.numero}</span>
                        <span className="text-[8.5px] font-normal text-slate-500 uppercase">
                          ({bat.sede.split(' ')[0]})
                        </span>
                        {bat.cosar && (
                          <span className="bg-emerald-600 text-white text-[7.5px] px-1 rounded-2xs font-black">
                            COSAR
                          </span>
                        )}
                        {bat.ft && (
                          <span className="bg-blue-600 text-white text-[7.5px] px-0.5 rounded-2xs font-black">
                            FT
                          </span>
                        )}
                        {bat.goe && (
                          <span className="bg-amber-500 text-white text-[7.5px] px-0.5 rounded-2xs font-black">
                            GOE
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Specialized Command Row (CPE) */}
            <div className="py-1.5 px-1 bg-slate-50 flex items-center gap-2 text-[9.5px]">
              <div className="px-2 py-0.5 rounded bg-teal-700 text-white font-black flex-shrink-0">
                CPE / CPAM
              </div>
              <div className="text-slate-700 font-medium">
                BOPE • BPCHOQUE • BPA • BPRV • BPMon (Cavalaria) • BMT • CTA • 1ª/2ª CIMT
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM-LEFT CARTOGRAPHIC SYMBOLOGY (Exact Replica from Print) */}
      <div
        id="cpi-poster-legend"
        className="absolute bottom-3 left-4 z-20 bg-white/95 backdrop-blur-md rounded-md shadow-2xl border-2 border-slate-800 text-slate-900 w-56 max-h-[46vh] flex flex-col overflow-hidden select-none"
      >
        <div
          onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
          className="bg-slate-900 text-white px-3 py-1.5 font-bold flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-serif">
            <span className="w-2 h-2 rounded-xs bg-amber-400"></span>
            <span>Legendas</span>
          </div>
          <span className="text-[10px] text-slate-300 font-sans hover:text-white">
            {isLegendCollapsed ? '▲' : '▼'}
          </span>
        </div>

        {!isLegendCollapsed && (
          <div className="p-2.5 space-y-1.5 text-[10px] overflow-y-auto">
            <div className="flex items-center gap-2">
              <div className="w-5 h-3 bg-red-600 border border-slate-900 rounded-2xs text-[7px] text-white font-black flex items-center justify-center">
                BR
              </div>
              <span className="font-medium text-slate-700">BR Federal (135, 222, 316, 010)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-3 bg-amber-500 border border-slate-900 rounded-2xs text-[7px] text-white font-black flex items-center justify-center">
                MA
              </div>
              <span className="font-medium text-slate-700">Rodovia Estadual</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-red-600 border border-slate-900 rounded-2xs flex items-center justify-center text-[8px] text-white font-bold">
                ★
              </span>
              <span className="font-bold text-slate-800">Capital do Estado (São Luís)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-red-700 font-serif text-xs">⭐️</span>
              <span className="font-bold text-slate-800">Sede de Batalhão (BPM)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[8px] px-1 rounded-2xs font-black">
                FT
              </span>
              <span className="font-medium text-slate-700">Força Tática (Pelotão Tático)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-white text-[8px] px-1 rounded-2xs font-black">
                GOE
              </span>
              <span className="font-medium text-slate-700">Grupo de Operações Especiais</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              <span className="font-medium text-slate-700">Município Subordinado</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs">✈️</span>
              <span className="font-medium text-slate-700">Aeroporto • ⚓ Porto do Itaqui</span>
            </div>

            <div className="pt-1.5 border-t border-slate-200 flex items-center gap-1.5">
              <span className="px-1 py-0.2 bg-red-600 text-white text-[8px] font-black rounded-full">
                NOVO
              </span>
              <span className="text-[9.5px] font-bold text-slate-900">MP nº 542/2026 (CPAI-9)</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
