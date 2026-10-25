import React, { useState, useMemo } from 'react';
import styles from './NotePanel.module.css';
import {
  useEncounterStore,
  selectHistory,
  selectLesions,
  selectTreatments,
} from '../../store';
import { generateNote } from '../../domain/noteGenerator';
import type { Encounter } from '../../domain/types';

export const NotePanel: React.FC = () => {
  const history = useEncounterStore(selectHistory);
  const lesions = useEncounterStore(selectLesions);
  const treatments = useEncounterStore(selectTreatments);

  const [locale, setLocale] = useState<'ko' | 'en'>('ko');
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const encounter: Encounter = useMemo(
    () => ({ history, lesions, treatments }),
    [history, lesions, treatments]
  );

  // Derived note from state
  const generatedNote = useMemo(() => {
    return generateNote(encounter, { locale });
  }, [encounter, locale]);

  // Is dirty flag: doctor manually modified text
  const isDirty = draft !== null && draft !== generatedNote;
  const currentNote = draft ?? generatedNote;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
  };

  const handleResetToAuto = () => {
    setDraft(null);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentNote);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        return;
      }
    } catch {
      // Fallback below
    }

    // Fallback for hospital EMR non-secure HTTP intranet webviews
    try {
      if (typeof document.execCommand === 'function') {
        const textArea = document.createElement('textarea');
        textArea.value = currentNote;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.panelTitle}>
            <span>EMR 표준 진료 기록 (Clinical SOAP Note)</span>
          </h2>
        </div>

        <div className={styles.controlsArea}>
          <button
            type="button"
            className={styles.localeBtn}
            data-active={locale === 'ko'}
            onClick={() => setLocale('ko')}
          >
            KOR
          </button>
          <button
            type="button"
            className={styles.localeBtn}
            data-active={locale === 'en'}
            onClick={() => setLocale('en')}
          >
            ENG
          </button>

          <button
            type="button"
            className={styles.copyButton}
            data-copied={copied}
            onClick={handleCopy}
            title="EMR 진료기록에 붙여넣기 위해 복사"
          >
            {copied ? '✓ 복사완료 (Copied!)' : '📋 EMR 복사 (Copy)'}
          </button>
        </div>
      </div>

      {isDirty && (
        <div className={styles.dirtyBanner}>
          <span>✏️ 의사 직접 수정 모드 (입력 변경 시 자동 갱신이 중지되었습니다).</span>
          <button type="button" className={styles.resetBtn} onClick={handleResetToAuto}>
            자동 생성으로 초기화
          </button>
        </div>
      )}

      {copied && (
        <div className={styles.toast}>
          <span>✓ EMR 클립보드에 복사되었습니다! 차트 작성란에서 <strong>Ctrl+V</strong>를 누르세요.</span>
        </div>
      )}

      <textarea
        className={styles.noteTextarea}
        value={currentNote}
        onChange={handleTextChange}
        placeholder="진료 정보가 입력되면 실시간으로 표준 SOAP 기록이 작성됩니다."
        spellCheck={false}
        aria-label="생성된 EMR 표준 진료기록"
      />
    </div>
  );
};
