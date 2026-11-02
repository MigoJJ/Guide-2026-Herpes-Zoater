import React, { useEffect } from 'react';
import styles from './DashboardLayout.module.css';
import { useEncounterStore, selectPatientSessionKey } from '../store';
import { HistoryPanel } from '../features/history/HistoryPanel';
import { DermatomeMap } from '../features/dermatome-map/DermatomeMap';
import { TreatmentPanel } from '../features/treatment/TreatmentPanel';
import { AlertsPanel } from '../features/alerts/AlertsPanel';
import { NotePanel } from '../features/note/NotePanel';
import { initEmrBridge } from '../shared/emr/emrBridge';

export const DashboardLayout: React.FC = () => {
  const resetAll = useEncounterStore((s) => s.resetAll);
  const patientSessionKey = useEncounterStore(selectPatientSessionKey);
  const [showCdsInfo, setShowCdsInfo] = React.useState(false);

  // Initialize EMR postMessage bridge listener for cross-window / iframe EMR integration
  useEffect(() => {
    const cleanup = initEmrBridge();
    return cleanup;
  }, []);

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
            <h1 className={styles.brandTitle}>대상포진(Herpes Zoster) 근거공개형 임상결정지원(CDS)</h1>
            <p className={styles.brandSubtitle}>
              최소 정보를 브라우저 안에서만 쓰고 아무것도 가져가지 않는 투명한 진료 결정 지원
            </p>
          </div>
        </div>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.infoButton}
            onClick={() => setShowCdsInfo(!showCdsInfo)}
            title="비의료기기 CDS 및 임상 근거 공개 안내"
          >
            {showCdsInfo ? '✕ 근거 안내 닫기' : 'ℹ️ 비의료기기 CDS 및 근거 안내'}
          </button>

          {/* Real-time Patient Session Indicator */}
          {patientSessionKey ? (
            <div className={styles.sessionBadge} title={`활성 EMR 환자 세션 키: ${patientSessionKey}`}>
              <span>🟢</span>
              <span>EMR 연동 세션: #{patientSessionKey.slice(0, 10)}</span>
            </div>
          ) : (
            <div className={styles.sessionBadgeStandalone}>
              <span>⚪ 단독 실행 모드</span>
            </div>
          )}

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

      {/* Non-Device CDS Regulatory Positioning & Editorial Independence Banner */}
      {showCdsInfo && (
        <div className={styles.cdsInfoBanner} role="region" aria-label="비의료기기 CDS 및 규제 공시">
          <div>
            🔒 <strong>개인정보 보호 제1원칙:</strong> 본 시스템은 <u>"최소 정보를 브라우저 안에서만 쓰고 아무것도 가져가지 않습니다."</u> 환자 인적사항과 진료 데이터는 브라우저 메모리 안에서만 즉시 연산되며, 외부 서버나 클라우드로 일절 전송되거나 보관되지 않습니다 (Zero-Storage / Zero-Egress).
          </div>
          <div>
            💡 <strong>근거를 보여주는 CDS (Evidence-Revealing CDS):</strong> 단순한 작성보조가 아닌, <u>의사가 독립적으로 권고를 검증할 수 있도록 계산 공식(Cockcroft-Gault), 환자별 신기능 컷오프 구간, 글로벌 가이드라인 출처를 화면에 투명하게 공개</u>하는 FDA 21st Century Cures Act § 3060 및 식약처 기준 비의료기기 CDS 시스템입니다. 진료 및 최종 처방 책임은 독립된 면허 의사에게 있습니다.
          </div>
          <div>
            🛡️ <strong>독립성 및 이해상충(COI) 방지:</strong> 모든 임상 권고와 감량 알고리즘은 독립 의료진(지디스내과 고재준 원장 자문)의 의학적 판단으로만 결정되며, 제약사 및 후원사는 권고 내용에 관여하지 않습니다. 성분명(Generic) 원칙을 준수하며 현재 상업적 후원 없이 독립 운영됩니다.
          </div>
        </div>
      )}

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
