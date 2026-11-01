import React, { useState } from 'react';
import styles from './DermatomeMap.module.css';
import { DermatomeImageMap, type MapViewFocus } from './DermatomeImageMap';
import { useEncounterStore, selectLesions } from '../../store';
import type { DermatomeId, Side } from '../../domain/types';
import { getDermatomesByRegion } from '../../domain/dermatomes';

export const DermatomeMap: React.FC = () => {
  const [activeView, setActiveView] = useState<MapViewFocus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const lesions = useEncounterStore(selectLesions);
  const toggleLesion = useEncounterStore((state) => state.toggleLesion);
  const clearLesions = useEncounterStore((state) => state.clearLesions);

  // Root Event Delegation for SVG clicks
  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as Element).closest('[data-dermatome]');
    if (!target) return;

    const dermatome = target.getAttribute('data-dermatome') as DermatomeId;
    const side = (target.getAttribute('data-side') as Side) || 'R';

    if (dermatome) {
      toggleLesion(dermatome, side);
    }
  };

  // Keyboard accessibility: Enter or Space toggles selected element
  const handleSvgKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = (e.target as Element).closest('[data-dermatome]');
      if (!target) return;

      e.preventDefault();
      const dermatome = target.getAttribute('data-dermatome') as DermatomeId;
      const side = (target.getAttribute('data-side') as Side) || 'R';

      if (dermatome) {
        toggleLesion(dermatome, side);
      }
    }
  };

  // Helper for auxiliary list
  const getSelectedSide = (id: DermatomeId): Side | null => {
    const item = lesions.find((l) => l.dermatome === id);
    return item ? item.side : null;
  };

  const regions: Array<{ id: 'cranial' | 'cervical' | 'thoracic' | 'lumbar' | 'sacral'; title: string; shortLabel: string }> = [
    { id: 'cranial', title: '삼차신경/안면 (Cranial V1-V3)', shortLabel: '삼차신경' },
    { id: 'cervical', title: '경추 분절 (Cervical C2-C8)', shortLabel: '경추' },
    { id: 'thoracic', title: '흉추 분절 (Thoracic T1-T12)', shortLabel: '흉추' },
    { id: 'lumbar', title: '요추 분절 (Lumbar L1-L5)', shortLabel: '요추' },
    { id: 'sacral', title: '천추 분절 (Sacral S1-S5)', shortLabel: '천추' },
  ];

  const toggleSection = (regId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [regId]: !prev[regId],
    }));
  };

  const handleToggleAllSections = () => {
    const areAnyCollapsed = regions.some((r) => collapsedSections[r.id]);
    if (areAnyCollapsed) {
      // Expand all
      setCollapsedSections({});
    } else {
      // Collapse all
      const allCollapsed: Record<string, boolean> = {};
      regions.forEach((r) => {
        allCollapsed[r.id] = true;
      });
      setCollapsedSections(allCollapsed);
    }
  };

  const allExpanded = !regions.some((r) => collapsedSections[r.id]);

  return (
    <div className={styles.mapContainer}>
      {/* Header with View Tabs and Summary Badge */}
      <div className={styles.mapHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>피부분절(Dermatome) 검진 및 선택</h2>
          <span className={styles.badge}>
            {lesions.length === 0
              ? '병변 미선택'
              : `${lesions.length}개 부위 침범 (${lesions.map((l) => `${l.side} ${l.dermatome}`).join(', ')})`}
          </span>
          {lesions.length > 0 && (
            <button
              onClick={clearLesions}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface-secondary)',
                borderRadius: '4px',
              }}
            >
              초기화
            </button>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className={styles.viewSelector} role="tablist">
          <button
            role="tab"
            aria-selected={activeView === 'all'}
            className={styles.viewButton}
            onClick={() => setActiveView('all')}
          >
            전체 뷰 (Full)
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'anterior'}
            className={styles.viewButton}
            onClick={() => setActiveView('anterior')}
          >
            전면 (Anterior)
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'posterior'}
            className={styles.viewButton}
            onClick={() => setActiveView('posterior')}
          >
            후면 (Posterior)
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'face'}
            className={styles.viewButton}
            onClick={() => setActiveView('face')}
          >
            안면/두경부 (Cranial)
          </button>
        </div>
      </div>

      {/* Main Content: High-Resolution Clinical Illustration Image Map + Auxiliary List */}
      <div className={styles.contentSplit}>
        {/* Left: Interactive Clinical Illustration with SVG Overlays */}
        <div className={styles.svgWrapper}>
          <div
            onClick={handleSvgClick}
            onKeyDown={handleSvgKeyDown}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <DermatomeImageMap lesions={lesions} viewFocus={activeView} />
          </div>

          {/* Color Legend matching HZdermatomeimage.webp */}
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#c7d2fe' }} />
              <span>삼차신경(V1-3)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#fbcfe8' }} />
              <span>경추(C2-8)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#bbf7d0' }} />
              <span>흉추(T1-12)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#bae6fd' }} />
              <span>요추(L1-5)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#e9d5ff' }} />
              <span>천추(S1-5)</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: 'rgba(37, 99, 235, 0.7)' }}
              />
              <span>선택됨 (Selected)</span>
            </div>
          </div>
        </div>

        {/* Right: Auxiliary Search & Direct Selection Panel with Custom Scroll Slidebar */}
        <div className={styles.listPanel}>
          <div className={styles.listTopBar}>
            <div className={styles.searchRow}>
              <input
                type="text"
                placeholder="분절 검색 (예: T4, V1, 유두, 배꼽, 천추, S1, 허친슨)"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className={styles.collapseAllBtn}
                onClick={handleToggleAllSections}
              >
                {allExpanded ? '모두 접기 ▴' : '모두 펼치기 ▾'}
              </button>
            </div>

            {/* Quick Region Jump Filter Chips */}
            <div className={styles.regionFilterBar}>
              <button
                type="button"
                className={styles.regionChip}
                data-active={regionFilter === 'all'}
                onClick={() => setRegionFilter('all')}
              >
                전체
              </button>
              {regions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={styles.regionChip}
                  data-active={regionFilter === r.id}
                  onClick={() => setRegionFilter(r.id)}
                >
                  {r.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sectionsContainer}>
            {regions.map((reg) => {
              if (regionFilter !== 'all' && regionFilter !== reg.id) {
                return null;
              }

              const items = getDermatomesByRegion(reg.id).filter((d) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  d.id.toLowerCase().includes(q) ||
                  d.labelKo.toLowerCase().includes(q) ||
                  d.landmarks.toLowerCase().includes(q) ||
                  d.nerve.toLowerCase().includes(q)
                );
              });

              if (items.length === 0) return null;

              const isCollapsed = !searchQuery.trim() && !!collapsedSections[reg.id];

              return (
                <div key={reg.id} className={styles.regionSection}>
                  <div
                    className={styles.regionHeader}
                    onClick={() => toggleSection(reg.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <span>{reg.title}</span>
                    <div className={styles.regionHeaderRight}>
                      <span>{items.length}개</span>
                      <span className={styles.chevronIcon}>
                        {isCollapsed ? '▶' : '▼'}
                      </span>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className={styles.itemsGrid}>
                      {items.map((meta) => {
                        const selectedSide = getSelectedSide(meta.id);
                        const isSelected = selectedSide !== null;

                        return (
                          <div
                            key={meta.id}
                            className={styles.dermatomeCard}
                            data-selected={isSelected}
                          >
                            <div className={styles.cardTop}>
                              <span>{meta.id}</span>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                {meta.nerve.split(' ')[0]}
                              </span>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                              {meta.landmarks}
                            </div>
                            <div className={styles.sideButtonGroup}>
                              <button
                                type="button"
                                className={styles.sideBtn}
                                data-active={selectedSide === 'R' || selectedSide === 'Bilateral'}
                                onClick={() => toggleLesion(meta.id, 'R')}
                                title="우측 선택"
                              >
                                우(R)
                              </button>
                              <button
                                type="button"
                                className={styles.sideBtn}
                                data-active={selectedSide === 'L' || selectedSide === 'Bilateral'}
                                onClick={() => toggleLesion(meta.id, 'L')}
                                title="좌측 선택"
                              >
                                좌(L)
                              </button>
                              <button
                                type="button"
                                className={styles.sideBtn}
                                data-active={selectedSide === 'Bilateral'}
                                onClick={() => toggleLesion(meta.id, 'Bilateral')}
                                title="양측 선택"
                              >
                                양측
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
