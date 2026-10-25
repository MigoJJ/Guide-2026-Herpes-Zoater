import React, { useMemo } from 'react';
import styles from './AlertsPanel.module.css';
import {
  useEncounterStore,
  selectHistory,
  selectLesions,
  selectTreatments,
} from '../../store';
import { evaluateRedFlags } from '../../domain/redFlags';
import type { Encounter } from '../../domain/types';

export const AlertsPanel: React.FC = () => {
  const history = useEncounterStore(selectHistory);
  const lesions = useEncounterStore(selectLesions);
  const treatments = useEncounterStore(selectTreatments);

  const encounter: Encounter = useMemo(
    () => ({ history, lesions, treatments }),
    [history, lesions, treatments]
  );

  const alerts = useMemo(() => evaluateRedFlags(encounter), [encounter]);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={styles.alertsContainer} role="region" aria-label="임상 경고 알림">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={styles.alertCard}
          data-severity={alert.severity}
          role="alert"
        >
          <div className={styles.alertTitle}>{alert.title}</div>
          <div className={styles.alertMessage}>{alert.message}</div>
          {alert.recommendation && (
            <div className={styles.alertRecommendation}>
              권고 조치: {alert.recommendation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
