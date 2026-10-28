import React from 'react';
import {
  Shield,
  MapPin,
  Building2,
  X,
  Sparkles,
  Users,
  Compass,
  Award,
  ExternalLink,
  ChevronRight,
  Crosshair,
} from 'lucide-react';
import { Battalion, CPAI } from '../types/cpi';
import { SUBUNIDADES_PMMA, Subunidade } from '../data/subunidadesData';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';

interface BattalionJurisdictionCardProps {
  battalion: Battalion;
  cpai: CPAI;
  onClose: () => void;
  onRecenter?: () => void;
  onOpenFullDetails?: () => void;
  onOpenSubunidades?: () => void;
}

export const BattalionJurisdictionCard: React.FC<BattalionJurisdictionCardProps> = ({
  battalion,
  cpai,
  onClose,
  onRecenter,
  onOpenFullDetails,
  onOpenSubunidades,
}) => {
  // Find all subunidades for this battalion from SUBUNIDADES_PMMA
  const subunidades = React.useMemo(() => {
    return SUBUNIDADES_PMMA.filter(
      (s) =>
        s.batalhaoId === battalion.id ||
        s.batalhao.toLowerCase().replace(/[^a-z0-9]/g, '') ===
          battalion.numero.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
  }, [battalion]);

  const isCosar = Boolean(battalion.cosar);

  return (
    <div
      id="battalion-jurisdiction-card"
      className="absolute top-3 left-3 sm:left-4 z-[1000] max-w-sm sm:max-w-md w-[92vw] sm:w-full bg-slate-950/95 text-white rounded-xl shadow-2xl border-2 border-amber-400/90 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        boxShadow:
          '0 20px 40px -5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(251, 191, 36, 0.35)',
      }}
    >
      {/* 1. Header with Battalion Name and CPAI Color */}
      <div
        className="px-4 py-3 text-white relative flex items-start justify-between border-b border-white/10"
        style={{
          background: `linear-gradient(135deg, ${cpai.cor}ee, #001f3f 90%)`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 flex-shrink-0 bg-black/40 p-1.5 rounded-lg border border-white/20 shadow-md">
            <BrasaoPMMA className="w-7 h-7" />
            <BrasaoCPI className="w-6 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/50 text-amber-300 px-2 py-0.5 rounded border border-white/20">
                {cpai.id}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase border border-white/20">
                {battalion.tipo}
              </span>
              {battalion.isNovo && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                  NOVO (MP 542)
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight mt-1">
              {battalion.numero} — {battalion.nome}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded bg-black/30 hover:bg-black/60 text-white/80 hover:text-white transition cursor-pointer flex-shrink-0 ml-2"
          title="Fechar ficha"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Body Information */}
      <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs">
        {/* Bloco 1: Onde Está Localizado & Comando de Área */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
              📍 Onde Está Localizado
            </span>
            <div className="font-black text-sm text-white mt-0.5">
              {battalion.sede} / MA
            </div>
            <span className="text-[10.5px] text-slate-300 block">
              Sede da Unidade Militar
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
              🛡️ Comando de Área (CPAI)
            </span>
            <div className="font-black text-sm text-white mt-0.5 flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-white"
                style={{ backgroundColor: cpai.cor }}
              />
              <span>{cpai.id}</span>
            </div>
            <span className="text-[10.5px] text-slate-300 block">
              {cpai.nome}
            </span>
          </div>
        </div>

        {/* Bloco Especial: COSAR se for 15º BPM / Bacabal */}
        {isCosar && (
          <div className="bg-emerald-950/70 border border-emerald-500/50 p-2.5 rounded-lg flex items-start gap-2.5">
            <span className="text-xl">🌲</span>
            <div>
              <div className="font-black text-emerald-300 uppercase tracking-wide text-[11px] flex items-center gap-1">
                <span>Base Estadual COSAR — Tropa de Elite Rural</span>
                <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 rounded font-black">
                  SEDE BACABAL
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 mt-0.5 leading-snug">
                Comando de Operações e Sobrevivência em Áreas Rurais sediado junto ao 15º BPM com atuação tática em todo o Estado do Maranhão.
              </p>
            </div>
          </div>
        )}

        {/* Bloco 2: Tropas Especiais (FT / GOE) */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`p-2 rounded border ${
              battalion.ft
                ? 'bg-blue-900/30 border-blue-400/40 text-blue-100'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-bold text-[10.5px] uppercase">Força Tática</span>
            </div>
            <div className="text-xs font-black mt-0.5">
              {battalion.ft ? `Ativa (${battalion.efetivoFT} policiais)` : 'Não possui'}
            </div>
          </div>

          <div
            className={`p-2 rounded border ${
              battalion.goe
                ? 'bg-purple-900/30 border-purple-400/40 text-purple-100'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-300" />
              <span className="font-bold text-[10.5px] uppercase">G.O.E.</span>
            </div>
            <div className="text-xs font-black mt-0.5">
              {battalion.goe ? `Ativo (${battalion.efetivoGOE} policiais)` : 'Não possui'}
            </div>
          </div>
        </div>

        {/* Bloco 3: Municípios sob Jurisdição (Área de Atuação) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Municípios sob Jurisdição ({battalion.municipios.length}):
            </span>
          </div>

          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-black/30 rounded border border-white/10">
            {battalion.municipios.map((mun, idx) => (
              <span
                key={`${mun.nome}-${idx}`}
                className={`text-[10.5px] px-2 py-0.5 rounded font-medium ${
                  mun.isSede
                    ? 'bg-amber-400 text-slate-950 font-black border border-amber-300'
                    : 'bg-white/10 text-white/90 border border-white/10'
                }`}
              >
                {mun.isSede && '⭐ Sede: '}
                {mun.nome.replace(/\s*\([^)]*\)/g, '')}
              </span>
            ))}
          </div>
        </div>

        {/* Bloco 4: Subunidades (Companhias e Pelotões) */}
        {subunidades.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Companhias & Pelotões Destacados ({subunidades.length}):
              </span>
              {onOpenSubunidades && (
                <button
                  onClick={onOpenSubunidades}
                  className="text-[10px] text-amber-300 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto p-1.5 bg-black/30 rounded border border-white/10">
              {subunidades.slice(0, 5).map((sub, sIdx) => (
                <div
                  key={`${sub.id}-${sIdx}`}
                  className="flex items-center justify-between gap-1 text-[11px] py-0.5 border-b border-white/5 last:border-b-0"
                >
                  <span className="text-slate-200 font-semibold truncate">
                    {sub.cidade}
                  </span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white/15 text-amber-200 shrink-0">
                    {sub.subunidade}
                  </span>
                </div>
              ))}
              {subunidades.length > 5 && (
                <div className="text-[10px] text-slate-400 italic text-center pt-1">
                  + {subunidades.length - 5} outras subunidades cadastradas
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            {onRecenter && (
              <button
                onClick={onRecenter}
                className="flex-1 py-1.5 px-2 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Centralizar no Mapa</span>
              </button>
            )}

            {onOpenFullDetails && (
              <button
                onClick={onOpenFullDetails}
                className="flex-1 py-1.5 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-sm border border-blue-400/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ficha Completa</span>
              </button>
            )}
          </div>

          {onOpenSubunidades && (
            <button
              onClick={onOpenSubunidades}
              className="w-full py-1.5 px-2 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/15"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Consultar Companhias e Pelotões da PMMA (PDF)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
