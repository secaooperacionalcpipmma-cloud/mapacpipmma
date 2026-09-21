import React from 'react';
import {
  MapPin,
  Shield,
  Building2,
  X,
  ExternalLink,
  Sparkles,
  Award,
  Users,
  Compass,
} from 'lucide-react';
import { CityJurisdictionInfo } from '../utils/citySearchUtils';
import { BrasaoCPI, BrasaoPMMA } from './CrestLogos';

interface CityJurisdictionCardProps {
  city: CityJurisdictionInfo;
  onClose: () => void;
  onOpenBattalionDetails: () => void;
  onOpenAllSubunidades: () => void;
  onRecenter?: () => void;
}

export const CityJurisdictionCard: React.FC<CityJurisdictionCardProps> = ({
  city,
  onClose,
  onOpenBattalionDetails,
  onOpenAllSubunidades,
  onRecenter,
}) => {
  const getSubunidadeBadge = (tipo: string) => {
    switch (tipo) {
      case 'SEDE':
        return {
          bg: 'bg-blue-700 text-white border-blue-500',
          label: 'SEDE DO BATALHÃO',
        };
      case 'CIA':
        return {
          bg: 'bg-emerald-700 text-white border-emerald-500',
          label: 'COMPANHIA (CIA)',
        };
      case 'PELOTAO':
        return {
          bg: 'bg-indigo-700 text-white border-indigo-500',
          label: 'PELOTÃO PM',
        };
      case 'DPM':
        return {
          bg: 'bg-slate-700 text-white border-slate-500',
          label: 'DESTACAMENTO (DPM)',
        };
      default:
        return {
          bg: 'bg-amber-700 text-white border-amber-500',
          label: 'SUBUNIDADE PM',
        };
    }
  };

  const badge = getSubunidadeBadge(city.subunidadeTipo);

  return (
    <div
      id="city-jurisdiction-floating-card"
      className="absolute top-3 left-3 sm:left-4 z-[1000] max-w-sm sm:max-w-md w-full bg-slate-950/95 text-white rounded-xl shadow-2xl border-2 border-amber-400/80 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(251, 191, 36, 0.3)',
      }}
    >
      {/* Header with City Name & CPAI Color Strip */}
      <div
        className="px-4 py-3 text-white relative flex items-start justify-between border-b border-white/10"
        style={{
          background: `linear-gradient(135deg, ${city.cpaiCor}dd, #001D3D 90%)`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black/30 border border-white/20 shadow-inner flex-shrink-0">
            <MapPin className="w-5 h-5 text-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 text-amber-300 px-2 py-0.5 rounded border border-white/15">
                Cidade Localizada
              </span>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${badge.bg}`}
              >
                {badge.label}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight mt-0.5">
              {city.cidade}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded bg-black/30 hover:bg-black/60 text-white/80 hover:text-white transition cursor-pointer"
          title="Fechar painel"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Jurisdiction Details Body */}
      <div className="p-4 space-y-3 text-xs">
        {/* 1. CPAI Jurisdicional */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs"
              style={{ backgroundColor: city.cpaiCor }}
            />
            <div>
              <div className="text-[9.5px] uppercase font-bold text-amber-300 tracking-wider">
                Comando de Área (CPAI)
              </div>
              <div className="font-black text-white text-sm">
                {city.cpaiId}
              </div>
              <div className="text-[11px] text-white/70">
                {city.cpaiNome}
              </div>
            </div>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded text-white border"
            style={{
              backgroundColor: city.cpaiCor,
              borderColor: city.cpaiCorEscura,
            }}
          >
            Região {city.cpaiNumero}
          </span>
        </div>

        {/* 2. Batalhão / Unidade Responsável */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <div className="text-[9.5px] uppercase font-bold text-blue-300 tracking-wider">
                  Batalhão Responsável
                </div>
                <div className="font-black text-white text-sm">
                  {city.batalhaoNumero} — {city.batalhaoNome}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
            <span>
              Sede do Batalhão: <strong className="text-white">{city.batalhaoSede}</strong>
            </span>
            {city.isSede && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-500 text-slate-950">
                Esta cidade é a SEDE
              </span>
            )}
          </div>
        </div>

        {/* 3. Companhia ou Pelotão / Subunidade */}
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-400/30">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span className="text-[9.5px] uppercase font-bold text-amber-300 tracking-wider">
              Enquadramento Operacional (Companhia / Pelotão)
            </span>
          </div>
          <div className="font-bold text-white text-xs sm:text-sm pl-6">
            {city.subunidade}
          </div>
          {city.observacao && (
            <div className="text-[10.5px] text-amber-200/80 italic mt-1.5 pl-6">
              Nota: {city.observacao}
            </div>
          )}
        </div>

        {/* Tactical Badges (FT, GOE, COSAR) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {city.cosar && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-700 text-white font-black text-[10px] border border-emerald-400 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Base COSAR (Operações Rurais)
            </span>
          )}
          {city.ft && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-700 text-white font-black text-[10px] border border-blue-400 shadow-sm">
              <Shield className="w-3 h-3 text-amber-300" />
              Força Tática ({city.efetivoFT} policiais)
            </span>
          )}
          {city.goe && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-600 text-white font-black text-[10px] border border-amber-300 shadow-sm">
              <Award className="w-3 h-3 text-white" />
              GOE Ativo ({city.efetivoGOE} policiais)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between gap-2">
        {onRecenter && (
          <button
            onClick={onRecenter}
            className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
            title="Re-centralizar na cidade"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Centralizar</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onOpenBattalionDetails}
            className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-sm transition cursor-pointer flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Ficha do Batalhão</span>
          </button>
          <button
            onClick={onOpenAllSubunidades}
            className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm transition cursor-pointer flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Ver Cias/Pelotões</span>
          </button>
        </div>
      </div>
    </div>
  );
};
