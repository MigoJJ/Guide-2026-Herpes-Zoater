import React from 'react';
import type { DermatomeId, LesionSelection } from '../../domain/types';

interface ViewProps {
  lesions: LesionSelection[];
}

export const AnteriorView: React.FC<ViewProps> = ({ lesions }) => {
  const isSelected = (dermatome: DermatomeId, side: 'L' | 'R') => {
    return lesions.some(
      (l) => l.dermatome === dermatome && (l.side === side || l.side === 'Bilateral')
    );
  };

  return (
    <svg
      viewBox="0 0 360 620"
      className="svgRoot"
      xmlns="http://www.w3.org/2000/svg"
      role="region"
      aria-label="대상포진 전면 피부분절 지도"
    >
      <defs>
        <style>
          {`
            .d-label { font-size: 9px; font-weight: 600; fill: #475569; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
            .side-indicator { font-size: 11px; font-weight: 700; fill: #94a3b8; }
          `}
        </style>
      </defs>

      {/* Side Orientation Labels (Anatomical: Patient's Right is Viewer's Left, Patient's Left is Viewer's Right) */}
      <text x="35" y="25" className="side-indicator">Right (우측)</text>
      <text x="260" y="25" className="side-indicator">Left (좌측)</text>

      {/* --- HEAD & NECK (C2-C4) --- */}
      {/* C2 / C3 Neck */}
      <path
        d="M 155 70 L 180 70 L 180 95 L 145 95 Z"
        data-dermatome="C2"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'R')}
        aria-label="우측 C2 피부분절"
      />
      <path
        d="M 180 70 L 205 70 L 215 95 L 180 95 Z"
        data-dermatome="C2"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'L')}
        aria-label="좌측 C2 피부분절"
      />
      <text x="162" y="82" className="d-label">C2</text>
      <text x="198" y="82" className="d-label">C2</text>

      {/* C3 Lower Neck */}
      <path
        d="M 145 95 L 180 95 L 180 115 L 135 115 Z"
        data-dermatome="C3"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'R')}
        aria-label="우측 C3 피부분절"
      />
      <path
        d="M 180 95 L 215 95 L 225 115 L 180 115 Z"
        data-dermatome="C3"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'L')}
        aria-label="좌측 C3 피부분절"
      />
      <text x="157" y="105" className="d-label">C3</text>
      <text x="203" y="105" className="d-label">C3</text>

      {/* C4 Supraclavicular / Upper Shoulder */}
      <path
        d="M 135 115 L 180 115 L 180 135 L 115 135 Z"
        data-dermatome="C4"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'R')}
        aria-label="우측 C4 피부분절"
      />
      <path
        d="M 180 115 L 225 115 L 245 135 L 180 135 Z"
        data-dermatome="C4"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'L')}
        aria-label="좌측 C4 피부분절"
      />
      <text x="150" y="125" className="d-label">C4</text>
      <text x="210" y="125" className="d-label">C4</text>

      {/* --- UPPER EXTREMITIES (C5, C6, C7, C8, T1) --- */}
      {/* Right Arm: C5 (Deltoid/Lateral Upper arm) */}
      <path
        d="M 115 135 L 85 145 L 75 195 L 105 185 Z"
        data-dermatome="C5"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'R')}
        aria-label="우측 C5 피부분절"
      />
      <text x="95" y="165" className="d-label">C5</text>

      {/* Left Arm: C5 */}
      <path
        d="M 245 135 L 275 145 L 285 195 L 255 185 Z"
        data-dermatome="C5"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'L')}
        aria-label="좌측 C5 피부분절"
      />
      <text x="265" y="165" className="d-label">C5</text>

      {/* C6 (Lateral Forearm / Thumb) */}
      <path
        d="M 75 195 L 55 245 L 75 250 L 95 200 Z"
        data-dermatome="C6"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C6', 'R')}
        aria-label="우측 C6 피부분절"
      />
      <text x="75" y="225" className="d-label">C6</text>

      <path
        d="M 285 195 L 305 245 L 285 250 L 265 200 Z"
        data-dermatome="C6"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C6', 'L')}
        aria-label="좌측 C6 피부분절"
      />
      <text x="285" y="225" className="d-label">C6</text>

      {/* C7 (Middle Hand / Forearm) */}
      <path
        d="M 55 245 L 45 285 L 65 285 L 75 250 Z"
        data-dermatome="C7"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'R')}
        aria-label="우측 C7 피부분절"
      />
      <text x="60" y="265" className="d-label">C7</text>

      <path
        d="M 305 245 L 315 285 L 295 285 L 285 250 Z"
        data-dermatome="C7"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'L')}
        aria-label="좌측 C7 피부분절"
      />
      <text x="300" y="265" className="d-label">C7</text>

      {/* C8 (Medial Hand / Little Finger) */}
      <path
        d="M 65 285 L 75 320 L 90 315 L 75 285 Z"
        data-dermatome="C8"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C8', 'R')}
        aria-label="우측 C8 피부분절"
      />
      <text x="78" y="300" className="d-label">C8</text>

      <path
        d="M 295 285 L 285 320 L 270 315 L 285 285 Z"
        data-dermatome="C8"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C8', 'L')}
        aria-label="좌측 C8 피부분절"
      />
      <text x="282" y="300" className="d-label">C8</text>

      {/* --- THORACIC SEGMENTS (T1 - T12) --- */}
      {[
        { id: 'T1', y: 135, h: 18, label: 'T1' },
        { id: 'T2', y: 153, h: 18, label: 'T2' },
        { id: 'T3', y: 171, h: 18, label: 'T3' },
        { id: 'T4', y: 189, h: 20, label: 'T4 (Nipple)' },
        { id: 'T5', y: 209, h: 18, label: 'T5' },
        { id: 'T6', y: 227, h: 18, label: 'T6 (Xiphoid)' },
        { id: 'T7', y: 245, h: 18, label: 'T7' },
        { id: 'T8', y: 263, h: 18, label: 'T8' },
        { id: 'T9', y: 281, h: 18, label: 'T9' },
        { id: 'T10', y: 299, h: 20, label: 'T10 (Umbilicus)' },
        { id: 'T11', y: 319, h: 18, label: 'T11' },
        { id: 'T12', y: 337, h: 20, label: 'T12 (Groin)' },
      ].map((seg) => (
        <React.Fragment key={seg.id}>
          {/* Right Thoracic (Viewer Left) */}
          <rect
            x="115"
            y={seg.y}
            width="65"
            height={seg.h}
            data-dermatome={seg.id}
            data-side="R"
            data-region="thoracic"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'R')}
            aria-label={`우측 ${seg.id} 피부분절`}
          />
          <text x="147" y={seg.y + seg.h / 2} className="d-label">
            {seg.id}
          </text>

          {/* Left Thoracic (Viewer Right) */}
          <rect
            x="180"
            y={seg.y}
            width="65"
            height={seg.h}
            data-dermatome={seg.id}
            data-side="L"
            data-region="thoracic"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'L')}
            aria-label={`좌측 ${seg.id} 피부분절`}
          />
          <text x="213" y={seg.y + seg.h / 2} className="d-label">
            {seg.id}
          </text>
        </React.Fragment>
      ))}

      {/* --- LOWER EXTREMITIES (L1 - L5, S1) --- */}
      {/* L1 Inguinal / Upper Groin */}
      <path
        d="M 115 357 L 180 357 L 180 380 L 125 380 Z"
        data-dermatome="L1"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'R')}
        aria-label="우측 L1 피부분절"
      />
      <text x="150" y="368" className="d-label">L1</text>

      <path
        d="M 180 357 L 245 357 L 235 380 L 180 380 Z"
        data-dermatome="L1"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'L')}
        aria-label="좌측 L1 피부분절"
      />
      <text x="210" y="368" className="d-label">L1</text>

      {/* L2 Anterior Thigh (Upper) */}
      <path
        d="M 125 380 L 180 380 L 175 420 L 125 420 Z"
        data-dermatome="L2"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'R')}
        aria-label="우측 L2 피부분절"
      />
      <text x="150" y="400" className="d-label">L2</text>

      <path
        d="M 180 380 L 235 380 L 235 420 L 185 420 Z"
        data-dermatome="L2"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'L')}
        aria-label="좌측 L2 피부분절"
      />
      <text x="210" y="400" className="d-label">L2</text>

      {/* L3 Anterior Thigh (Lower & Knee) */}
      <path
        d="M 125 420 L 175 420 L 170 470 L 130 470 Z"
        data-dermatome="L3"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L3', 'R')}
        aria-label="우측 L3 피부분절"
      />
      <text x="150" y="445" className="d-label">L3</text>

      <path
        d="M 185 420 L 235 420 L 230 470 L 190 470 Z"
        data-dermatome="L3"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L3', 'L')}
        aria-label="좌측 L3 피부분절"
      />
      <text x="210" y="445" className="d-label">L3</text>

      {/* L4 Medial Leg & Ankle */}
      <path
        d="M 130 470 L 160 470 L 155 530 L 135 530 Z"
        data-dermatome="L4"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L4', 'R')}
        aria-label="우측 L4 피부분절"
      />
      <text x="145" y="500" className="d-label">L4</text>

      <path
        d="M 200 470 L 230 470 L 225 530 L 205 530 Z"
        data-dermatome="L4"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L4', 'L')}
        aria-label="좌측 L4 피부분절"
      />
      <text x="215" y="500" className="d-label">L4</text>

      {/* L5 Lateral Leg & Dorsum of Foot */}
      <path
        d="M 160 470 L 170 470 L 170 560 L 140 560 L 155 530 Z"
        data-dermatome="L5"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L5', 'R')}
        aria-label="우측 L5 피부분절"
      />
      <text x="160" y="525" className="d-label">L5</text>

      <path
        d="M 190 470 L 200 470 L 205 530 L 220 560 L 190 560 Z"
        data-dermatome="L5"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L5', 'L')}
        aria-label="좌측 L5 피부분절"
      />
      <text x="200" y="525" className="d-label">L5</text>

      {/* S1 Lateral Foot & Heel */}
      <path
        d="M 140 560 L 170 560 L 165 590 L 135 590 Z"
        data-dermatome="S1"
        data-side="R"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'R')}
        aria-label="우측 S1 피부분절"
      />
      <text x="152" y="575" className="d-label">S1</text>

      <path
        d="M 190 560 L 220 560 L 225 590 L 195 590 Z"
        data-dermatome="S1"
        data-side="L"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'L')}
        aria-label="좌측 S1 피부분절"
      />
      <text x="208" y="575" className="d-label">S1</text>
    </svg>
  );
};
