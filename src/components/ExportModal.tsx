import React from 'react';
import { Download, FileSpreadsheet, FileCode, Printer, X, Check } from 'lucide-react';
import { CPAI } from '../types/cpi';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';

interface ExportModalProps {
  allCPAIs: CPAI[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ allCPAIs, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const generateCSV = () => {
    const headers = ['CPAI', 'UNIDADE', 'TIPO', 'SEDE', 'MUNICÍPIOS', 'POSSUI_FT', 'EFETIVO_FT', 'POSSUI_GOE', 'EFETIVO_GOE', 'STATUS_MP_542'];
    const rows: string[][] = [];

    allCPAIs.forEach((cpai) => {
      cpai.batalhoes.forEach((bat) => {
        const municipiosList = bat.municipios.map((m) => m.nome).join(' | ');
        rows.push([
          cpai.id,
          bat.numero,
          bat.tipo,
          bat.sede,
          `"${municipiosList}"`,
          bat.ft ? 'SIM' : 'NÃO',
          String(bat.efetivoFT),
          bat.goe ? 'SIM' : 'NÃO',
          String(bat.efetivoGOE),
          bat.isNovo ? 'NOVO' : bat.migradoDe ? `Migrado de ${bat.migradoDe}` : 'Sem alteração',
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'CPI_Maranhao_Distribuicao_MP542.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(allCPAIs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="export-data-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col"
      >
        <div className="p-4 bg-[#003366] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 flex-shrink-0">
              <BrasaoCPI className="w-7 h-9 drop-shadow-sm" />
              <BrasaoPMMA className="w-7 h-7 drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-white">Exportar Dados Oficiais</h3>
              <p className="text-[9.5px] text-blue-200 uppercase tracking-wider">CPI • Polícia Militar do Maranhão</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <button
            onClick={generateCSV}
            className="w-full p-3.5 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-blue-50 text-blue-700 group-hover:bg-[#003366] group-hover:text-white transition">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Planilha CSV</div>
                <div className="text-[11px] text-slate-500">
                  Tabela completa de CPAI, Batalhões, Cidades, FT e GOE
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#003366]" />
          </button>

          <button
            onClick={handlePrint}
            className="w-full p-3.5 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-slate-100 text-slate-700 group-hover:bg-[#003366] group-hover:text-white transition">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Relatório / Impressão</div>
                <div className="text-[11px] text-slate-500">
                  Formato briefing para impressão ou salvar em PDF
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#003366]" />
          </button>

          <button
            onClick={handleCopyJSON}
            className="w-full p-3.5 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-slate-100 text-slate-700 group-hover:bg-[#003366] group-hover:text-white transition">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-slate-900">Copiar Dados JSON</div>
                <div className="text-[11px] text-slate-500">
                  {copied ? 'Copiado para a área de transferência!' : 'Dataset estruturado para integrações'}
                </div>
              </div>
            </div>
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003366] text-white font-bold text-xs rounded hover:bg-[#002244] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
