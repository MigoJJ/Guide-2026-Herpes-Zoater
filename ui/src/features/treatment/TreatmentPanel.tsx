import React from 'react';
import styles from './TreatmentPanel.module.css';
import { useEncounterStore, selectTreatments, selectHistory } from '../../store';
import { DRUG_REGIMENS, calculateAdjustedDose } from '../../domain/regimens';
import type { IvIndication } from '../../domain/types';

export const TreatmentPanel: React.FC = () => {
  const treatments = useEncounterStore(selectTreatments);
  const history = useEncounterStore(selectHistory);
  const toggleTreatment = useEncounterStore((s) => s.toggleTreatment);
  const selectAntiviral = useEncounterStore((s) => s.selectAntiviral);
  const selectGabapentinoid = useEncounterStore((s) => s.selectGabapentinoid);
  const switchToOral = useEncounterStore((s) => s.switchToOral);
  const setIvIndication = useEncounterStore((s) => s.setIvIndication);
  const setPrn = useEncounterStore((s) => s.setPrn);
  const updateTreatment = useEncounterStore((s) => s.updateTreatment);
  const clearTreatments = useEncounterStore((s) => s.clearTreatments);

  const selectedAntiviral = treatments.find((t) =>
    ['valacyclovir', 'famciclovir', 'famvir_kr_250', 'acyclovir_oral', 'acyclovir_iv', 'foscarnet_iv'].includes(
      t.drugId
    )
  );
  const isIvActive = selectedAntiviral?.drugId === 'acyclovir_iv' || selectedAntiviral?.drugId === 'foscarnet_iv';

  // Check concomitant safety alert
  const hasTramadol = treatments.some((t) => t.drugId === 'tramadol_apap');
  const hasGabapentinoid = treatments.some((t) => ['pregabalin', 'gabapentin'].includes(t.drugId));

  const renderDrugCard = (drugId: string, isRadio = false, onRadioSelect?: (id: string) => void) => {
    const drug = DRUG_REGIMENS[drugId];
    if (!drug) return null;

    const selectedTx = treatments.find((t) => t.drugId === drugId);
    const isSelected = !!selectedTx;

    // Calculate renal adjusted recommendation using CrCl / eGFR / weight
    const adj = calculateAdjustedDose(drugId, {
      crcl: history.crcl,
      egfr: history.egfr,
      weightKg: history.weightKg,
      age: history.age,
      ivIndication: selectedTx?.ivIndication,
    });

    return (
      <div key={drugId} className={styles.treatmentCard} data-selected={isSelected}>
        <div className={styles.cardTopRow}>
          <div className={styles.drugNameArea}>
            <input
              type={isRadio ? 'radio' : 'checkbox'}
              className={styles.inputControl}
              checked={isSelected}
              onChange={() => {
                if (isRadio && onRadioSelect) {
                  onRadioSelect(drugId);
                } else {
                  toggleTreatment(drugId);
                }
              }}
              id={`drug-${drugId}`}
              name={isRadio ? (drug.category.startsWith('antiviral') ? 'antiviral_group' : 'gabapentinoid_group') : undefined}
            />
            <label htmlFor={`drug-${drugId}`} className={styles.drugName}>
              {drug.nameKo}
            </label>
            {adj.isAdjusted && (
              <span className={styles.adjustedBadge}>
                {adj.renalMetricUsed} 용량감량 권고
              </span>
            )}
          </div>
          <span className={styles.doseBadge}>
            {adj.dose} {adj.frequency.split(' (')[0]}
          </span>
        </div>

        <div className={styles.doseDetails}>
          <div>
            <strong>권장 투여:</strong> {adj.dose} {adj.frequency} × {adj.durationDays}일
          </div>
          <div style={{ color: 'var(--text-muted)' }}>{drug.notes}</div>
          {adj.renalWarning && (
            <div className={styles.renalWarningText}>⚠️ {adj.renalWarning}</div>
          )}
          {adj.appliedTier && (
            <div className={styles.evidenceBadge}>
              <strong>적용 근거:</strong> {adj.appliedTier}
              {adj.guidelineSource ? ` [${adj.guidelineSource}]` : ''}
            </div>
          )}
        </div>

        {isSelected && (
          <div className={styles.overrideRow}>
            {/* IV Indication selector for Acyclovir IV */}
            {drugId === 'acyclovir_iv' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 600 }}>적응증:</span>
                <select
                  className={styles.selectInput}
                  value={selectedTx?.ivIndication || 'disseminated_immunocompromised'}
                  onChange={(e) => setIvIndication(drugId, e.target.value as IvIndication)}
                >
                  <option value="disseminated_immunocompromised">면역저하/파종성 (7-10일 후 경구전환)</option>
                  <option value="cns_involvement">중추신경계 침범/수막뇌염 (10-14일)</option>
                  <option value="acute_retinal_necrosis">급성망막괴사 ARN (10-14일 후 경구유지)</option>
                  <option value="severe_facial_or_ophthalmic">중증 안부/안면 대상포진</option>
                </select>
              </div>
            )}

            {/* PRN toggle for Tramadol */}
            {drugId === 'tramadol_apap' && (
              <label className={styles.prnToggle}>
                <input
                  type="checkbox"
                  checked={selectedTx?.isPrn ?? false}
                  onChange={(e) => setPrn(drugId, e.target.checked)}
                />
                <span>필요시(PRN) 투여</span>
              </label>
            )}

            <span>수동 조정:</span>
            <input
              type="text"
              placeholder={adj.dose}
              className={styles.overrideInput}
              style={{ width: '90px' }}
              value={selectedTx?.doseOverride || ''}
              onChange={(e) => updateTreatment(drugId, { doseOverride: e.target.value })}
            />
            <input
              type="text"
              placeholder={adj.frequency}
              className={styles.overrideInput}
              style={{ width: '130px' }}
              value={selectedTx?.frequencyOverride || ''}
              onChange={(e) => updateTreatment(drugId, { frequencyOverride: e.target.value })}
            />
            <input
              type="number"
              placeholder={`${adj.durationDays}일`}
              className={styles.overrideInput}
              style={{ width: '55px' }}
              value={selectedTx?.durationDays || ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                updateTreatment(drugId, { durationDays: val });
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.panelContainer}>
      <h2 className={styles.panelTitle}>
        <span>치료 처방 및 약제 선택 (Treatment Regimens)</span>
        {treatments.length > 0 && (
          <button
            type="button"
            onClick={clearTreatments}
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface-secondary)',
              borderRadius: '4px',
            }}
          >
            처방 비우기
          </button>
        )}
      </h2>

      {/* Non-Device CDS Regulatory & Independence Banner */}
      <div className={styles.transparencyBanner}>
        💡 <strong>근거를 보여주는 CDS:</strong> 환자 정보를 저장·전송하지 않도록 설계되었습니다. 처방 알고리즘과 감량 기준은 제약사 후원 없이 고재준(내과 전문의)의 검토 하에 성분명(Generic) 및 공인 가이드라인(FDA/CDC/IDSA)을 기반으로 투명하게 공개됩니다.
      </div>

      {/* Safety Alert Banner */}
      {hasTramadol && hasGabapentinoid && (
        <div className={styles.safetyAlertBanner} role="alert">
          <strong>⚠️ [병용 주의] 트라마돌 + 가바펜티노이드(프레가발린/가바펜틴) FDA 2019 안전성 경고:</strong>
          <span>중추신경 억제, 과도한 진정 및 호흡 억제 위험이 있으므로 병용 시 최저 유효 용량으로 시작하고 면밀히 모니터링하십시오.</span>
        </div>
      )}

      {/* 1. Antivirals (Single selection required) */}
      <div className={styles.categoryGroup}>
        <div className={styles.categoryHeader}>
          <span>1. 항바이러스제 (Antivirals - 단일 제제 선택 원칙)</span>
          {isIvActive && (
            <button
              type="button"
              className={styles.stepDownBtn}
              onClick={() => switchToOral('valacyclovir')}
              title="상태 안정 시 주사제에서 경구 발라시클로버로 전환"
            >
              💊 IV → 경구 전환 (Step-down)
            </button>
          )}
        </div>

        {/* Oral Subgroup */}
        <div className={styles.subgroupHeader}>경구 투여 제제 (Oral Regimens)</div>
        <div className={styles.cardsList}>
          {['valacyclovir', 'famciclovir', 'famvir_kr_250', 'acyclovir_oral'].map((id) =>
            renderDrugCard(id, true, selectAntiviral)
          )}
        </div>

        {/* IV Subgroup */}
        <div className={styles.subgroupHeader} style={{ marginTop: '10px' }}>
          정맥주사 입원 치료 제제 (IV Regimens)
        </div>
        <div className={styles.cardsList}>
          {['acyclovir_iv', 'foscarnet_iv'].map((id) =>
            renderDrugCard(id, true, selectAntiviral)
          )}
        </div>
      </div>

      {/* 2. Neuropathic Pain Modulators (Gabapentinoids - Single selection) */}
      <div className={styles.categoryGroup}>
        <div className={styles.categoryHeader}>
          <span>2. 급성기 신경병증성 통증 조절제 (Gabapentinoids - 1종 선택, 14일 후 재평가 및 감량)</span>
        </div>
        <div className={styles.cardsList}>
          {['pregabalin', 'gabapentin'].map((id) =>
            renderDrugCard(id, true, selectGabapentinoid)
          )}
        </div>
      </div>

      {/* 3. Acute Analgesics */}
      <div className={styles.categoryGroup}>
        <div className={styles.categoryHeader}>
          <span>3. 급성기 소염진통제 (Acute Analgesics - Scheduled / PRN)</span>
        </div>
        <div className={styles.cardsList}>
          {['tramadol_apap', 'nsaid_ibuprofen'].map((id) => renderDrugCard(id))}
        </div>
      </div>

      {/* 4. Glucocorticoids (Steroids - Limited Indications) */}
      <div className={styles.categoryGroup}>
        <div className={styles.categoryHeader}>
          <span>4. 전신 스테로이드 (Oral Glucocorticoid - 일상적 사용 비권장, 제한적 고려)</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '2px 4px', lineHeight: 1.4 }}>
          ℹ️ <strong>임상 적응증:</strong> Ramsay Hunt 증후군(안면마비) 또는 면역정상 성인의 심한 급성 신경염 통증에 한해 <strong>항바이러스제와 반드시 병용</strong>하여 1~2주 단기 감량 요법(Prednisolone 50mg/d → 감량) 고려.
          <br />
          🚨 <strong>금기/비권장:</strong> 면역저하자, 파종성 대상포진, 항바이러스제 없는 단독 투여 절대 금기. <strong>PHN(대상포진후신경통) 예방 효과는 입증되지 않음</strong> (Cochrane 2023, UpToDate Grade 2C). 국소 스테로이드 연고 병변 도포 금기.
        </div>
        <div className={styles.cardsList}>
          {['steroid_prednisolone'].map((id) => renderDrugCard(id))}
        </div>
      </div>

      {/* 5. Topicals */}
      <div className={styles.categoryGroup}>
        <div className={styles.categoryHeader}>
          <span>5. 국소 외용제 (Topical Agents)</span>
        </div>
        <div className={styles.cardsList}>
          {['calamine_lotion', 'lidocaine_patch'].map((id) => renderDrugCard(id))}
        </div>
      </div>
    </div>
  );
};
