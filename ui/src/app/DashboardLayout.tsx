import React from 'react';
import styles from './DashboardLayout.module.css';
import { useEncounterStore } from '../store';
import { HistoryPanel } from '../features/history/HistoryPanel';
import { DermatomeMap } from '../features/dermatome-map/DermatomeMap';
import { TreatmentPanel } from '../features/treatment/TreatmentPanel';
import { AlertsPanel } from '../features/alerts/AlertsPanel';
import { NotePanel } from '../features/note/NotePanel';

export const DashboardLayout: React.FC = () => {
  const resetAll = useEncounterStore((s) => s.resetAll);

  const handleReset = () => {
    if (
      window.confirm(
        '새 환자 진료를 위해 현재 입력된 모든 정보를 초기화하시겠습니까? (개인 식별정보 및 이전 차팅 잔존 방지)'
      )
    ) {
      resetAll();
    }
  };

  return (
    <div className={styles.appWrapper}>
      {/* Top Application Navbar */}
      <header className={styles.topNavbar}>
        <div className={styles.brandArea}>
          <div className={styles.brandLogo}>HZ</div>
          <div>
            <h1 className={styles.brandTitle}>대상포진(Herpes Zoster) EMR 보조 시스템</h1>
            <p className={styles.brandSubtitle}>
              임상 의사결정 지원 및 표준 SOAP 진료기록 실시간 생성기
            </p>
          </div>
        </div>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            title="모든 진료 입력 내용을 초기화합니다"
          >
            ↺ 새 환자 (초기화)
          </button>
        </div>
      </header>

      {/* Main 2x2 Grid Workspace */}
      <main className={styles.dashboardGrid}>
        {/* Section 1: History Taking */}
        <section className={styles.historyArea} aria-label="문진 및 병력 청취">
          <HistoryPanel />
        </section>

        {/* Section 2: Dermatome Map Examination */}
        <section className={styles.dermatomeArea} aria-label="피부분절 검진">
          <DermatomeMap />
        </section>

        {/* Section 3: Alerts & Treatment Regimens */}
        <section className={styles.treatmentArea} aria-label="처방 및 임상 경고">
          <AlertsPanel />
          <TreatmentPanel />
        </section>

        {/* Section 4: Clinical SOAP Note Generation & Copy */}
        <section className={styles.noteArea} aria-label="EMR 표준 진료기록">
          <NotePanel />
        </section>
      </main>
    </div>
  );
};
