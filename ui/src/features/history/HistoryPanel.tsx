import React from 'react';
import styles from './HistoryPanel.module.css';
import { useEncounterStore, selectHistory } from '../../store';
import { format, subDays } from 'date-fns';
import type { ProdromeSymptom, RashStage, RiskFactor } from '../../domain/types';

export const HistoryPanel: React.FC = () => {
  const history = useEncounterStore(selectHistory);
  const setOnsetDate = useEncounterStore((s) => s.setOnsetDate);
  const setRashStage = useEncounterStore((s) => s.setRashStage);
  const setPainNrs = useEncounterStore((s) => s.setPainNrs);
  const toggleProdrome = useEncounterStore((s) => s.toggleProdrome);
  const toggleRiskFactor = useEncounterStore((s) => s.toggleRiskFactor);
  const setEgfr = useEncounterStore((s) => s.setEgfr);
  const setOcularSymptoms = useEncounterStore((s) => s.setOcularSymptoms);
  const setHutchinsonSign = useEncounterStore((s) => s.setHutchinsonSign);
  const setHearingSymptoms = useEncounterStore((s) => s.setHearingSymptoms);
  const setFacialPalsy = useEncounterStore((s) => s.setFacialPalsy);

  const handleQuickDate = (daysAgo: number) => {
    const target = subDays(new Date(), daysAgo);
    setOnsetDate(format(target, 'yyyy-MM-dd'));
  };

  const prodromes: Array<{ id: ProdromeSymptom; label: string }> = [
    { id: 'burning', label: '작열감(화끈거림)' },
    { id: 'tingling', label: '저림/따끔거림' },
    { id: 'itching', label: '가려움증' },
    { id: 'fever', label: '발열' },
    { id: 'headache', label: '두통' },
    { id: 'malaise', label: '전신 쇠약감' },
  ];

  const rashStages: Array<{ id: RashStage; label: string }> = [
    { id: 'erythema', label: '홍반/구진' },
    { id: 'vesicular', label: '군집성 수포' },
    { id: 'pustular', label: '농포 형성' },
    { id: 'crusted', label: '가피(딱지)' },
  ];

  const riskFactors: Array<{ id: RiskFactor; label: string }> = [
    { id: 'age_ge_50', label: '50세 이상' },
    { id: 'immunocompromised', label: '면역저하자(항암/면역억제제)' },
    { id: 'ckd', label: '만성 신질환(CKD)' },
    { id: 'diabetes', label: '당뇨병' },
    { id: 'pregnancy', label: '임신부' },
  ];

  const getPainClass = (nrs: number | null) => {
    if (nrs === null || nrs === 0) return styles.painMild;
    if (nrs <= 3) return styles.painMild;
    if (nrs <= 6) return styles.painMod;
    return styles.painSev;
  };

  return (
    <div className={styles.panelContainer}>
      <h2 className={styles.panelTitle}>
        <span>병력 청취 및 문진 (History)</span>
      </h2>

      {/* 1. Onset Date */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>발병일자 (Onset Date)</span>
        </div>
        <div className={styles.inputRow}>
          <input
            type="date"
            className={styles.textInput}
            value={history.onsetDate || ''}
            onChange={(e) => setOnsetDate(e.target.value || null)}
          />
          <button type="button" className={styles.quickBtn} onClick={() => handleQuickDate(0)}>
            오늘
          </button>
          <button type="button" className={styles.quickBtn} onClick={() => handleQuickDate(1)}>
            1일 전
          </button>
          <button type="button" className={styles.quickBtn} onClick={() => handleQuickDate(2)}>
            2일 전
          </button>
          <button type="button" className={styles.quickBtn} onClick={() => handleQuickDate(3)}>
            3일 전 (골든타임)
          </button>
          <button type="button" className={styles.quickBtn} onClick={() => handleQuickDate(5)}>
            5일 전
          </button>
        </div>
      </div>

      {/* 2. Pain Scale (NRS) */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>급성 통증 척도 (NRS 0-10)</span>
          {history.painNrs !== null && (
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => setPainNrs(null)}
              style={{ fontSize: '10px' }}
            >
              미측정(Clear)
            </button>
          )}
        </div>
        <div className={styles.painContainer}>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            className={styles.painSlider}
            value={history.painNrs ?? 0}
            onChange={(e) => setPainNrs(parseInt(e.target.value, 10))}
          />
          <div className={`${styles.painBadge} ${getPainClass(history.painNrs)}`}>
            {history.painNrs === null ? 'N/A' : `${history.painNrs}점`}
          </div>
        </div>
      </div>

      {/* 3. Rash Stage */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>피부 병변 단계 (Rash Stage)</span>
        </div>
        <div className={styles.chipGroup}>
          {rashStages.map((st) => (
            <div
              key={st.id}
              className={styles.chip}
              data-checked={history.rashStage === st.id}
              onClick={() => setRashStage(history.rashStage === st.id ? null : st.id)}
            >
              {st.label}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Prodrome Symptoms */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>전구 증상 (Prodrome)</span>
        </div>
        <div className={styles.chipGroup}>
          {prodromes.map((p) => {
            const isChecked = history.prodrome.includes(p.id);
            return (
              <div
                key={p.id}
                className={styles.chip}
                data-checked={isChecked}
                onClick={() => toggleProdrome(p.id)}
              >
                {isChecked ? '✓ ' : '+ '}
                {p.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Special / Red-flag Complication Signs */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span style={{ color: 'var(--color-critical-text)', fontWeight: 700 }}>
            ⚠️ 특수 부위 침범 및 합병증 징후 (Red Flag)
          </span>
        </div>
        <div className={styles.chipGroup}>
          <div
            className={`${styles.chip} ${styles.criticalChip}`}
            data-checked={history.ocularSymptoms}
            onClick={() => setOcularSymptoms(!history.ocularSymptoms)}
          >
            {history.ocularSymptoms ? '✓ ' : '+ '}
            안구 증상 (충혈/안통/시력저하)
          </div>

          <div
            className={`${styles.chip} ${styles.criticalChip}`}
            data-checked={history.hutchinsonSign}
            onClick={() => setHutchinsonSign(!history.hutchinsonSign)}
          >
            {history.hutchinsonSign ? '✓ ' : '+ '}
            허친슨 징후 (Hutchinson Sign - 코끝 수포)
          </div>

          <div
            className={`${styles.chip} ${styles.criticalChip}`}
            data-checked={history.hearingSymptoms}
            onClick={() => setHearingSymptoms(!history.hearingSymptoms)}
          >
            {history.hearingSymptoms ? '✓ ' : '+ '}
            이과 증상 (이명/난청/어지럼증)
          </div>

          <div
            className={`${styles.chip} ${styles.criticalChip}`}
            data-checked={history.facialPalsy}
            onClick={() => setFacialPalsy(!history.facialPalsy)}
          >
            {history.facialPalsy ? '✓ ' : '+ '}
            안면 신경 마비 (Facial Palsy)
          </div>
        </div>
      </div>

      {/* 6. Risk Factors & Renal Panel */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>기저질환 및 신기능 (Risk Factors & Renal)</span>
        </div>
        <div className={styles.chipGroup} style={{ marginBottom: '8px' }}>
          {riskFactors.map((rf) => {
            const isChecked = history.riskFactors.includes(rf.id);
            return (
              <div
                key={rf.id}
                className={styles.chip}
                data-checked={isChecked}
                onClick={() => toggleRiskFactor(rf.id)}
              >
                {isChecked ? '✓ ' : '+ '}
                {rf.label}
              </div>
            );
          })}
        </div>

        <div className={styles.inputRow}>
          <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            eGFR:
          </label>
          <input
            type="number"
            min="0"
            max="150"
            placeholder="mL/min"
            className={styles.textInput}
            style={{ width: '90px' }}
            value={history.egfr ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value);
              setEgfr(val);
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {history.egfr === null
              ? '미입력 (신기능 정상 가정)'
              : history.egfr >= 60
                ? '정상/경도 저하'
                : history.egfr >= 30
                  ? '⚠️ 중등도 저하 (용량 감량)'
                  : '🚨 중증 저하/말기'}
          </span>
        </div>
      </div>
    </div>
  );
};
