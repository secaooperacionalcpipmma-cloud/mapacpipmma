import React, { useState, useMemo } from 'react';
import { SUBUNIDADES_PMMA, Subunidade } from '../data/subunidadesData';
import {
  Search,
  MapPin,
  Building2,
  Shield,
  X,
  Filter,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SubunidadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubunidade: (sub: Subunidade) => void;
}

export const SubunidadesModal: React.FC<SubunidadesModalProps> = ({
  isOpen,
  onClose,
  onSelectSubunidade,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatalhao, setSelectedBatalhao] = useState<string>('todos');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedCpai, setSelectedCpai] = useState<string>('todos');

  // List of distinct battalions
  const batalhoesList = useMemo(() => {
    const set = new Set<string>();
    SUBUNIDADES_PMMA.forEach((s) => set.add(s.batalhao));
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 999;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 999;
      return numA - numB;
    });
  }, []);

  // Filtered subunidades
  const filteredSubunidades = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return SUBUNIDADES_PMMA.filter((item) => {
      // Filter Batalhao
      if (selectedBatalhao !== 'todos' && item.batalhao !== selectedBatalhao) {
        return false;
      }
      // Filter Tipo
      if (selectedTipo !== 'todos' && item.tipo !== selectedTipo) {
        return false;
      }
      // Filter CPAI
      if (selectedCpai !== 'todos' && item.cpaiId !== selectedCpai) {
        return false;
      }
      // Search term
      if (!q) return true;

      return (
        item.subunidade.toLowerCase().includes(q) ||
        item.cidade.toLowerCase().includes(q) ||
        item.batalhao.toLowerCase().includes(q) ||
        item.cpaiId.toLowerCase().includes(q) ||
        (item.observacao && item.observacao.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedBatalhao, selectedTipo, selectedCpai]);

  if (!isOpen) return null;

  return (
    <div
      id="subunidades-search-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl border-2 border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#002B55] text-white px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  LOCALIZADOR DE COMPANHIAS E PELOTÕES
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  PORTARIA CPI / PMMA
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Consulte onde fica localizada cada Companhia, Pelotão e DPM de todos os Batalhões
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por Companhia (ex: 1ª CIA, 3ª CIA), Pelotão (ex: 2º PEL), Batalhão ou Cidade..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] shadow-xs"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Batalhão Select */}
            <div className="w-full sm:w-48">
              <select
                value={selectedBatalhao}
                onChange={(e) => setSelectedBatalhao(e.target.value)}
                className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366] shadow-xs"
              >
                <option value="todos">Todos os Batalhões</option>
                {batalhoesList.map((bat) => (
                  <option key={bat} value={bat}>
                    {bat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo Select */}
            <div className="w-full sm:w-40">
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366] shadow-xs"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="CIA">Companhias (CIA)</option>
                <option value="PELOTAO">Pelotões (PEL)</option>
                <option value="SEDE">Sedes de BPM</option>
                <option value="DPM">DPMs / Destacamentos</option>
                <option value="GP_PM">Grupos PM (GP PM)</option>
                <option value="ESPECIAL">Unidades Especiais</option>
              </select>
            </div>

            {/* CPAI Select */}
            <div className="w-full sm:w-32">
              <select
                value={selectedCpai}
                onChange={(e) => setSelectedCpai(e.target.value)}
                className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366] shadow-xs"
              >
                <option value="todos">Todos CPAIs</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={`CPAI-${n}`}>
                    CPAI-{n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Counters & Quick Filter Chips */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-semibold">
              Exibindo <span className="font-black text-[#002B55]">{filteredSubunidades.length}</span>{' '}
              subunidades encontradas no território
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchTerm('1ª CIA');
                  setSelectedTipo('CIA');
                }}
                className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
              >
                1ªs Companhias
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSearchTerm('Pelotão');
                  setSelectedTipo('PELOTAO');
                }}
                className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Pelotões
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSearchTerm('COSAR');
                  setSelectedTipo('todos');
                }}
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Base COSAR
              </button>
            </div>
          </div>
        </div>

        {/* Results List Table / Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredSubunidades.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-base text-slate-700">Nenhuma subunidade encontrada</p>
              <p className="text-xs text-slate-500 mt-1">
                Tente ajustar os filtros ou pesquisar por outro nome de cidade ou número de companhia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSubunidades.map((item) => {
                const isCia = item.tipo === 'CIA';
                const isPelotao = item.tipo === 'PELOTAO';
                const isSede = item.tipo === 'SEDE';
                const isCosar = item.subunidade.includes('COSAR');

                let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
                if (isCosar) badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black';
                else if (isSede) badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                else if (isCia) badgeColor = 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
                else if (isPelotao) badgeColor = 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-[#003366] hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#002B55] text-white">
                          {item.batalhao} ({item.cpaiId})
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                          {item.tipo === 'PELOTAO'
                            ? 'Pelotão'
                            : item.tipo === 'CIA'
                            ? 'Companhia'
                            : item.tipo === 'SEDE'
                            ? 'Sede de BPM'
                            : item.tipo === 'DPM'
                            ? 'DPM'
                            : item.tipo === 'GP_PM'
                            ? 'Grupo PM'
                            : 'Especial'}
                        </span>
                      </div>

                      {/* Subunidade Name */}
                      <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-blue-900 transition">
                        {item.subunidade}
                      </h3>

                      {/* Cidade / Localização */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>
                          Município de Instalação:{' '}
                          <strong className="text-slate-950 underline decoration-slate-300">
                            {item.cidade}
                          </strong>
                        </span>
                      </div>

                      {item.observacao && (
                        <p className="mt-1.5 text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200">
                          {item.observacao}
                        </p>
                      )}
                    </div>

                    {/* Action Button: Localizar no Mapa */}
                    <button
                      onClick={() => {
                        onSelectSubunidade(item);
                        onClose();
                      }}
                      className="mt-3.5 w-full py-2 px-3 bg-slate-100 hover:bg-[#002B55] text-slate-800 hover:text-white rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 group-hover:border-[#002B55]"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-500 group-hover:text-amber-300" />
                      <span>Localizar {item.cidade} no Mapa</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#002B55]" />
            <span className="font-semibold">
              Base de dados oficial validada conforme a Portaria de Distribuição de Companhias e Pelotões da PMMA
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
