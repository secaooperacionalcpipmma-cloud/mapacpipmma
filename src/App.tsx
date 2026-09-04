import React, { useState, useMemo, useEffect } from 'react';
import { PanelLeftOpen, X } from 'lucide-react';
import { CPAI_DATA, getCPIStats } from './data/cpiMaranhao';
import { CPAI, Battalion, Municipality, FilterType } from './types/cpi';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { MapContainer } from './components/MapContainer';
import { Sidebar } from './components/Sidebar';
import { DetailModal } from './components/DetailModal';
import { Legend } from './components/Legend';
import { ExportModal } from './components/ExportModal';
import { ValidationModal } from './components/ValidationModal';
import { ProjectionHUD, MapTileTheme } from './components/ProjectionHUD';
import { BrasaoCPI, BrasaoPMMA } from './components/CrestLogos';
import { CleanStaticMap } from './components/CleanStaticMap';
import { SubunidadesModal } from './components/SubunidadesModal';
import { Subunidade } from './data/subunidadesData';

export default function App() {
  const [selectedCPAIId, setSelectedCPAIId] = useState<string | null>(null);
  const [selectedBattalionId, setSelectedBattalionId] = useState<string | null>(null);
  const [selectedBattalion, setSelectedBattalion] = useState<Battalion | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [showFooter, setShowFooter] = useState(true);
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [mapTheme, setMapTheme] = useState<MapTileTheme>('google-roadmap');
  const [isProjectionMode, setIsProjectionMode] = useState(false);
  const [isPosterView, setIsPosterView] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isSubunidadesOpen, setIsSubunidadesOpen] = useState(false);

  const stats = useMemo(() => getCPIStats(), []);

  const currentSelectedCPAI = useMemo(() => {
    if (!selectedCPAIId) return null;
    return CPAI_DATA.find((c) => c.id === selectedCPAIId) || null;
  }, [selectedCPAIId]);

  // Keyboard shortcut listener: ESC exits projection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProjectionMode) {
        setIsProjectionMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectionMode]);

  const handleSelectCPAI = (cpaiId: string | null) => {
    setSelectedCPAIId(cpaiId);
    setSelectedBattalionId(null);
    setSelectedBattalion(null);
    setSelectedMunicipality(null);
    if (cpaiId && !isProjectionMode) {
      setIsDetailOpen(true);
    }
  };

  const handleSelectBattalion = (bat: Battalion, cpai: CPAI) => {
    setSelectedCPAIId(cpai.id);
    setSelectedBattalionId(bat.id);
    setSelectedBattalion(bat);
    setSelectedMunicipality(null);
    setIsDetailOpen(true);
  };

  const handleSelectMunicipality = (
    mun: Municipality,
    bat: Battalion,
    cpai: CPAI
  ) => {
    setSelectedCPAIId(cpai.id);
    setSelectedBattalionId(bat.id);
    setSelectedBattalion(bat);
    setSelectedMunicipality(mun);
    setIsDetailOpen(true);
  };

  const handleSearchResultSelect = (
    type: 'cpai' | 'bpm' | 'municipio',
    id: string,
    extra?: string
  ) => {
    if (type === 'cpai') {
      handleSelectCPAI(id);
    } else if (type === 'bpm') {
      for (const cpai of CPAI_DATA) {
        const bat = cpai.batalhoes.find((b) => b.id === id);
        if (bat) {
          handleSelectBattalion(bat, cpai);
          return;
        }
      }
    } else if (type === 'municipio') {
      for (const cpai of CPAI_DATA) {
        const bat = cpai.batalhoes.find((b) => b.id === id);
        if (bat) {
          const mun = bat.municipios.find((m) => m.nome === extra);
          if (mun) {
            handleSelectMunicipality(mun, bat, cpai);
          } else {
            handleSelectBattalion(bat, cpai);
          }
          return;
        }
      }
    }
  };

  const handleSelectCOSAR = () => {
    for (const cpai of CPAI_DATA) {
      const bat = cpai.batalhoes.find((b) => b.cosar || b.id === '15bpm');
      if (bat) {
        const bacabalMun =
          bat.municipios.find((m) => m.hasCosar || m.nome.toLowerCase().includes('bacabal')) ||
          bat.municipios[0];
        setSelectedCPAIId(cpai.id);
        setSelectedBattalionId(bat.id);
        setSelectedBattalion(bat);
        setSelectedMunicipality(bacabalMun);
        setActiveFilter('cosar');
        setIsDetailOpen(true);
        return;
      }
    }
  };

  const handleSelectSubunidade = (sub: Subunidade) => {
    // Find matching CPAI
    const cpai = CPAI_DATA.find((c) => c.id === sub.cpaiId);
    if (!cpai) return;

    // Find battalion
    const bat = cpai.batalhoes.find(
      (b) =>
        b.numero.toLowerCase() === sub.batalhao.toLowerCase() ||
        sub.batalhao.toLowerCase().includes(b.numero.toLowerCase())
    );

    if (bat) {
      // Find municipality if matching
      const mun = bat.municipios.find(
        (m) => m.nome.toLowerCase() === sub.cidade.toLowerCase()
      );

      setSelectedCPAIId(cpai.id);
      setSelectedBattalionId(bat.id);
      setSelectedBattalion(bat);
      if (mun) {
        setSelectedMunicipality(mun);
      } else {
        setSelectedMunicipality(null);
      }
      setIsDetailOpen(true);
    } else {
      setSelectedCPAIId(cpai.id);
    }
  };

  const handleSelectTotalCPAI = () => {
    handleResetView();
  };

  const handleSelectTotalBatalhoes = () => {
    setActiveFilter('all');
    setIsSidebarOpen(true);
  };

  const handleSelectTotalMunicipios = () => {
    setShowMunicipalities(true);
    setActiveFilter('all');
  };

  const handleResetView = () => {
    setSelectedCPAIId(null);
    setSelectedBattalionId(null);
    setSelectedBattalion(null);
    setSelectedMunicipality(null);
    setActiveFilter('all');
    setSearchQuery('');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden font-sans select-none">
      {/* 1. Header (Hidden in Projection Mode or Poster Mode) */}
      {!isProjectionMode && !isPosterView && (
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetView={handleResetView}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenValidation={() => setIsValidationOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onEnterProjection={() => setIsProjectionMode(true)}
          isPosterView={isPosterView}
          onTogglePosterView={() => setIsPosterView((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          onSelectSearchResult={handleSearchResultSelect}
          allCPAIs={CPAI_DATA}
          onOpenSubunidades={() => setIsSubunidadesOpen(true)}
          onFilterCOSAR={handleSelectCOSAR}
        />
      )}

      {/* 2. Top Stats Dashboard (Hidden in Projection Mode or Poster Mode) */}
      {!isProjectionMode && !isPosterView && (
        <StatsDashboard
          stats={stats}
          selectedCPAIId={selectedCPAIId}
          onFilterFT={() => setActiveFilter(activeFilter === 'ft' ? 'all' : 'ft')}
          onFilterGOE={() => setActiveFilter(activeFilter === 'goe' ? 'all' : 'goe')}
          onFilterCOSAR={handleSelectCOSAR}
          onSelectTotalCPAI={handleSelectTotalCPAI}
          onSelectTotalBatalhoes={handleSelectTotalBatalhoes}
          onSelectTotalMunicipios={handleSelectTotalMunicipios}
          activeFilter={activeFilter}
        />
      )}

      {/* 3. Filter Bar (Hidden in Projection Mode or Poster Mode) */}
      {!isProjectionMode && !isPosterView && (
        <FilterBar
          selectedCPAIId={selectedCPAIId}
          onSelectCPAI={handleSelectCPAI}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          allCPAIs={CPAI_DATA}
          showMunicipalities={showMunicipalities}
          onToggleMunicipalities={() => setShowMunicipalities((prev) => !prev)}
          showPolygons={showPolygons}
          onTogglePolygons={() => setShowPolygons((prev) => !prev)}
          isPosterView={isPosterView}
          onTogglePosterView={() => setIsPosterView((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* 4. Main Content: Interactive Map (Full screen in Projection Mode or Poster Mode) */}
      <main className="flex-1 flex relative overflow-hidden bg-slate-950">
        {/* Navigation Sidebar (Hidden in Projection Mode or Poster Mode) */}
        {!isProjectionMode && !isPosterView && (
          <Sidebar
            allCPAIs={CPAI_DATA}
            selectedCPAIId={selectedCPAIId}
            selectedBattalionId={selectedBattalionId}
            activeFilter={activeFilter}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelectCPAI={handleSelectCPAI}
            onSelectBattalion={handleSelectBattalion}
          />
        )}

        {/* Floating Projection HUD (Shown when in Projection Mode) */}
        {isProjectionMode && (
          <ProjectionHUD
            allCPAIs={CPAI_DATA}
            selectedCPAIId={selectedCPAIId}
            activeFilter={activeFilter}
            showMunicipalities={showMunicipalities}
            showPolygons={showPolygons}
            showLabels={showLabels}
            mapTheme={mapTheme}
            isFullscreen={isFullscreen}
            onExitProjection={() => setIsProjectionMode(false)}
            onResetMaranhao={handleResetView}
            onSelectCPAI={handleSelectCPAI}
            onSelectFilter={setActiveFilter}
            onToggleMunicipalities={() => setShowMunicipalities((prev) => !prev)}
            onTogglePolygons={() => setShowPolygons((prev) => !prev)}
            onToggleLabels={() => setShowLabels((prev) => !prev)}
            onChangeMapTheme={setMapTheme}
            onToggleFullscreen={handleToggleFullscreen}
          />
        )}

        {/* Map Container (Occupies 100% of viewport in Projection Mode or Poster Mode) */}
        <div className="flex-1 relative flex flex-col h-full w-full">
          {/* Floating button to restore sidebar when hidden */}
          {!isSidebarOpen && !isProjectionMode && !isPosterView && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-2 rounded-md bg-[#002B55]/95 hover:bg-[#003870] text-white shadow-xl border border-blue-400/40 text-xs font-bold transition cursor-pointer backdrop-blur-xs"
              title="Mostrar Barra Lateral (Estrutura CPI • PMMA)"
            >
              <PanelLeftOpen className="w-4 h-4 text-amber-300" />
              <span>Mostrar Barra Lateral</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-blue-100 font-normal hidden sm:inline">
                CPAIs & BPMs
              </span>
            </button>
          )}

          {isPosterView ? (
            <CleanStaticMap
              allCPAIs={CPAI_DATA}
              selectedCPAIId={selectedCPAIId}
              onSelectCPAI={handleSelectCPAI}
              onSelectBattalion={handleSelectBattalion}
              onSwitchToInteractive={() => setIsPosterView(false)}
              onOpenSubunidades={() => setIsSubunidadesOpen(true)}
            />
          ) : (
            <MapContainer
              allCPAIs={CPAI_DATA}
              selectedCPAIId={selectedCPAIId}
              selectedBattalionId={selectedBattalionId}
              activeFilter={activeFilter}
              showMunicipalities={showMunicipalities}
              showPolygons={showPolygons}
              showLabels={showLabels}
              mapTheme={mapTheme}
              isProjectionMode={isProjectionMode}
              isPosterView={isPosterView}
              onTogglePosterView={() => setIsPosterView((prev) => !prev)}
              onEnterProjection={() => setIsProjectionMode(true)}
              onSelectCPAI={handleSelectCPAI}
              onSelectBattalion={handleSelectBattalion}
              onSelectMunicipality={handleSelectMunicipality}
            />
          )}

          {/* Map Legend (Shown in standard dashboard mode) */}
          {!isPosterView && (
            <Legend
              allCPAIs={CPAI_DATA}
              selectedCPAIId={selectedCPAIId}
              onSelectCPAI={handleSelectCPAI}
            />
          )}
        </div>
      </main>

      {/* 5. Institutional Footer (Hidden in Projection Mode or Poster Mode, or if dismissed) */}
      {!isProjectionMode && !isPosterView && showFooter && (
        <footer
          id="cpi-footer"
          className="bg-[#002244] text-white/80 text-[10px] py-1.5 px-4 border-t border-[#001830] flex items-center justify-between flex-shrink-0 font-medium tracking-wider uppercase"
        >
          <div className="flex items-center gap-2">
            <BrasaoCPI className="w-4 h-5" />
            <BrasaoPMMA className="w-4 h-4" />
            <span>Comando do Policiamento do Interior (CPI) — Polícia Militar do Maranhão</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-amber-300/90 font-bold hidden sm:block">
              Medida Provisória nº 542/2026
            </div>
            <button
              onClick={() => setShowFooter(false)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-[9.5px] transition cursor-pointer font-bold normal-case border border-white/10"
              title="Ocultar barra inferior institucional"
            >
              <X className="w-3 h-3 text-amber-300" />
              <span>Ocultar Barra</span>
            </button>
          </div>
        </footer>
      )}

      {/* Restore button if footer is hidden */}
      {!isProjectionMode && !isPosterView && !showFooter && (
        <div className="fixed bottom-2 right-2 z-30">
          <button
            onClick={() => setShowFooter(true)}
            className="px-2.5 py-1 rounded bg-[#002244]/90 hover:bg-[#002244] text-white/90 hover:text-white border border-white/20 text-[10.5px] font-bold shadow-lg transition cursor-pointer backdrop-blur-xs flex items-center gap-1.5"
            title="Mostrar barra inferior institucional"
          >
            <span>Mostrar Rodapé</span>
          </button>
        </div>
      )}

      {/* 6. Modals */}
      {isDetailOpen && (
        <DetailModal
          selectedCPAI={currentSelectedCPAI}
          selectedBattalion={selectedBattalion}
          selectedMunicipality={selectedMunicipality}
          onClose={() => {
            setIsDetailOpen(false);
          }}
          onSelectBattalion={handleSelectBattalion}
        />
      )}

      {isExportOpen && (
        <ExportModal
          allCPAIs={CPAI_DATA}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {isValidationOpen && (
        <ValidationModal
          allCPAIs={CPAI_DATA}
          onClose={() => setIsValidationOpen(false)}
        />
      )}

      {isSubunidadesOpen && (
        <SubunidadesModal
          isOpen={isSubunidadesOpen}
          onClose={() => setIsSubunidadesOpen(false)}
          onSelectSubunidade={handleSelectSubunidade}
        />
      )}
    </div>
  );
}
