import React from 'react';
import {
  Shield,
  MapPin,
  Crosshair,
  Award,
  Users,
  Building2,
  X,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { CPAI, Battalion, Municipality } from '../types/cpi';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';

interface DetailModalProps {
  selectedCPAI: CPAI | null;
  selectedBattalion: Battalion | null;
  selectedMunicipality: Municipality | null;
  onClose: () => void;
  onSelectBattalion: (bat: Battalion, cpai: CPAI) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  selectedCPAI,
  selectedBattalion,
  selectedMunicipality,
  onClose,
  onSelectBattalion,
}) => {
  if (!selectedCPAI && !selectedBattalion) return null;

  // If battalion is selected, show Battalion Operational Detail Sheet
  if (selectedBattalion && selectedCPAI) {
    return (
      <div
        id="battalion-detail-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-md shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header with CPAI Color Banner */}
          <div
            className="p-4 sm:p-5 text-white relative flex items-start justify-between"
            style={{ backgroundColor: selectedCPAI.cor }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <BrasaoCPI className="w-9 h-11 drop-shadow-md" />
                <BrasaoPMMA className="w-9 h-9 drop-shadow-md" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black/25 text-white">
                    {selectedCPAI.id}
                  </span>
                  {selectedBattalion.isNovo && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-1 shadow-xs uppercase">
                      <Sparkles className="w-3 h-3" /> NOVO (MP 542)
                    </span>
                  )}
                  {selectedBattalion.migradoDe && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-purple-900/40 text-purple-100 border border-purple-300/40">
                      ex-{selectedBattalion.migradoDe}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black mt-1 tracking-tight uppercase">
                  {selectedBattalion.nome}
                </h3>
                <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  Sede: <strong className="text-white">{selectedBattalion.sede}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Operational Tactical Cards (FT and GOE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Força Tática (FT) Card */}
              <div
                className={`p-3.5 rounded border flex flex-col justify-between ${
                  selectedBattalion.ft
                    ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                    : 'bg-[#F8FAFC] border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded ${
                        selectedBattalion.ft
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Crosshair className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
                        Força Tática (FT)
                      </h4>
                      <div className="flex items-center gap-1 text-sm font-black">
                        {selectedBattalion.ft ? (
                          <span className="text-blue-700 flex items-center gap-1 font-black">
                            <CheckCircle2 className="w-4 h-4" /> SIM
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1 font-bold">
                            <XCircle className="w-4 h-4" /> NÃO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-baseline justify-between text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Efetivo Operacional:</span>
                  <span
                    className={`font-black text-sm ${
                      selectedBattalion.ft ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  >
                    {selectedBattalion.ft
                      ? `${selectedBattalion.efetivoFT} policiais`
                      : '0'}
                  </span>
                </div>
              </div>

              {/* Grupo de Operações Especiais (GOE) Card */}
              <div
                className={`p-3.5 rounded border flex flex-col justify-between ${
                  selectedBattalion.goe
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-[#F8FAFC] border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded ${
                        selectedBattalion.goe
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
                        GOE (Op. Especiais)
                      </h4>
                      <div className="flex items-center gap-1 text-sm font-black">
                        {selectedBattalion.goe ? (
                          <span className="text-amber-700 flex items-center gap-1 font-black">
                            <CheckCircle2 className="w-4 h-4" /> SIM
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1 font-bold">
                            <XCircle className="w-4 h-4" /> NÃO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-baseline justify-between text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Efetivo Operacional:</span>
                  <span
                    className={`font-black text-sm ${
                      selectedBattalion.goe ? 'text-amber-700' : 'text-slate-400'
                    }`}
                  >
                    {selectedBattalion.goe
                      ? `${selectedBattalion.efetivoGOE} policiais`
                      : '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* COSAR Tactical Card (Comando de Operações e Sobrevivência em Áreas Rurais) */}
            {selectedBattalion.cosar && (
              <div className="p-4 rounded-lg bg-emerald-950 text-emerald-100 border-2 border-emerald-500/60 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="p-2.5 rounded-md bg-emerald-800 text-emerald-300 border border-emerald-400/40 shadow-inner flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950 tracking-wider">
                        TROPA DE ELITE • ÁREA RURAL
                      </span>
                      <span className="text-[9.5px] font-bold text-emerald-300">
                        Base: Bacabal / MA
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white mt-1 uppercase tracking-tight">
                      COSAR — Comando de Operações e Sobrevivência em Áreas Rurais
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-1.5 leading-relaxed font-normal">
                      {selectedBattalion.cosarDescricao ||
                        'Unidade de elite da Polícia Militar do Maranhão especializada no combate ao crime organizado no interior, assalto a bancos, modalidade novo cangaço e sobrevivência em biomas inóspitos de caatinga, cerrado e mata fechada.'}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-emerald-300/80 font-medium">
                        Disponibilidade: <strong>Prontidão Operacional Permanente (24/7)</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-bold text-[10px]">
                        Atuação em Todo o Maranhão
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Observations / Legal MP Note if present */}
            {selectedBattalion.observacao && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Nota Administrativa:</strong> {selectedBattalion.observacao}
                </div>
              </div>
            )}

            {/* Área de Responsabilidade Territorial (Municípios) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#003366]" />
                  Área de Responsabilidade Territorial
                </h4>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedBattalion.municipios.length} municípios
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedBattalion.municipios.map((mun, idx) => {
                  const isSede = mun.isSede;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded border text-xs flex items-center justify-between ${
                        isSede
                          ? 'bg-blue-50 border-blue-200 text-[#003366] font-bold'
                          : 'bg-[#F8FAFC] border-slate-200 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSede ? 'bg-blue-600' : 'bg-slate-400'
                          }`}
                        />
                        {mun.nome}
                      </span>
                      {isSede && (
                        <span className="text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded bg-[#003366] text-white">
                          SEDE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              {selectedCPAI.nome}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded transition cursor-pointer"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, if CPAI is selected, show CPAI Overview Sheet
  return (
    <div
      id="cpai-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* CPAI Header */}
        <div
          className="p-4 sm:p-5 text-white relative flex items-start justify-between"
          style={{ backgroundColor: selectedCPAI!.cor }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <BrasaoCPI className="w-10 h-12 drop-shadow-md" />
              <BrasaoPMMA className="w-10 h-10 drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight uppercase">
                  {selectedCPAI!.id}
                </h3>
                {selectedCPAI!.isNovo && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-1 shadow-xs uppercase">
                    <Sparkles className="w-3 h-3" /> NOVO • MP nº 542/2026
                  </span>
                )}
              </div>
              <p className="text-xs text-white/90 mt-0.5 font-medium">
                {selectedCPAI!.nome}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CPAI Overview Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {selectedCPAI!.observacao && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Informação Oficial:</strong> {selectedCPAI!.observacao}
              </div>
            </div>
          )}

          {/* Subordinate Battalions Grid */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-2.5">
              Batalhões Subordinados ({selectedCPAI!.batalhoes.length} Unidades)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCPAI!.batalhoes.map((bat) => (
                <div
                  key={bat.id}
                  onClick={() => onSelectBattalion(bat, selectedCPAI!)}
                  className="p-3 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 uppercase">
                        {bat.numero}
                      </span>
                      <div className="flex items-center gap-1">
                        {bat.ft && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            FT ({bat.efetivoFT})
                          </span>
                        )}
                        {bat.goe && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            GOE ({bat.efetivoGOE})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      Sede: <strong className="font-bold">{bat.sede}</strong>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2">
                      {bat.municipios.map((m) => m.nome).join(', ')}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                    <span>Ver detalhes da unidade</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
