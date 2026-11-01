import React from 'react';
import styles from './HistoryPanel.module.css';
import { useEncounterStore, selectHistory } from '../../store';
import { format, subDays } from 'date-fns';
import type { BiologicalSex, ProdromeSymptom, RashStage, RiskFactor } from '../../domain/types';

export const HistoryPanel: React.FC = () => {
  const history = useEncounterStore(selectHistory);
  const setOnsetDate = useEncounterStore((s) => s.setOnsetDate);
  const setRashStage = useEncounterStore((s) => s.setRashStage);
  const setPainNrs = useEncounterStore((s) => s.setPainNrs);
  const toggleProdrome = useEncounterStore((s) => s.toggleProdrome);
  const toggleRiskFactor = useEncounterStore((s) => s.toggleRiskFactor);
  const setAge = useEncounterStore((s) => s.setAge);
  const setSex = useEncounterStore((s) => s.setSex);
  const setWeightKg = useEncounterStore((s) => s.setWeightKg);
  const setSerumCreatinine = useEncounterStore((s) => s.setSerumCreatinine);
  const setEgfr = useEncounterStore((s) => s.setEgfr);
  const setCrcl = useEncounterStore((s) => s.setCrcl);
  const resetCrclToAuto = useEncounterStore((s) => s.resetCrclToAuto);
  const [crclDraft, setCrclDraft] = React.useState<string | null>(null);
  const setNewVesiclesEmerging = useEncounterStore((s) => s.setNewVesiclesEmerging);
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

      {/* 0. Patient Demographics & Renal Calculator */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>환자 기본 정보 및 신기능 산출 (Demographics & CrCl)</span>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>나이 (세)</label>
            <input
              type="number"
              min="1"
              max="120"
              placeholder="예: 75"
              className={styles.textInput}
              style={{ width: '70px' }}
              value={history.age ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                setAge(val);
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>성별</label>
            <select
              className={styles.selectInput}
              style={{ width: '80px' }}
              value={history.sex ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : (e.target.value as BiologicalSex);
                setSex(val);
              }}
            >
              <option value="">선택</option>
              <option value="M">남성 (M)</option>
              <option value="F">여성 (F)</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>체중 (kg)</label>
            <input
              type="number"
              min="20"
              max="250"
              step="0.5"
              placeholder="예: 50"
              className={styles.textInput}
              style={{ width: '70px' }}
              value={history.weightKg ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                setWeightKg(val);
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>혈청 Cr (mg/dL)</label>
            <input
              type="number"
              min="0.1"
              max="20"
              step="0.1"
              placeholder="예: 1.0"
              className={styles.textInput}
              style={{ width: '80px' }}
              value={history.serumCreatinine ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                setSerumCreatinine(val);
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>eGFR (검사결과)</label>
            <input
              type="number"
              min="0"
              max="150"
              placeholder="예: 56"
              className={styles.textInput}
              style={{ width: '80px' }}
              value={history.egfr ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                setEgfr(val);
              }}
            />
          </div>
        </div>

        {/* CrCl Cockcroft-Gault Comparison Display Box */}
        {(history.crcl !== null || history.egfr !== null) && (
          <div className={styles.renalResultBox}>
            <div className={styles.renalComparisonRow}>
              <div>
                <strong>적용 신기능 지표: </strong>
                {history.crcl !== null && (
                  <span className={`${styles.renalTag} ${styles.renalTagCrcl}`}>
                    CrCl: {history.crcl} mL/min {history.isCrclManual ? '(수동 입력됨)' : '(Cockcroft-Gault 자동산출)'}
                  </span>
                )}
                {history.egfr !== null && (
                  <span className={`${styles.renalTag} ${styles.renalTagEgfr}`} style={{ marginLeft: '6px' }}>
                    eGFR: {history.egfr} mL/min/1.73m²
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CrCl 수동조정:</span>
                <input
                  type="number"
                  placeholder="mL/min"
                  className={styles.textInput}
                  style={{ width: '70px', padding: '2px 6px', fontSize: '11px' }}
                  value={crclDraft ?? history.crcl ?? ''}
                  onChange={(e) => {
                    // Keep an empty field as a local draft so the auto-computed value
                    // does not pop back in mid-edit (typing would append to it).
                    setCrclDraft(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!Number.isNaN(val)) setCrcl(val);
                  }}
                  onBlur={() => {
                    if (crclDraft === '') setCrcl(null);
                    setCrclDraft(null);
                  }}
                />
                {history.isCrclManual && (
                  <button
                    type="button"
                    onClick={resetCrclToAuto}
                    className={styles.quickBtn}
                    style={{ fontSize: '10px', padding: '2px 6px' }}
                    title="나이/성별/체중/Cr 기반 자동 계산으로 복원"
                  >
                    자동 계산 복원
                  </button>
                )}
              </div>
            </div>
            <div className={styles.renalHint}>
              💡 <strong>CrCl vs eGFR 주의:</strong> 미국 FDA 허가 기준(발라시클로버, 아시클로버, 가바펜틴)은 Cockcroft-Gault CrCl 기준입니다. 고령·저체중 환자(예: 75세 여, 50kg, Cr 1.0)는 eGFR(56)보다 실제 CrCl(38)이 현저히 낮아 용량 감량이 필요합니다.
            </div>
          </div>
        )}
      </div>

      {/* 1. Onset Date & New Vesicle Status */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>발병일자 (Onset Date) 및 진행 상태</span>
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

        <div style={{ marginTop: '4px' }}>
          <div
            className={`${styles.chip} ${styles.warningChip}`}
            data-checked={history.newVesiclesEmerging}
            onClick={() => setNewVesiclesEmerging(!history.newVesiclesEmerging)}
          >
            {history.newVesiclesEmerging ? '✓ ' : '+ '}
            새로운 수포가 계속 형성 중 (72시간 초과 시에도 항바이러스제 강력 권고)
          </div>
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

      {/* 6. Risk Factors */}
      <div className={styles.formSection}>
        <div className={styles.sectionLabel}>
          <span>기저질환 및 위험인자 (Risk Factors)</span>
        </div>
        <div className={styles.chipGroup}>
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
      </div>
    </div>
  );
};
