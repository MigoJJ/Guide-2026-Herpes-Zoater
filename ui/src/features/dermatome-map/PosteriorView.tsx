import React from 'react';
import type { DermatomeId, LesionSelection } from '../../domain/types';

interface ViewProps {
  lesions: LesionSelection[];
}

export const PosteriorView: React.FC<ViewProps> = ({ lesions }) => {
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
      aria-label="대상포진 후면 피부분절 지도"
    >
      <defs>
        <style>
          {`
            .d-label { font-size: 9px; font-weight: 600; fill: #475569; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
            .side-indicator { font-size: 11px; font-weight: 700; fill: #94a3b8; }
          `}
        </style>
      </defs>

      {/* From Behind: Left is Viewer Left, Right is Viewer Right */}
      <text x="35" y="25" className="side-indicator">Left (좌측)</text>
      <text x="260" y="25" className="side-indicator">Right (우측)</text>

      {/* --- OCCIPUT & POSTERIOR NECK (C2-C4) --- */}
      {/* C2 Occiput */}
      <path
        d="M 145 50 L 180 50 L 180 75 L 140 75 Z"
        data-dermatome="C2"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'L')}
        aria-label="좌측 C2 후두부 피부분절"
      />
      <path
        d="M 180 50 L 215 50 L 220 75 L 180 75 Z"
        data-dermatome="C2"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'R')}
        aria-label="우측 C2 후두부 피부분절"
      />
      <text x="160" y="62" className="d-label">C2</text>
      <text x="200" y="62" className="d-label">C2</text>

      {/* C3 Posterior Neck */}
      <path
        d="M 140 75 L 180 75 L 180 100 L 135 100 Z"
        data-dermatome="C3"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'L')}
        aria-label="좌측 C3 피부분절"
      />
      <path
        d="M 180 75 L 220 75 L 225 100 L 180 100 Z"
        data-dermatome="C3"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'R')}
        aria-label="우측 C3 피부분절"
      />
      <text x="157" y="87" className="d-label">C3</text>
      <text x="203" y="87" className="d-label">C3</text>

      {/* C4 Trapezius / Base of Neck */}
      <path
        d="M 135 100 L 180 100 L 180 125 L 115 125 Z"
        data-dermatome="C4"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'L')}
        aria-label="좌측 C4 피부분절"
      />
      <path
        d="M 180 100 L 225 100 L 245 125 L 180 125 Z"
        data-dermatome="C4"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'R')}
        aria-label="우측 C4 피부분절"
      />
      <text x="150" y="112" className="d-label">C4</text>
      <text x="210" y="112" className="d-label">C4</text>

      {/* --- POSTERIOR UPPER EXTREMITIES (C5, C6, C7, C8, T1) --- */}
      {/* C5 Posterior Upper Arm */}
      <path
        d="M 115 125 L 85 140 L 75 190 L 105 180 Z"
        data-dermatome="C5"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'L')}
        aria-label="좌측 C5 피부분절"
      />
      <text x="95" y="160" className="d-label">C5</text>

      <path
        d="M 245 125 L 275 140 L 285 190 L 255 180 Z"
        data-dermatome="C5"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'R')}
        aria-label="우측 C5 피부분절"
      />
      <text x="265" y="160" className="d-label">C5</text>

      {/* C7 Posterior Middle Arm / Hand */}
      <path
        d="M 75 190 L 55 240 L 75 250 L 95 200 Z"
        data-dermatome="C7"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'L')}
        aria-label="좌측 C7 피부분절"
      />
      <text x="75" y="220" className="d-label">C7</text>

      <path
        d="M 285 190 L 305 240 L 285 250 L 265 200 Z"
        data-dermatome="C7"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'R')}
        aria-label="우측 C7 피부분절"
      />
      <text x="285" y="220" className="d-label">C7</text>

      {/* --- THORACIC SEGMENTS (T1 - T12) POSTERIOR --- */}
      {[
        { id: 'T1', y: 125, h: 18, label: 'T1' },
        { id: 'T2', y: 143, h: 18, label: 'T2' },
        { id: 'T3', y: 161, h: 18, label: 'T3' },
        { id: 'T4', y: 179, h: 18, label: 'T4' },
        { id: 'T5', y: 197, h: 18, label: 'T5' },
        { id: 'T6', y: 215, h: 18, label: 'T6' },
        { id: 'T7', y: 233, h: 18, label: 'T7' },
        { id: 'T8', y: 251, h: 18, label: 'T8' },
        { id: 'T9', y: 269, h: 18, label: 'T9' },
        { id: 'T10', y: 287, h: 18, label: 'T10' },
        { id: 'T11', y: 305, h: 18, label: 'T11' },
        { id: 'T12', y: 323, h: 18, label: 'T12' },
      ].map((seg) => (
        <React.Fragment key={seg.id}>
          {/* Left Thoracic (Viewer Left) */}
          <rect
            x="115"
            y={seg.y}
            width="65"
            height={seg.h}
            data-dermatome={seg.id}
            data-side="L"
            data-region="thoracic"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'L')}
            aria-label={`좌측 ${seg.id} 후면 피부분절`}
          />
          <text x="147" y={seg.y + seg.h / 2} className="d-label">
            {seg.id}
          </text>

          {/* Right Thoracic (Viewer Right) */}
          <rect
            x="180"
            y={seg.y}
            width="65"
            height={seg.h}
            data-dermatome={seg.id}
            data-side="R"
            data-region="thoracic"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'R')}
            aria-label={`우측 ${seg.id} 후면 피부분절`}
          />
          <text x="213" y={seg.y + seg.h / 2} className="d-label">
            {seg.id}
          </text>
        </React.Fragment>
      ))}

      {/* --- LUMBAR & SACRAL / GLUTEAL (L1-L5, S1-S5) --- */}
      {/* L1 & L2 Lumbar Back */}
      <rect
        x="115"
        y="341"
        width="65"
        height="20"
        data-dermatome="L1"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'L')}
        aria-label="좌측 L1 후면 피부분절"
      />
      <text x="147" y="351" className="d-label">L1</text>

      <rect
        x="180"
        y="341"
        width="65"
        height="20"
        data-dermatome="L1"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'R')}
        aria-label="우측 L1 후면 피부분절"
      />
      <text x="213" y="351" className="d-label">L1</text>

      {/* L2 */}
      <rect
        x="115"
        y="361"
        width="65"
        height="20"
        data-dermatome="L2"
        data-side="L"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'L')}
        aria-label="좌측 L2 후면 피부분절"
      />
      <text x="147" y="371" className="d-label">L2</text>

      <rect
        x="180"
        y="361"
        width="65"
        height="20"
        data-dermatome="L2"
        data-side="R"
        data-region="lumbar"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'R')}
        aria-label="우측 L2 후면 피부분절"
      />
      <text x="213" y="371" className="d-label">L2</text>

      {/* S3 Gluteal (Ischial area) */}
      <path
        d="M 125 381 L 180 381 L 170 415 L 125 415 Z"
        data-dermatome="S3"
        data-side="L"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S3', 'L')}
        aria-label="좌측 S3 둔부 피부분절"
      />
      <text x="145" y="398" className="d-label">S3</text>

      <path
        d="M 180 381 L 235 381 L 235 415 L 190 415 Z"
        data-dermatome="S3"
        data-side="R"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S3', 'R')}
        aria-label="우측 S3 둔부 피부분절"
      />
      <text x="215" y="398" className="d-label">S3</text>

      {/* S4 / S5 Perianal Saddle Area */}
      <ellipse
        cx="175"
        cy="405"
        rx="5"
        ry="8"
        data-dermatome="S4"
        data-side="L"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S4', 'L')}
        aria-label="좌측 S4 회음부 피부분절"
      />
      <ellipse
        cx="185"
        cy="405"
        rx="5"
        ry="8"
        data-dermatome="S4"
        data-side="R"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S4', 'R')}
        aria-label="우측 S4 회음부 피부분절"
      />
      <circle
        cx="180"
        cy="410"
        r="4"
        data-dermatome="S5"
        data-side="L"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S5', 'L') || isSelected('S5', 'R')}
        aria-label="S5 항문주위 피부분절"
      />

      {/* S2 Posterior Thigh & Popliteal */}
      <path
        d="M 125 415 L 175 415 L 170 480 L 130 480 Z"
        data-dermatome="S2"
        data-side="L"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S2', 'L')}
        aria-label="좌측 S2 대퇴후면 피부분절"
      />
      <text x="150" y="445" className="d-label">S2</text>

      <path
        d="M 185 415 L 235 415 L 230 480 L 190 480 Z"
        data-dermatome="S2"
        data-side="R"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S2', 'R')}
        aria-label="우측 S2 대퇴후면 피부분절"
      />
      <text x="210" y="445" className="d-label">S2</text>

      {/* S1 Posterior Calf & Lateral Heel */}
      <path
        d="M 130 480 L 165 480 L 160 570 L 135 570 Z"
        data-dermatome="S1"
        data-side="L"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'L')}
        aria-label="좌측 S1 하퇴후면 피부분절"
      />
      <text x="147" y="525" className="d-label">S1</text>

      <path
        d="M 195 480 L 230 480 L 225 570 L 200 570 Z"
        data-dermatome="S1"
        data-side="R"
        data-region="sacral"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'R')}
        aria-label="우측 S1 하퇴후면 피부분절"
      />
      <text x="213" y="525" className="d-label">S1</text>
    </svg>
  );
};
