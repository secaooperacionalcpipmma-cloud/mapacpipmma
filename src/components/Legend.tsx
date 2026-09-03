import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Crosshair, Award, MapPin, Sparkles } from 'lucide-react';
import { CPAI } from '../types/cpi';

interface LegendProps {
  allCPAIs: CPAI[];
  selectedCPAIId: string | null;
  onSelectCPAI: (id: string | null) => void;
}

export const Legend: React.FC<LegendProps> = ({ allCPAIs, selectedCPAIId, onSelectCPAI }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      id="cpi-map-legend"
      className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-md shadow-xl border border-slate-200 text-slate-800 text-xs w-64 max-h-[70vh] flex flex-col overflow-hidden transition-all"
    >
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-3 bg-[#003366] text-white font-bold flex items-center justify-between cursor-pointer select-none"
      >
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold">
          <Layers className="w-3.5 h-3.5 text-blue-300" />
          Legenda Operacional
        </span>
        {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {!isCollapsed && (
        <div className="p-3 overflow-y-auto space-y-3">
          {/* CPAI Colors */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Divisão Territorial (CPAI)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {allCPAIs.map((cpai) => (
                <button
                  key={cpai.id}
                  onClick={() => onSelectCPAI(selectedCPAIId === cpai.id ? null : cpai.id)}
                  className={`flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 transition text-[10px] font-bold cursor-pointer ${
                    selectedCPAIId === cpai.id ? 'ring-1 ring-[#003366] bg-blue-50 text-[#003366]' : 'text-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs flex-shrink-0"
                    style={{ backgroundColor: cpai.cor }}
                  />
                  <span className="truncate">{cpai.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Markers */}
          <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Símbolos e Estruturas
            </span>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-6 h-4 rounded-xs bg-[#003366] text-white text-[9px] font-black flex items-center justify-center">
                BPM
              </span>
              <span className="font-medium text-slate-700">Sede de Batalhão / Unidade</span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-6 h-4 rounded-xs bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                FT
              </span>
              <span className="font-medium text-slate-700">Força Tática (FT)</span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-6 h-4 rounded-xs bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                GOE
              </span>
              <span className="font-medium text-slate-700">Grupo de Op. Especiais (GOE)</span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-6 h-4 rounded-xs bg-emerald-600 text-white text-[8px] font-black flex items-center justify-center">
                COSAR
              </span>
              <span className="font-medium text-slate-700">COSAR (Op. Rurais / Bacabal)</span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span className="font-medium text-slate-700">Município Subordinado</span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-1 py-0.2 rounded-full bg-red-500 text-white text-[8px] font-black uppercase">NOVO</span>
              <span className="font-medium text-slate-700">CPAI-9 (MP nº 542/2026)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
