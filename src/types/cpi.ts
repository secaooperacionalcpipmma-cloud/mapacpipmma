export type UnitType = 'BPM' | 'EPMONT' | 'BMT' | 'CIMT' | 'ESPECIAL';

export interface Municipality {
  nome: string;
  lat: number;
  lng: number;
  isSede?: boolean;
  hasCosar?: boolean;
}

export interface Battalion {
  id: string;
  numero: string;
  nome: string;
  tipo: UnitType;
  sede: string;
  sedeLat: number;
  sedeLng: number;
  cpaiId: string;
  municipios: Municipality[];
  ft: boolean;
  efetivoFT: number;
  goe: boolean;
  efetivoGOE: number;
  cosar?: boolean;
  cosarDescricao?: string;
  isNovo?: boolean;
  migradoDe?: string;
  observacao?: string;
}

export interface CPAI {
  id: string; // e.g. "CPAI-1"
  numero: number;
  nome: string;
  descricao?: string;
  cor: string;
  corClara: string;
  corEscura: string;
  batalhoes: Battalion[];
  isNovo?: boolean;
  observacao?: string;
}

export interface CPIStats {
  totalCPAI: number;
  totalUnidades: number;
  totalBatalhoes: number;
  totalUnidadesEspeciais: number;
  totalMunicipios: number;
  unidadesComFT: number;
  unidadesComGOE: number;
  efetivoTotalFT: number;
  efetivoTotalGOE: number;
}

export type FilterType = 'all' | 'ft' | 'goe' | 'cosar' | 'especiais' | 'novos';
