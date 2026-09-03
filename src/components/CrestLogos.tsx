import React from 'react';

/**
 * Brasão Oficial do Estado do Maranhão
 */
export const BrasaoMaranhao: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brasão do Estado do Maranhão"
    >
      {/* Radiant Sun in Background */}
      <circle cx="50" cy="22" r="16" fill="#FBBF24" />
      <path
        d="M50 4 L53 14 L63 8 L59 18 L69 16 L62 24 L72 26 L63 32 L70 38 L59 39 L63 49 L53 44 L50 54 L47 44 L37 49 L41 39 L30 38 L37 32 L28 26 L38 24 L31 16 L41 18 L37 8 L47 14 Z"
        fill="#F59E0B"
        opacity="0.85"
      />

      {/* Laurel Wreath */}
      <path
        d="M20 75 C12 55 18 35 32 28 C28 40 28 60 40 76 Z"
        fill="#15803D"
        opacity="0.95"
      />
      <path
        d="M80 75 C88 55 82 35 68 28 C72 40 72 60 60 76 Z"
        fill="#15803D"
        opacity="0.95"
      />

      {/* Main Shield */}
      <path
        d="M30 32 L70 32 C70 55 65 72 50 82 C35 72 30 55 30 32 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="2"
      />

      {/* Shield Quarters / Stripes */}
      {/* Top Left: Maranhão flag stripes (Red, White, Black) */}
      <path d="M31 33 L50 33 L50 45 L31 45 Z" fill="#DC2626" />
      <path d="M31 45 L50 45 L50 51 L31 51 Z" fill="#FFFFFF" />
      <path d="M31 51 L50 51 L50 57 L31 57 Z" fill="#18181B" />
      
      {/* Top Right: Sky Blue with White Star */}
      <path d="M50 33 L69 33 L69 57 L50 57 Z" fill="#2563EB" />
      <polygon
        points="59.5,38 61,43 66,43 62,46.5 63.5,51.5 59.5,48.5 55.5,51.5 57,46.5 53,43 58,43"
        fill="#FFFFFF"
      />

      {/* Bottom Half: Golden book and quill / sword */}
      <path d="M31 57 L69 57 C68 70 60 77 50 81 C40 77 32 70 31 57 Z" fill="#F8FAFC" />
      <rect x="42" y="62" width="16" height="11" rx="1" fill="#D97706" />
      <rect x="44" y="64" width="12" height="7" rx="0.5" fill="#FEF3C7" />
      <line x1="50" y1="64" x2="50" y2="71" stroke="#D97706" strokeWidth="1" />

      {/* Central Sword */}
      <path d="M49 20 L51 20 L51 86 L49 86 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
      <path d="M44 26 L56 26 L54 28 L46 28 Z" fill="#F59E0B" />

      {/* Banner Ribbon at Base */}
      <path
        d="M20 83 L34 78 L50 83 L66 78 L80 83 L76 89 L50 85 L24 89 Z"
        fill="#DC2626"
        stroke="#991B1B"
        strokeWidth="1"
      />
      <text
        x="50"
        y="86"
        textAnchor="middle"
        fontSize="4"
        fontWeight="bold"
        fill="#FFFFFF"
        fontFamily="sans-serif"
      >
        ESTADO DO MARANHÃO
      </text>
    </svg>
  );
};

/**
 * Brasão Oficial da POLÍCIA MILITAR DO MARANHÃO (PMMA - Imagem 004.png)
 * Circular com anel de 24 estrelas brancas, estrela dourada central e brasão quadripartido do Maranhão
 */
export const BrasaoPMMA: React.FC<{ className?: string; withText?: boolean }> = ({
  className = 'w-12 h-12',
  withText = true,
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brasão Oficial da Polícia Militar do Maranhão"
    >
      <defs>
        {/* Arched text paths */}
        <path id="pmma-arch-top" d="M 28,100 A 72,72 0 1,1 172,100" fill="none" />
        <path id="pmma-arch-bottom" d="M 172,100 A 72,72 0 1,1 28,100" fill="none" />
        
        {/* Radial Gold Gradient */}
        <radialGradient id="pmma-gold-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </radialGradient>
      </defs>

      {/* Arched Typography: POLÍCIA MILITAR / MARANHÃO */}
      {withText && (
        <>
          <text
            fill="#0F172A"
            fontSize="18"
            fontWeight="900"
            fontFamily="Arial Black, Impact, sans-serif"
            letterSpacing="2"
          >
            <textPath href="#pmma-arch-top" startOffset="50%" textAnchor="middle">
              POLÍCIA MILITAR
            </textPath>
          </text>

          <text
            fill="#0F172A"
            fontSize="18"
            fontWeight="900"
            fontFamily="Arial Black, Impact, sans-serif"
            letterSpacing="3"
          >
            <textPath href="#pmma-arch-bottom" startOffset="50%" textAnchor="middle">
              MARANHÃO
            </textPath>
          </text>
        </>
      )}

      {/* Outer Golden Ring with Bevel & Black Trim */}
      <circle cx="100" cy="100" r="76" fill="#F59E0B" stroke="#000000" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="72" fill="#EAB308" stroke="#78350F" strokeWidth="1" />

      {/* Cobalt Blue Ring with 24 White Stars */}
      <circle cx="100" cy="100" r="69" fill="#002D80" stroke="#000000" strokeWidth="1.5" />

      {/* 24 Stars in Blue Ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 60 * Math.sin(rad);
        const cy = 100 - 60 * Math.cos(rad);
        return (
          <polygon
            key={i}
            points={`
              ${cx},${cy - 5} 
              ${cx + 1.5},${cy - 1.5} 
              ${cx + 5},${cy - 1.5} 
              ${cx + 2.2},${cy + 1} 
              ${cx + 3.2},${cy + 4.8} 
              ${cx},${cy + 2.5} 
              ${cx - 3.2},${cy + 4.8} 
              ${cx - 2.2},${cy + 1} 
              ${cx - 5},${cy - 1.5} 
              ${cx - 1.5},${cy - 5}
            `}
            fill="#FFFFFF"
          />
        );
      })}

      {/* Inner Red Circle */}
      <circle cx="100" cy="100" r="51" fill="#C8102E" stroke="#000000" strokeWidth="1.5" />

      {/* Golden 5-Pointed Star */}
      <polygon
        points="
          100,52 
          111,82 
          143,82 
          117,101 
          127,133 
          100,114 
          73,133 
          83,101 
          57,82 
          89,82
        "
        fill="url(#pmma-gold-grad)"
        stroke="#000000"
        strokeWidth="1.5"
      />

      {/* Central Roundel (Brasão do Maranhão - 4 Quadrantes) */}
      <g transform="translate(100, 100)">
        <circle cx="0" cy="0" r="21" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />

        {/* Clip path for 4 quadrants */}
        <clipPath id="pmma-center-clip">
          <circle cx="0" cy="0" r="20" />
        </clipPath>

        <g clipPath="url(#pmma-center-clip)">
          {/* Q1 (Top-Left): Bandeira do Maranhão (9 Faixas Vermelho/Branco/Preto + Cantão Azul com Estrela) */}
          <rect x="-20" y="-20" width="20" height="20" fill="#DC2626" />
          <line x1="-20" y1="-15.5" x2="0" y2="-15.5" stroke="#FFFFFF" strokeWidth="2.2" />
          <line x1="-20" y1="-11" x2="0" y2="-11" stroke="#000000" strokeWidth="2.2" />
          <line x1="-20" y1="-6.5" x2="0" y2="-6.5" stroke="#DC2626" strokeWidth="2.2" />
          <line x1="-20" y1="-2" x2="0" y2="-2" stroke="#FFFFFF" strokeWidth="2.2" />

          {/* Cantão azul superior esquerdo */}
          <rect x="-20" y="-20" width="9" height="9" fill="#0033A0" />
          <polygon
            points="-15.5,-18.5 -14.5,-16 -12,-16 -14,-14.5 -13,-12 -15.5,-13.5 -18,-12 -17,-14.5 -19,-16 -16.5,-16"
            fill="#FFFFFF"
          />

          {/* Q2 (Top-Right): Verde Sólido */}
          <rect x="0" y="-20" width="20" height="20" fill="#00843D" />

          {/* Q3 (Bottom-Left): Branco com Sol Radiante e Pena / Pomba */}
          <rect x="-20" y="0" width="20" height="20" fill="#FFFFFF" />
          {/* Sunburst rays */}
          <circle cx="-10" cy="10" r="4" fill="#FBBF24" />
          <line x1="-10" y1="2" x2="-10" y2="18" stroke="#F59E0B" strokeWidth="0.8" />
          <line x1="-18" y1="10" x2="-2" y2="10" stroke="#F59E0B" strokeWidth="0.8" />
          <line x1="-15" y1="5" x2="-5" y2="15" stroke="#F59E0B" strokeWidth="0.8" />
          <line x1="-15" y1="15" x2="-5" y2="5" stroke="#F59E0B" strokeWidth="0.8" />
          {/* Quill / Pen */}
          <path d="M-13 13 L-7 7" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

          {/* Q4 (Bottom-Right): Amarelo Ouro Sólido */}
          <rect x="0" y="0" width="20" height="20" fill="#FFCD00" />

          {/* Center Cross Divider Lines */}
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#000000" strokeWidth="1" />
          <line x1="0" y1="-20" x2="0" y2="20" stroke="#000000" strokeWidth="1" />
        </g>

        {/* Roundel Border */}
        <circle cx="0" cy="0" r="20" fill="none" stroke="#000000" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

/**
 * Brasão Escudo Oficial do COMANDO DO POLICIAMENTO DO INTERIOR (CPI - PM MA - Imagem 003 - CPI.jpg)
 * Escudo com faixa CPI, mapa do Maranhão, asas douradas, espada ereta, garruchas cruzadas e emblema central PMMA
 */
export const BrasaoCPI: React.FC<{ className?: string; title?: string }> = ({
  className = 'w-14 h-16',
  title = 'Comando do Policiamento do Interior - CPI/PMMA',
}) => {
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
    >
      <defs>
        <radialGradient id="cpi-gold-wing" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>

        <linearGradient id="cpi-sword-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#CA8A04" />
          <stop offset="50%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>

        <clipPath id="cpi-shield-inner-clip">
          <path d="M12 28 C12 28, 188 28, 188 28 C188 28, 188 165, 188 170 C188 205, 100 232, 100 232 C100 232, 12 205, 12 170 C12 165, 12 28, 12 28 Z" />
        </clipPath>
      </defs>

      {/* Outer Shield Golden Border with Black Edge */}
      <path
        d="M8 24 C8 24, 192 24, 192 24 C192 24, 192 168, 192 173 C192 212, 100 238, 100 238 C100 238, 8 212, 8 173 C8 168, 8 24, 8 24 Z"
        fill="#F59E0B"
        stroke="#000000"
        strokeWidth="3"
      />

      {/* Inner Shield Black Border */}
      <path
        d="M12 28 C12 28, 188 28, 188 28 C188 28, 188 165, 188 170 C188 205, 100 232, 100 232 C100 232, 12 205, 12 170 C12 165, 12 28, 12 28 Z"
        fill="#002D5C"
        stroke="#000000"
        strokeWidth="2"
      />

      {/* Inside Field of Shield: Sky Cyan Blue */}
      <g clipPath="url(#cpi-shield-inner-clip)">
        <rect x="10" y="25" width="180" height="210" fill="#00A3E0" />

        {/* Background Map of Maranhão (White silhouette with regional color tints) */}
        <g opacity="0.85" transform="translate(60, 42) scale(0.65)">
          {/* State outline filled with white and regional pastel colors */}
          <path
            d="M20 10 L55 2 L90 25 L110 20 L125 50 L110 80 L120 120 L95 160 L60 210 L50 240 L35 220 L30 170 L5 120 L15 60 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          {/* Regional division patches inside map */}
          <path d="M20 10 L55 2 L70 30 L40 45 Z" fill="#86EFAC" opacity="0.7" />
          <path d="M70 30 L90 25 L110 20 L100 55 L75 50 Z" fill="#FCA5A5" opacity="0.7" />
          <path d="M75 50 L100 55 L125 50 L110 80 L75 75 Z" fill="#FDBA74" opacity="0.7" />
          <path d="M40 45 L75 50 L75 100 L25 90 Z" fill="#FDE047" opacity="0.7" />
          <path d="M75 100 L120 120 L95 160 L50 150 Z" fill="#E2E8F0" opacity="0.7" />
          <path d="M50 150 L95 160 L60 210 L50 240 L35 220 L30 170 Z" fill="#FEF08A" opacity="0.7" />
        </g>

        {/* Crossed Golden Winchester Garruchas / Carbines behind the sword */}
        <g stroke="#000000" strokeWidth="1.2">
          {/* Left Gun (angles from bottom-left to top-right) */}
          <line x1="62" y1="110" x2="135" y2="70" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
          <line x1="62" y1="110" x2="135" y2="70" stroke="#B45309" strokeWidth="2" />
          <rect x="58" y="102" width="14" height="6" rx="2" fill="#18181B" transform="rotate(30 58 102)" />

          {/* Right Gun (angles from bottom-right to top-left) */}
          <line x1="138" y1="110" x2="65" y2="70" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
          <line x1="138" y1="110" x2="65" y2="70" stroke="#B45309" strokeWidth="2" />
          <rect x="132" y="100" width="14" height="6" rx="2" fill="#18181B" transform="rotate(-30 132 100)" />
        </g>

        {/* Large Golden Wings (Asas Abertas do CPI) */}
        {/* Left Wing */}
        <g fill="url(#cpi-gold-wing)" stroke="#451A03" strokeWidth="1">
          <path d="M96 115 C75 110 40 100 26 65 C25 68 28 85 36 98 C30 102 33 118 42 128 C37 132 40 144 54 148 C50 151 58 158 74 152 C84 148 94 135 96 115 Z" />
          {/* Feather striations */}
          <path d="M38 78 C52 94 76 110 96 115" stroke="#78350F" strokeWidth="1" fill="none" />
          <path d="M44 95 C58 108 80 120 96 122" stroke="#78350F" strokeWidth="1" fill="none" />
          <path d="M52 115 C66 126 84 132 96 130" stroke="#78350F" strokeWidth="1" fill="none" />
          <path d="M60 132 C72 138 86 142 96 138" stroke="#78350F" strokeWidth="1" fill="none" />
        </g>

        {/* Right Wing */}
        <g fill="url(#cpi-gold-wing)" stroke="#451A03" strokeWidth="1">
          <path d="M104 115 C125 110 160 100 174 65 C175 68 172 85 164 98 C170 102 167 118 158 128 C163 132 160 144 146 148 C150 151 142 158 126 152 C116 148 106 135 104 115 Z" />
          {/* Feather striations */}
          <path d="M162 78 C148 94 124 110 104 115" stroke="#78350F" strokeWidth="1" fill="none" />
          <path d="M156 95 C142 108 120 120 104 122" stroke="#78350F" strokeWidth="1" fill="none" />
          <path d="M148 115 C134 126 116 132 104 130" stroke="#78350F" strokeWidth="1" fill="none" />
          <path d="M140 132 C128 138 114 142 104 138" stroke="#78350F" strokeWidth="1" fill="none" />
        </g>

        {/* Vertical Golden Sword (Espada Central) */}
        <g stroke="#000000" strokeWidth="1.2">
          {/* Blade Top Point */}
          <path d="M100 56 L104 78 L96 78 Z" fill="url(#cpi-sword-grad)" />
          {/* Blade Lower Shaft */}
          <rect x="97" y="78" width="6" height="120" fill="url(#cpi-sword-grad)" />
          <line x1="100" y1="56" x2="100" y2="198" stroke="#78350F" strokeWidth="1" />

          {/* Lower Crossguard / Bow Accent */}
          <path d="M74 168 L100 173 L126 168 L126 182 L100 177 L74 182 Z" fill="#FACC15" />
          <circle cx="100" cy="175" r="5" fill="#EAB308" />

          {/* Sword Grip / Hilt */}
          <rect x="97" y="182" width="6" height="18" fill="#FEF08A" />
          <line x1="97" y1="186" x2="103" y2="186" stroke="#854D0E" strokeWidth="1" />
          <line x1="97" y1="190" x2="103" y2="190" stroke="#854D0E" strokeWidth="1" />
          <line x1="97" y1="194" x2="103" y2="194" stroke="#854D0E" strokeWidth="1" />

          {/* Sword Pommel Ring */}
          <circle cx="100" cy="204" r="5" fill="#FACC15" />
        </g>

        {/* Central Circular PMMA Medallion (Intersection of wings & sword) */}
        <g transform="translate(100, 118)">
          {/* Outer Gold Ring */}
          <circle cx="0" cy="0" r="28" fill="#F59E0B" stroke="#000000" strokeWidth="1.5" />
          {/* Blue Ring with Stars */}
          <circle cx="0" cy="0" r="25" fill="#002D80" stroke="#000000" strokeWidth="1" />
          
          {/* 16 White Stars on Ring */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            const sx = 21.5 * Math.sin(rad);
            const sy = -21.5 * Math.cos(rad);
            return (
              <circle key={i} cx={sx} cy={sy} r="1.3" fill="#FFFFFF" />
            );
          })}

          {/* Inner Red Field */}
          <circle cx="0" cy="0" r="18" fill="#C8102E" stroke="#000000" strokeWidth="1" />

          {/* Central Gold 5-point Star */}
          <polygon
            points="
              0,-17 
              4,-6 
              16,-6 
              7,1 
              10,12 
              0,5 
              -10,12 
              -7,1 
              -16,-6 
              -4,-6
            "
            fill="#FACC15"
            stroke="#000000"
            strokeWidth="0.8"
          />

          {/* Central 4-Quarter Roundel */}
          <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <clipPath id="cpi-medallion-clip">
            <circle cx="0" cy="0" r="7.5" />
          </clipPath>
          <g clipPath="url(#cpi-medallion-clip)">
            {/* Top-Left: Stripes */}
            <rect x="-8" y="-8" width="8" height="8" fill="#DC2626" />
            <line x1="-8" y1="-6" x2="0" y2="-6" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="-8" y1="-4" x2="0" y2="-4" stroke="#000000" strokeWidth="1" />
            <rect x="-8" y="-8" width="4" height="4" fill="#0033A0" />
            {/* Top-Right: Green */}
            <rect x="0" y="-8" width="8" height="8" fill="#00843D" />
            {/* Bottom-Left: White Sun */}
            <rect x="-8" y="0" width="8" height="8" fill="#FFFFFF" />
            <circle cx="-4" cy="4" r="2" fill="#F59E0B" />
            {/* Bottom-Right: Yellow */}
            <rect x="0" y="0" width="8" height="8" fill="#FFCD00" />
          </g>
          <circle cx="0" cy="0" r="7.5" fill="none" stroke="#000000" strokeWidth="0.8" />
        </g>

        {/* Bottom Text: PM MA */}
        <text
          x="100"
          y="218"
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fontFamily="Arial Black, Impact, sans-serif"
          fill="#0F172A"
          letterSpacing="1"
        >
          PM MA
        </text>

        {/* Top Header Bar: Blue-Red-Blue Tricolor with "C P I" in White */}
        <g>
          {/* Navy Blue Upper Header Box */}
          <rect x="12" y="28" width="176" height="30" fill="#1E3A8A" stroke="#000000" strokeWidth="1.5" />
          {/* Center Red Stripe */}
          <rect x="12" y="40" width="176" height="12" fill="#DC2626" />
          {/* White Center Dividing Line */}
          <line x1="12" y1="46" x2="188" y2="46" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Bold White Text "C P I" */}
          <text
            x="100"
            y="52"
            textAnchor="middle"
            fontSize="22"
            fontWeight="900"
            fontFamily="Arial Black, Impact, sans-serif"
            fill="#FFFFFF"
            letterSpacing="8"
            filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))"
          >
            CPI
          </text>
        </g>
      </g>
    </svg>
  );
};
