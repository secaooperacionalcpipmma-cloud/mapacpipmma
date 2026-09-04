import React, { useState } from 'react';
import {
  Shield,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Award,
  MapPin,
  Sparkles,
  Building2,
  X,
  ExternalLink,
  PanelLeftClose,
} from 'lucide-react';
import { CPAI, Battalion, FilterType } from '../types/cpi';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';

interface SidebarProps {
  allCPAIs: CPAI[];
  selectedCPAIId: string | null;
  selectedBattalionId: string | null;
  activeFilter: FilterType;
  isOpen: boolean;
  onClose: () => void;
  onSelectCPAI: (id: string | null) => void;
  onSelectBattalion: (bat: Battalion, cpai: CPAI) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  allCPAIs,
  selectedCPAIId,
  selectedBattalionId,
  activeFilter,
  isOpen,
  onClose,
  onSelectCPAI,
  onSelectBattalion,
}) => {
  // Store which CPAI accordions are expanded (default: all or selected)
  const [expandedCPAIs, setExpandedCPAIs] = useState<Record<string, boolean>>({
    'CPAI-1': true,
    'CPAI-2': false,
    'CPAI-3': false,
    'CPAI-4': false,
    'CPAI-5': false,
    'CPAI-6': false,
    'CPAI-7': false,
    'CPAI-8': false,
    'CPAI-9': true, // Expanded by default to highlight MP 542/2026!
  });
  const [showStatusBox, setShowStatusBox] = useState(true);

  const toggleCPAIExpand = (cpaiId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCPAIs((prev) => ({
      ...prev,
      [cpaiId]: !prev[cpaiId],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-35 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="cpi-structure-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-80 sm:w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:shadow-none transition-all duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 bg-[#002B55] text-white border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <BrasaoCPI className="w-7 h-9 drop-shadow-sm flex-shrink-0" />
              <BrasaoPMMA className="w-7 h-7 drop-shadow-sm flex-shrink-0" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                ESTRUTURA CPI • PMMA
              </h2>
              <p className="text-[9.5px] text-blue-200/90 font-medium">
                Comandos de Área & Batalhões
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition cursor-pointer text-xs font-bold border border-white/20 shadow-xs"
            title="Ocultar Barra Lateral (Estrutura CPI)"
            aria-label="Ocultar Barra Lateral"
          >
            <PanelLeftClose className="w-4 h-4 text-amber-300" />
            <span className="text-[11px]">Ocultar</span>
          </button>
        </div>

        {/* CPAI Tree List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allCPAIs.map((cpai) => {
            const isCPAIActive = selectedCPAIId === cpai.id;
            const isExpanded = expandedCPAIs[cpai.id] ?? false;

            // Total statistics for this CPAI
            const totalBat = cpai.batalhoes.length;
            const totalMun = cpai.batalhoes.reduce(
              (acc, b) => acc + b.municipios.length,
              0
            );
            const totalFT = cpai.batalhoes.filter((b) => b.ft).length;
            const totalGOE = cpai.batalhoes.filter((b) => b.goe).length;

            return (
              <div
                key={cpai.id}
                id={`sidebar-cpai-${cpai.id}`}
                className={`rounded-md border transition overflow-hidden ${
                  isCPAIActive
                    ? 'border-blue-500 bg-blue-50/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* CPAI Header Accordion */}
                <div
                  onClick={() => onSelectCPAI(cpai.id)}
                  className="p-3 cursor-pointer flex items-center justify-between gap-2 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-xs flex-shrink-0"
                      style={{ backgroundColor: cpai.cor }}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs uppercase tracking-tight text-slate-900">
                          {cpai.id}
                        </span>
                        {cpai.isNovo && (
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            NOVO (MP 542)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {totalBat} Unidades • {totalMun} Municípios
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {totalFT > 0 && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                        title={`${totalFT} unidade(s) com Força Tática`}
                      >
                        {totalFT} FT
                      </span>
                    )}
                    {totalGOE > 0 && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200"
                        title={`${totalGOE} unidade(s) com GOE`}
                      >
                        {totalGOE} GOE
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleCPAIExpand(cpai.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      aria-label="Expandir ou recolher batalhões"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subordinate Battalions List */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-[#F8FAFC] p-2 space-y-1.5">
                    {cpai.batalhoes.map((bat) => {
                      const isBatSelected = selectedBattalionId === bat.id;

                      return (
                        <div
                          key={bat.id}
                          id={`sidebar-bat-${bat.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBattalion(bat, cpai);
                          }}
                          className={`p-2.5 rounded cursor-pointer transition border text-xs ${
                            isBatSelected
                              ? 'bg-[#003366] text-white border-[#003366] shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 font-bold truncate">
                              <Building2
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                  isBatSelected ? 'text-blue-300' : 'text-slate-500'
                                }`}
                              />
                              <span className="truncate uppercase font-bold text-xs">{bat.numero}</span>
                              {bat.isNovo && (
                                <span className="text-[8px] px-1 py-0.2 rounded font-black bg-red-500 text-white">
                                  NOVO
                                </span>
                              )}
                              {bat.migradoDe && (
                                <span className={`text-[8px] px-1 py-0.2 rounded font-semibold ${
                                  isBatSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900 border border-purple-200'
                                }`}>
                                  ex-{bat.migradoDe}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              {bat.cosar && (
                                <span
                                  className={`px-1.5 py-0.5 rounded font-black text-[9px] flex items-center gap-0.5 ${
                                    isBatSelected
                                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  }`}
                                  title="Base Operacional do COSAR (Comando de Operações e Sobrevivência em Áreas Rurais)"
                                >
                                  🌲 COSAR
                                </span>
                              )}
                              {bat.ft && (
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold text-[9px] flex items-center gap-0.5 ${
                                    isBatSelected
                                      ? 'bg-blue-500/30 text-white border border-white/20'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                  title={`Força Tática: SIM (${bat.efetivoFT} policiais)`}
                                >
                                  <Crosshair className="w-2.5 h-2.5" />
                                  FT ({bat.efetivoFT})
                                </span>
                              )}
                              {bat.goe && (
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold text-[9px] flex items-center gap-0.5 ${
                                    isBatSelected
                                      ? 'bg-amber-500/30 text-amber-200 border border-amber-300/30'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                  title={`GOE: SIM (${bat.efetivoGOE} policiais)`}
                                >
                                  <Award className="w-2.5 h-2.5" />
                                  GOE ({bat.efetivoGOE})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Sede and Municipalities summary */}
                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span
                              className={`flex items-center gap-1 truncate ${
                                isBatSelected ? 'text-blue-100' : 'text-slate-600'
                              }`}
                            >
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              Sede: <strong className="font-bold">{bat.sede}</strong>
                            </span>
                            <span
                              className={`${
                                isBatSelected ? 'text-blue-200' : 'text-slate-400 font-medium'
                              }`}
                            >
                              {bat.municipios.length} munic.
                            </span>
                          </div>

                          {/* Municipalities tag pill list (compact) */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {bat.municipios.slice(0, 4).map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                                  isBatSelected
                                    ? 'bg-white/15 text-white'
                                    : m.isSede
                                    ? 'bg-slate-200 text-slate-800 font-bold'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {m.nome}
                              </span>
                            ))}
                            {bat.municipios.length > 4 && (
                              <span
                                className={`text-[9px] px-1 py-0.5 rounded font-semibold ${
                                  isBatSelected
                                    ? 'text-blue-200'
                                    : 'text-slate-400'
                                }`}
                              >
                                +{bat.municipios.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        {showStatusBox && (
          <div className="p-3 bg-[#001D3D] text-white border-t border-white/10 text-center relative group">
            <button
              onClick={() => setShowStatusBox(false)}
              className="absolute top-1.5 right-1.5 p-1 rounded text-white/50 hover:text-white hover:bg-white/15 transition cursor-pointer"
              title="Ocultar este aviso"
              aria-label="Ocultar aviso de base"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Base Integrada Atualizada
            </div>
            <p className="text-[9px] text-white/60 leading-snug">
              Polícia Militar do Maranhão — CPI
              <br />
              Conforme <strong>MP nº 542/2026</strong> &amp; <strong>FT/GOE Oficial</strong>
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
