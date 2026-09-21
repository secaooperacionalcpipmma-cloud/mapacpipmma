import { CPAI_DATA } from '../data/cpiMaranhao';
import { SUBUNIDADES_PMMA, Subunidade } from '../data/subunidadesData';
import { CPAI, Battalion, Municipality } from '../types/cpi';

export interface CityJurisdictionInfo {
  cidade: string;
  cidadeNormalizada: string;
  cidadeLimpa: string;
  lat: number;
  lng: number;
  cpaiId: string;
  cpaiNumero: number;
  cpaiNome: string;
  cpaiCor: string;
  cpaiCorEscura: string;
  batalhaoId: string;
  batalhaoNumero: string;
  batalhaoNome: string;
  batalhaoSede: string;
  isSede: boolean;
  subunidade: string;
  subunidadeTipo: 'SEDE' | 'CIA' | 'PELOTAO' | 'DPM' | 'GP_PM' | 'ESPECIAL';
  ft: boolean;
  efetivoFT: number;
  goe: boolean;
  efetivoGOE: number;
  cosar: boolean;
  observacao?: string;
}

/**
 * Remove accents, convert to lowercase and trim.
 */
export function normalizeText(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Clean municipal name (e.g., "Bacabal (Sede 15º BPM / Base COSAR)" -> "Bacabal")
 */
export function cleanCityName(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, '').trim();
}

// Global cached list of all indexed cities with their complete jurisdiction data
let cachedCityJurisdictions: CityJurisdictionInfo[] | null = null;

export function getAllCitiesJurisdiction(): CityJurisdictionInfo[] {
  if (cachedCityJurisdictions) {
    return cachedCityJurisdictions;
  }

  const map = new Map<string, CityJurisdictionInfo>();

  // 1. Index all municipalities from CPAI_DATA
  CPAI_DATA.forEach((cpai) => {
    cpai.batalhoes.forEach((bat) => {
      bat.municipios.forEach((mun) => {
        const limpa = cleanCityName(mun.nome);
        const norm = normalizeText(limpa);

        // Find exact or closest match in SUBUNIDADES_PMMA
        const matchingSub = SUBUNIDADES_PMMA.find(
          (s) =>
            normalizeText(s.cidade) === norm ||
            normalizeText(s.cidade).includes(norm) ||
            norm.includes(normalizeText(s.cidade))
        );

        let subunidadeText = '';
        let subTipo: 'SEDE' | 'CIA' | 'PELOTAO' | 'DPM' | 'GP_PM' | 'ESPECIAL' = 'DPM';

        if (matchingSub) {
          subunidadeText = matchingSub.subunidade;
          subTipo = matchingSub.tipo;
        } else if (mun.isSede) {
          subunidadeText = `Sede do ${bat.numero}${bat.cosar ? ' / Base COSAR' : ''}`;
          subTipo = 'SEDE';
        } else {
          subunidadeText = `Destacamento Policial Militar (DPM) / ${bat.numero}`;
          subTipo = 'DPM';
        }

        const info: CityJurisdictionInfo = {
          cidade: limpa,
          cidadeNormalizada: norm,
          cidadeLimpa: limpa,
          lat: matchingSub?.lat ?? mun.lat,
          lng: matchingSub?.lng ?? mun.lng,
          cpaiId: cpai.id,
          cpaiNumero: cpai.numero,
          cpaiNome: cpai.nome,
          cpaiCor: cpai.cor,
          cpaiCorEscura: cpai.corEscura,
          batalhaoId: bat.id,
          batalhaoNumero: bat.numero,
          batalhaoNome: bat.nome,
          batalhaoSede: bat.sede,
          isSede: Boolean(mun.isSede),
          subunidade: subunidadeText,
          subunidadeTipo: subTipo,
          ft: bat.ft,
          efetivoFT: bat.efetivoFT,
          goe: bat.goe,
          efetivoGOE: bat.efetivoGOE,
          cosar: Boolean(bat.cosar || mun.hasCosar),
          observacao: matchingSub?.observacao || bat.observacao,
        };

        map.set(norm, info);
      });
    });
  });

  // 2. Supplement from SUBUNIDADES_PMMA in case any city was listed there
  SUBUNIDADES_PMMA.forEach((sub) => {
    const limpa = cleanCityName(sub.cidade);
    const norm = normalizeText(limpa);

    if (!map.has(norm)) {
      const cpai = CPAI_DATA.find((c) => c.id === sub.cpaiId);
      const bat = cpai?.batalhoes.find(
        (b) =>
          normalizeText(b.numero) === normalizeText(sub.batalhao) ||
          b.id === sub.batalhaoId
      );

      const info: CityJurisdictionInfo = {
        cidade: limpa,
        cidadeNormalizada: norm,
        cidadeLimpa: limpa,
        lat: sub.lat,
        lng: sub.lng,
        cpaiId: sub.cpaiId,
        cpaiNumero: cpai?.numero ?? 0,
        cpaiNome: cpai?.nome ?? sub.cpaiId,
        cpaiCor: cpai?.cor ?? '#003366',
        cpaiCorEscura: cpai?.corEscura ?? '#001a33',
        batalhaoId: bat?.id ?? sub.batalhaoId,
        batalhaoNumero: bat?.numero ?? sub.batalhao,
        batalhaoNome: bat?.nome ?? sub.batalhao,
        batalhaoSede: bat?.sede ?? sub.cidade,
        isSede: sub.tipo === 'SEDE',
        subunidade: sub.subunidade,
        subunidadeTipo: sub.tipo,
        ft: bat?.ft ?? false,
        efetivoFT: bat?.efetivoFT ?? 0,
        goe: bat?.goe ?? false,
        efetivoGOE: bat?.efetivoGOE ?? 0,
        cosar: Boolean(bat?.cosar),
        observacao: sub.observacao,
      };

      map.set(norm, info);
    }
  });

  cachedCityJurisdictions = Array.from(map.values()).sort((a, b) =>
    a.cidade.localeCompare(b.cidade, 'pt-BR')
  );

  return cachedCityJurisdictions;
}

/**
 * Search cities matching the query with prioritization:
 * 1. Exact match
 * 2. Starts with query
 * 3. Contains query
 */
export function searchCities(query: string, limit = 10): CityJurisdictionInfo[] {
  const q = normalizeText(query);
  if (!q || q.length < 1) return [];

  const all = getAllCitiesJurisdiction();

  const exactMatches: CityJurisdictionInfo[] = [];
  const startsWithMatches: CityJurisdictionInfo[] = [];
  const containsMatches: CityJurisdictionInfo[] = [];

  for (const city of all) {
    if (city.cidadeNormalizada === q) {
      exactMatches.push(city);
    } else if (city.cidadeNormalizada.startsWith(q)) {
      startsWithMatches.push(city);
    } else if (
      city.cidadeNormalizada.includes(q) ||
      normalizeText(city.batalhaoNumero).includes(q) ||
      normalizeText(city.subunidade).includes(q)
    ) {
      containsMatches.push(city);
    }
  }

  return [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, limit);
}
