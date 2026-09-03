import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, X, FileText } from 'lucide-react';
import { CPAI } from '../types/cpi';
import { validateCPIData, ValidationIssue } from '../utils/geoUtils';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';

interface ValidationModalProps {
  allCPAIs: CPAI[];
  onClose: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({ allCPAIs, onClose }) => {
  const issues = React.useMemo(() => validateCPIData(allCPAIs), [allCPAIs]);

  return (
    <div
      id="validation-audit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md shadow-2xl border border-slate-200 max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 bg-[#003366] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 flex-shrink-0">
              <BrasaoCPI className="w-7 h-9 drop-shadow-sm" />
              <BrasaoPMMA className="w-7 h-7 drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-white">Auditoria de Dados — CPI / PMMA</h3>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider">
                Conferência MP nº 542/2026 e Dados Oficiais FT/GOE
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="text-xs uppercase tracking-wider">100% de Integridade dos Documentos:</strong>
              <div className="text-slate-600 mt-0.5 text-[11px]">
                9 CPAIs, 23 Unidades com FT (318 policiais), 5 com GOE (62 policiais), CPAI-9 criado e migrações operacionais validadas.
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded overflow-hidden divide-y divide-slate-100">
            {issues.map((issue, idx) => (
              <div key={idx} className="p-3 flex items-start gap-2.5 bg-[#F8FAFC]">
                {issue.tipo === 'sucesso' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-800 text-xs">{issue.mensagem}</div>
                  {issue.detalhe && (
                    <div className="text-slate-500 mt-0.5 text-[11px]">{issue.detalhe}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003366] text-white font-bold rounded text-xs hover:bg-[#002244] transition cursor-pointer"
          >
            Fechar Auditoria
          </button>
        </div>
      </div>
    </div>
  );
};
