import React from 'react';
import styles from './TreatmentPanel.module.css';
import { useEncounterStore, selectTreatments, selectHistory } from '../../store';
import { DRUG_REGIMENS, calculateAdjustedDose } from '../../domain/regimens';

export const TreatmentPanel: React.FC = () => {
  const treatments = useEncounterStore(selectTreatments);
  const history = useEncounterStore(selectHistory);
  const toggleTreatment = useEncounterStore((s) => s.toggleTreatment);
  const updateTreatment = useEncounterStore((s) => s.updateTreatment);
  const clearTreatments = useEncounterStore((s) => s.clearTreatments);

  const categories = [
    {
      id: 'antiviral',
      title: '1. 항바이러스제 (Antivirals - 발병 72시간 이내 권장)',
      drugIds: ['valacyclovir', 'famciclovir', 'acyclovir_oral', 'acyclovir_iv'],
    },
    {
      id: 'neuropathic_analgesic',
      title: '2. 신경병증성 통증 조절제 (Gabapentinoids - PHN 예방 및 조기 조절)',
      drugIds: ['pregabalin', 'gabapentin'],
    },
    {
      id: 'nsaid_analgesic',
      title: '3. 급성기 소염진통제 (Acute Analgesics)',
      drugIds: ['tramadol_apap', 'nsaid_ibuprofen'],
    },
    {
      id: 'topical',
      title: '4. 국소 외용제 (Topical Agents)',
      drugIds: ['calamine_lotion', 'lidocaine_patch'],
    },
  ];

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

      {categories.map((cat) => (
        <div key={cat.id} className={styles.categoryGroup}>
          <div className={styles.categoryHeader}>{cat.title}</div>
          <div className={styles.cardsList}>
            {cat.drugIds.map((drugId) => {
              const drug = DRUG_REGIMENS[drugId];
              if (!drug) return null;

              const selectedTx = treatments.find((t) => t.drugId === drugId);
              const isSelected = !!selectedTx;

              // Calculate renal adjusted recommendation
              const adj = calculateAdjustedDose(drugId, history.egfr);

              return (
                <div
                  key={drugId}
                  className={styles.treatmentCard}
                  data-selected={isSelected}
                >
                  <div className={styles.cardTopRow}>
                    <div className={styles.drugNameArea}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected}
                        onChange={() => toggleTreatment(drugId)}
                        id={`drug-${drugId}`}
                      />
                      <label htmlFor={`drug-${drugId}`} className={styles.drugName}>
                        {drug.nameKo}
                      </label>
                      {adj.isAdjusted && (
                        <span className={styles.adjustedBadge}>eGFR 용량감량 권고</span>
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
                  </div>

                  {isSelected && (
                    <div className={styles.overrideRow}>
                      <span>수동 조정:</span>
                      <input
                        type="text"
                        placeholder={adj.dose}
                        className={styles.overrideInput}
                        style={{ width: '90px' }}
                        value={selectedTx?.doseOverride || ''}
                        onChange={(e) =>
                          updateTreatment(drugId, { doseOverride: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder={adj.frequency}
                        className={styles.overrideInput}
                        style={{ width: '130px' }}
                        value={selectedTx?.frequencyOverride || ''}
                        onChange={(e) =>
                          updateTreatment(drugId, { frequencyOverride: e.target.value })
                        }
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
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
