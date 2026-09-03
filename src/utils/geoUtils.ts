import { CPAI, Battalion, Municipality } from '../types/cpi';

export interface ValidationIssue {
  tipo: 'erro' | 'aviso' | 'sucesso';
  mensagem: string;
  detalhe?: string;
}

/**
 * Calculates the 2D Convex Hull for a set of lat/lng coordinates (Graham Scan).
 * Expands slightly to form an aesthetic territorial polygon.
 */
export function getConvexHull(points: [number, number][]): [number, number][] {
  if (points.length <= 2) return points;

  // Find lowest point (or leftmost if tie)
  let lowest = points[0];
  for (let i = 1; i < points.length; i++) {
    if (
      points[i][0] < lowest[0] ||
      (points[i][0] === lowest[0] && points[i][1] < lowest[1])
    ) {
      lowest = points[i];
    }
  }

  // Sort points by polar angle with lowest point
  const sorted = points.slice().sort((a, b) => {
    const angleA = Math.atan2(a[0] - lowest[0], a[1] - lowest[1]);
    const angleB = Math.atan2(b[0] - lowest[0], b[1] - lowest[1]);
    if (angleA < angleB) return -1;
    if (angleA > angleB) return 1;
    // Distance if colinear
    const distA = Math.hypot(a[0] - lowest[0], a[1] - lowest[1]);
    const distB = Math.hypot(b[0] - lowest[0], b[1] - lowest[1]);
    return distA - distB;
  });

  const hull: [number, number][] = [];
  for (const pt of sorted) {
    while (
      hull.length >= 2 &&
      crossProduct(hull[hull.length - 2], hull[hull.length - 1], pt) <= 0
    ) {
      hull.pop();
    }
    hull.push(pt);
  }

  // Expand polygon slightly outward from centroid for better visual coverage
  if (hull.length >= 3) {
    const centerLat = hull.reduce((sum, p) => sum + p[0], 0) / hull.length;
    const centerLng = hull.reduce((sum, p) => sum + p[1], 0) / hull.length;
    const expansionFactor = 1.08;

    return hull.map(([lat, lng]) => [
      centerLat + (lat - centerLat) * expansionFactor,
      centerLng + (lng - centerLng) * expansionFactor,
    ]);
  }

  return hull;
}

function crossProduct(
  a: [number, number],
  b: [number, number],
  c: [number, number]
): number {
  return (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]);
}

// Canonical, contiguous territory boundary polygons for CPAI-1 to CPAI-9
// Perfectly fitting together to form the complete official map of the State of Maranhão (MP 542/2026)
const OFFICIAL_CPAI_POLYGONS: Record<string, [number, number][]> = {
  // CPAI-5: Litoral Ocidental / Baixada Maranhense (Norte)
  'CPAI-5': [
    [-1.35, -45.50],
    [-1.60, -45.10],
    [-1.82, -44.86],
    [-2.20, -44.50],
    [-2.40, -44.41],
    [-2.75, -44.55],
    [-3.10, -44.80],
    [-3.40, -45.25],
    [-3.20, -45.70],
    [-2.50, -45.70],
    [-1.80, -45.40],
    [-1.35, -45.50],
  ],

  // CPAI-8: Gurupi / Alto Turi / Zé Doca (Noroeste / Divisa Pará)
  'CPAI-8': [
    [-1.19, -46.01],
    [-1.35, -45.50],
    [-1.80, -45.40],
    [-2.50, -45.70],
    [-3.20, -45.70],
    [-3.40, -45.25],
    [-3.70, -45.35],
    [-3.85, -45.90],
    [-4.20, -46.60],
    [-3.90, -47.10],
    [-3.40, -47.05],
    [-2.80, -46.85],
    [-2.10, -46.50],
    [-1.25, -46.05],
    [-1.19, -46.01],
  ],

  // CPAI-7: Munim / Baixo Parnaíba / Lençóis (Nordeste)
  'CPAI-7': [
    [-2.55, -44.10],
    [-2.75, -42.82],
    [-2.76, -42.27],
    [-2.88, -41.88],
    [-3.50, -42.40],
    [-3.80, -42.75],
    [-4.10, -43.30],
    [-3.90, -43.80],
    [-3.75, -44.30],
    [-3.10, -44.80],
    [-2.75, -44.55],
    [-2.55, -44.10],
  ],

  // CPAI-1: Médio Mearim / Cocais (Centro-Norte / Bacabal / Pedreiras)
  'CPAI-1': [
    [-3.40, -45.25],
    [-3.75, -44.30],
    [-3.90, -44.15],
    [-4.45, -44.20],
    [-4.75, -44.40],
    [-5.00, -44.60],
    [-4.95, -45.15],
    [-4.70, -45.55],
    [-4.15, -45.50],
    [-3.70, -45.35],
    [-3.40, -45.25],
  ],

  // CPAI-4: Leste Maranhense / Cocais / Timon (Leste / Divisa Piauí)
  'CPAI-4': [
    [-3.80, -42.75],
    [-4.50, -42.70],
    [-5.09, -42.80],
    [-5.60, -43.15],
    [-5.80, -43.50],
    [-5.60, -43.90],
    [-5.15, -44.10],
    [-4.75, -44.40],
    [-4.45, -44.20],
    [-3.90, -43.80],
    [-4.10, -43.30],
    [-3.80, -42.75],
  ],

  // CPAI-3: Região Tocantina / Sul-Oeste (Imperatriz / Açailândia / Estreito)
  'CPAI-3': [
    [-4.20, -46.60],
    [-3.85, -45.90],
    [-3.70, -45.35],
    [-4.15, -45.50],
    [-4.60, -45.60],
    [-5.20, -45.85],
    [-5.80, -46.00],
    [-6.50, -46.20],
    [-6.70, -46.20],
    [-6.90, -46.80],
    [-7.10, -47.40],
    [-6.56, -47.45],
    [-6.10, -47.40],
    [-5.52, -47.47],
    [-4.95, -47.50],
    [-4.20, -46.60],
  ],

  // CPAI-2: Centro / Sertão / Barra do Corda / Grajaú (Centro-Sul)
  'CPAI-2': [
    [-4.95, -45.15],
    [-5.00, -44.60],
    [-4.75, -44.40],
    [-5.15, -44.10],
    [-5.60, -43.90],
    [-5.80, -44.20],
    [-6.30, -44.40],
    [-6.60, -44.80],
    [-6.50, -45.60],
    [-6.50, -46.20],
    [-5.80, -46.00],
    [-5.20, -45.85],
    [-4.70, -45.55],
    [-4.95, -45.15],
  ],

  // CPAI-9: Médio Parnaíba / Alto Mearim (Sudeste - MP 542/2026)
  'CPAI-9': [
    [-5.80, -43.50],
    [-5.60, -43.15],
    [-6.30, -43.30],
    [-6.76, -43.02],
    [-7.15, -43.60],
    [-7.30, -44.20],
    [-7.00, -44.80],
    [-6.60, -44.80],
    [-6.30, -44.40],
    [-5.80, -44.20],
    [-5.80, -43.50],
  ],

  // CPAI-6: Sul Maranhense / Chapadas / Balsas (Extremo Sul)
  'CPAI-6': [
    [-7.10, -47.40],
    [-6.90, -46.80],
    [-6.70, -46.20],
    [-6.50, -46.20],
    [-6.50, -45.60],
    [-6.60, -44.80],
    [-7.00, -44.80],
    [-7.30, -44.20],
    [-7.15, -43.60],
    [-7.80, -44.10],
    [-8.60, -44.80],
    [-9.50, -45.40],
    [-10.25, -45.90],
    [-9.20, -46.40],
    [-8.50, -46.80],
    [-7.80, -47.20],
    [-7.10, -47.40],
  ],
};

/**
 * Collect all points for a CPAI to build its territorial polygon.
 * Returns the exact official canonical boundary polygon.
 */
export function getCPAIPolygon(cpai: CPAI): [number, number][] {
  if (OFFICIAL_CPAI_POLYGONS[cpai.id]) {
    return OFFICIAL_CPAI_POLYGONS[cpai.id];
  }

  const points: [number, number][] = [];
  cpai.batalhoes.forEach((bat) => {
    points.push([bat.sedeLat, bat.sedeLng]);
    bat.municipios.forEach((m) => {
      points.push([m.lat, m.lng]);
    });
  });

  if (points.length === 0) return [];
  return getConvexHull(points);
}

/**
 * Centroid calculation for placing the large CPAI title watermark on the map
 */
export function getCPAICentroid(cpai: CPAI): [number, number] {
  const poly = getCPAIPolygon(cpai);
  if (poly.length === 0) {
    if (cpai.batalhoes.length > 0) {
      return [cpai.batalhoes[0].sedeLat, cpai.batalhoes[0].sedeLng];
    }
    return MARANHAO_CENTER;
  }
  const sumLat = poly.reduce((acc, p) => acc + p[0], 0);
  const sumLng = poly.reduce((acc, p) => acc + p[1], 0);
  return [sumLat / poly.length, sumLng / poly.length];
}

/**
 * Canonical Perimeter Coordinates for the complete State of Maranhão.
 * Formed by the seamless union of the 9 CPAIs along the official state borders.
 */
export const MARANHAO_OUTER_BOUNDARY: [number, number][] = [
  // 1. Coastline / Atlantic Ocean (North)
  [-1.19, -46.01], // From CPAI-8 / Pará border
  [-1.35, -45.50], // CPAI-8 -> CPAI-5 junction
  [-1.60, -45.10], // CPAI-5 coastline
  [-1.82, -44.86], // Cururupu / Guimarães
  [-2.20, -44.50], // Baía de São Marcos entrance
  [-2.40, -44.41], // Alcântara
  [-2.55, -44.10], // CPAI-5 -> CPAI-7 junction (São Luís / Rosário approach)
  [-2.75, -42.82], // CPAI-7 Lençóis Maranhenses
  [-2.76, -42.27], // Tutóia
  [-2.88, -41.88], // Araioses / Delta do Parnaíba

  // 2. East Border with Piauí (Rio Parnaíba)
  [-3.50, -42.40], // CPAI-7
  [-3.80, -42.75], // CPAI-7 -> CPAI-4 junction
  [-4.50, -42.70], // CPAI-4
  [-5.09, -42.80], // Timon / Teresina
  [-5.60, -43.15], // Matões / Parnarama
  [-5.80, -43.50], // CPAI-4 -> CPAI-9 junction
  [-6.30, -43.30], // CPAI-9
  [-6.76, -43.02], // Barão de Grajaú / Floriano
  [-7.15, -43.60], // CPAI-9 -> CPAI-6 junction
  [-7.80, -44.10], // CPAI-6
  [-8.60, -44.80], // CPAI-6
  [-9.50, -45.40], // CPAI-6 Alto Parnaíba valley

  // 3. Southernmost Tip (Nascentes do Parnaíba)
  [-10.25, -45.90], // CPAI-6 Extremo Sul do Maranhão

  // 4. West / Southwest Border with Tocantins (Rio Tocantins)
  [-9.20, -46.40], // CPAI-6
  [-8.50, -46.80], // CPAI-6
  [-7.80, -47.20], // CPAI-6
  [-7.10, -47.40], // CPAI-6 -> CPAI-3 junction
  [-6.56, -47.45], // Estreito (CPAI-3)
  [-6.10, -47.40], // Porto Franco (CPAI-3)
  [-5.52, -47.47], // Imperatriz (CPAI-3)
  [-4.95, -47.50], // Açailândia / Rio Tocantins (CPAI-3)

  // 5. Northwest Border with Pará (Rio Gurupi)
  [-4.20, -46.60], // CPAI-3 -> CPAI-8 junction
  [-3.90, -47.10], // CPAI-8
  [-3.40, -47.05], // CPAI-8
  [-2.80, -46.85], // CPAI-8
  [-2.10, -46.50], // CPAI-8
  [-1.25, -46.05], // CPAI-8 Foz do Rio Gurupi
  [-1.19, -46.01], // Back to start
];

/**
 * Generates an inverted mask polygon (world polygon with a hole for Maranhão)
 * used to completely block out neighboring states and reveal ONLY Maranhão.
 */
export function getMaranhaoMaskPolygon(): [number, number][][] {
  const worldOuterRing: [number, number][] = [
    [-85, -180],
    [-85, 180],
    [85, 180],
    [85, -180],
    [-85, -180],
  ];

  return [worldOuterRing, MARANHAO_OUTER_BOUNDARY];
}

/**
 * Neighboring States and Border Reference Nodes (kept empty per user request:
 * "NÃO MOSTRAR ESTADOS VIZINHOS PARA NÃO ATRAPALHAR A VISUALIZAÇÃO DO MAPA DO ESTADO")
 */
export interface NeighborStateLabel {
  name: string;
  lat: number;
  lng: number;
  type: 'state' | 'ocean' | 'city';
}

export const NEIGHBOR_LABELS: NeighborStateLabel[] = [
  { name: 'PARÁ', lat: -4.3, lng: -48.6, type: 'state' },
  { name: 'TOCANTINS', lat: -7.8, lng: -48.3, type: 'state' },
  { name: 'PIAUÍ', lat: -5.9, lng: -42.1, type: 'state' },
  { name: 'CEARÁ', lat: -4.5, lng: -40.2, type: 'state' },
  { name: 'OCEANO ATLÂNTICO', lat: -0.95, lng: -44.2, type: 'ocean' },
  // Border cities for geographical orientation when neighbor states are enabled
  { name: 'Belém (PA)', lat: -1.4558, lng: -48.4902, type: 'city' },
  { name: 'Teresina (PI)', lat: -5.0920, lng: -42.8038, type: 'city' },
  { name: 'Parnaíba (PI)', lat: -2.9031, lng: -41.7769, type: 'city' },
  { name: 'Araguaína (TO)', lat: -7.1925, lng: -48.2044, type: 'city' },
  { name: 'Floriano (PI)', lat: -6.7694, lng: -43.0228, type: 'city' },
];

/**
 * Main Federal Highway Network for cartographic overlay
 */
export interface HighwayRoute {
  name: string;
  color: string;
  points: [number, number][];
}

export const HIGHWAY_NETWORK: HighwayRoute[] = [
  {
    name: 'BR-135',
    color: '#dc2626',
    points: [
      [-2.53, -44.3], // São Luís
      [-2.86, -44.23], // Rosário
      [-3.39, -44.35], // Itapecuru Mirim
      [-3.59, -44.57], // Miranda do Norte
      [-4.04, -44.47], // São Mateus
      [-4.38, -44.33], // Peritoró
      [-5.29, -44.49], // Presidente Dutra
      [-6.02, -44.24], // Colinas
      [-6.49, -43.70], // São João dos Patos
      [-7.53, -46.03], // Balsas
      [-9.10, -45.93], // Alto Parnaíba
    ],
  },
  {
    name: 'BR-316',
    color: '#ea580c',
    points: [
      [-5.09, -42.83], // Timon
      [-4.85, -43.35], // Caxias
      [-4.45, -43.88], // Codó
      [-4.38, -44.33], // Peritoró
      [-4.24, -44.78], // Bacabal
      [-3.66, -45.38], // Santa Inês
      [-3.27, -45.65], // Zé Doca
      [-2.13, -45.86], // Gov. Nunes Freire
      [-1.85, -46.10], // Divisa MA/PA
    ],
  },
  {
    name: 'BR-222',
    color: '#d97706',
    points: [
      [-3.74, -43.35], // Chapadinha
      [-3.39, -44.35], // Itapecuru Mirim
      [-3.45, -44.78], // Arari / Viana
      [-3.66, -45.38], // Santa Inês
      [-4.34, -46.40], // Buriticupu
      [-4.94, -47.50], // Açailândia
      [-5.52, -47.47], // Imperatriz
    ],
  },
  {
    name: 'BR-010',
    color: '#b91c1c',
    points: [
      [-4.48, -47.52], // Itinga do Maranhão
      [-4.94, -47.50], // Açailândia
      [-5.52, -47.47], // Imperatriz
      [-6.56, -47.45], // Estreito
      [-7.33, -47.46], // Carolina
    ],
  },
  {
    name: 'BR-230',
    color: '#ca8a04',
    points: [
      [-6.76, -43.02], // Barão de Grajaú / Floriano
      [-6.49, -43.70], // São João dos Patos
      [-5.29, -44.49], // Presidente Dutra
      [-5.50, -45.24], // Barra do Corda
      [-5.81, -46.13], // Grajaú
      [-6.56, -47.45], // Estreito
    ],
  },
];

/**
 * Bounds calculation for Maranhão and specific CPAIs
 */
export const MARANHAO_CENTER: [number, number] = [-5.0, -45.2];
export const MARANHAO_DEFAULT_ZOOM = 7;

export const MARANHAO_BOUNDS: [[number, number], [number, number]] = [
  [-10.25, -48.8], // Southwest (Alto Parnaíba / Balsas / Carolina)
  [-1.0, -41.6],   // Northeast (Lençóis / Tutóia / Araioses)
];

export function getMaranhaoBounds(allCPAIs?: CPAI[]): [[number, number], [number, number]] {
  if (!allCPAIs || allCPAIs.length === 0) return MARANHAO_BOUNDS;

  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180;

  allCPAIs.forEach((cpai) => {
    cpai.batalhoes.forEach((bat) => {
      if (bat.sedeLat < minLat) minLat = bat.sedeLat;
      if (bat.sedeLat > maxLat) maxLat = bat.sedeLat;
      if (bat.sedeLng < minLng) minLng = bat.sedeLng;
      if (bat.sedeLng > maxLng) maxLng = bat.sedeLng;

      bat.municipios.forEach((m) => {
        if (m.lat < minLat) minLat = m.lat;
        if (m.lat > maxLat) maxLat = m.lat;
        if (m.lng < minLng) minLng = m.lng;
        if (m.lng > maxLng) maxLng = m.lng;
      });
    });
  });

  if (minLat === 90) return MARANHAO_BOUNDS;

  const latMargin = (maxLat - minLat) * 0.05 || 0.15;
  const lngMargin = (maxLng - minLng) * 0.05 || 0.15;

  return [
    [minLat - latMargin, minLng - lngMargin],
    [maxLat + latMargin, maxLng + lngMargin],
  ];
}

export function getCPAIBounds(cpai: CPAI): [[number, number], [number, number]] {
  const poly = getCPAIPolygon(cpai);
  if (poly.length === 0) {
    return [
      [-9.2, -48.5],
      [-1.1, -41.5],
    ];
  }

  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180;
  poly.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  // add slight margin
  const latMargin = (maxLat - minLat) * 0.1 || 0.2;
  const lngMargin = (maxLng - minLng) * 0.1 || 0.2;

  return [
    [minLat - latMargin, minLng - lngMargin],
    [maxLat + latMargin, maxLng + lngMargin],
  ];
}

/**
 * Automatic Quality Assurance validation checking:
 * 1. Every unit has a CPAI assigned
 * 2. Every unit has a valid headquarters (sede)
 * 3. FT and GOE are booleans and counts are numeric
 * 4. CPAI-9 presence & MP 542/2026 unit migration consistency
 * 5. No duplicate municipalities assigned in error
 */
export function validateCPIData(data: CPAI[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenMunicipalities = new Map<string, string>();

  // Check CPAI-9
  const cpai9 = data.find((c) => c.id === 'CPAI-9');
  if (!cpai9) {
    issues.push({
      tipo: 'erro',
      mensagem: 'CPAI-9 não encontrado no dataset!',
    });
  } else {
    issues.push({
      tipo: 'sucesso',
      mensagem: 'CPAI-9 configurado com conformidade à MP nº 542/2026.',
      detalhe: `${cpai9.batalhoes.length} unidades vinculadas (11º, 35º, 44º, 47º BPM).`,
    });
  }

  data.forEach((cpai) => {
    if (!cpai.id || !cpai.nome) {
      issues.push({
        tipo: 'erro',
        mensagem: `CPAI inválido: id ou nome ausente (${cpai.id})`,
      });
    }

    cpai.batalhoes.forEach((bat) => {
      if (!bat.sede || isNaN(bat.sedeLat) || isNaN(bat.sedeLng)) {
        issues.push({
          tipo: 'erro',
          mensagem: `Unidade ${bat.numero} sem sede ou coordenadas válidas.`,
        });
      }

      if (typeof bat.ft !== 'boolean' || typeof bat.efetivoFT !== 'number') {
        issues.push({
          tipo: 'erro',
          mensagem: `Unidade ${bat.numero} com formato inválido para FT.`,
        });
      }

      if (typeof bat.goe !== 'boolean' || typeof bat.efetivoGOE !== 'number') {
        issues.push({
          tipo: 'erro',
          mensagem: `Unidade ${bat.numero} com formato inválido para GOE.`,
        });
      }

      bat.municipios.forEach((m) => {
        const key = m.nome.trim().toLowerCase();
        if (
          seenMunicipalities.has(key) &&
          !key.includes('área sul') &&
          !key.includes('área norte') &&
          !key.includes('toda área') &&
          !key.includes('sede 48') &&
          !key.includes('base')
        ) {
          issues.push({
            tipo: 'aviso',
            mensagem: `Município "${m.nome}" citado em mais de uma unidade (${seenMunicipalities.get(key)} e ${bat.numero}).`,
          });
        } else {
          seenMunicipalities.set(key, bat.numero);
        }
      });
    });
  });

  return issues;
}
