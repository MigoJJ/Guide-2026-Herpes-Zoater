import React from 'react';
import type { DermatomeId, LesionSelection } from '../../domain/types';

interface ViewProps {
  lesions: LesionSelection[];
}

export const FaceView: React.FC<ViewProps> = ({ lesions }) => {
  const isSelected = (dermatome: DermatomeId, side: 'L' | 'R') => {
    return lesions.some(
      (l) => l.dermatome === dermatome && (l.side === side || l.side === 'Bilateral')
    );
  };

  return (
    <svg
      viewBox="0 0 360 460"
      className="svgRoot"
      xmlns="http://www.w3.org/2000/svg"
      role="region"
      aria-label="안면 및 삼차신경(V1-V3) 피부분절 확대 지도"
    >
      <defs>
        <style>
          {`
            .d-label-face { font-size: 11px; font-weight: 700; fill: #1e293b; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
            .hutchinson-badge { font-size: 9px; fill: #dc2626; font-weight: 700; pointer-events: none; text-anchor: middle; }
            .side-indicator { font-size: 12px; font-weight: 700; fill: #64748b; }
          `}
        </style>
      </defs>

      {/* Patient's Right is Viewer's Left, Patient's Left is Viewer's Right */}
      <text x="50" y="30" className="side-indicator">Right (우측)</text>
      <text x="250" y="30" className="side-indicator">Left (좌측)</text>

      {/* Outer Head Contour Reference */}
      <path
        d="M 60 170 C 60 70, 300 70, 300 170 C 300 310, 240 380, 180 380 C 120 380, 60 310, 60 170 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Center Dividing Midline Guide */}
      <line x1="180" y1="65" x2="180" y2="380" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />

      {/* ============================================================== */}
      {/* V1 (Ophthalmic): Forehead, Upper Eyelid, Nose Dorsum & Tip    */}
      {/* ============================================================== */}
      {/* Right V1 */}
      <path
        d="M 180 65 L 180 235 L 160 235 L 155 175 L 80 160 C 80 100, 130 65, 180 65 Z"
        data-dermatome="V1"
        data-side="R"
        data-region="cranial"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V1', 'R')}
        aria-label="우측 V1 (안신경 분절, 허친슨 징후 확인 부위)"
      />
      <text x="135" y="125" className="d-label-face">V1 (우)</text>
      <text x="145" y="225" className="hutchinson-badge">Nose Tip</text>

      {/* Left V1 */}
      <path
        d="M 180 65 L 180 235 L 200 235 L 205 175 L 280 160 C 280 100, 230 65, 180 65 Z"
        data-dermatome="V1"
        data-side="L"
        data-region="cranial"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V1', 'L')}
        aria-label="좌측 V1 (안신경 분절, 허친슨 징후 확인 부위)"
      />
      <text x="225" y="125" className="d-label-face">V1 (좌)</text>
      <text x="215" y="225" className="hutchinson-badge">Nose Tip</text>

      {/* ============================================================== */}
      {/* V2 (Maxillary): Cheek, Lower Eyelid, Upper Lip, Nose Wing     */}
      {/* ============================================================== */}
      {/* Right V2 */}
      <path
        d="M 180 235 L 180 275 L 130 275 L 80 230 L 80 160 L 155 175 L 160 235 Z"
        data-dermatome="V2"
        data-side="R"
        data-region="cranial"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V2', 'R')}
        aria-label="우측 V2 (상악신경 분절)"
      />
      <text x="130" y="210" className="d-label-face">V2 (우)</text>

      {/* Left V2 */}
      <path
        d="M 180 235 L 180 275 L 230 275 L 280 230 L 280 160 L 205 175 L 200 235 Z"
        data-dermatome="V2"
        data-side="L"
        data-region="cranial"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V2', 'L')}
        aria-label="좌측 V2 (상악신경 분절)"
      />
      <text x="230" y="210" className="d-label-face">V2 (좌)</text>

      {/* ============================================================== */}
      {/* V3 (Mandibular): Lower Lip, Chin, Jawline, Anterior Ear       */}
      {/* ============================================================== */}
      {/* Right V3 */}
      <path
        d="M 180 275 L 180 345 L 135 345 L 90 280 L 80 230 L 130 275 Z"
        data-dermatome="V3"
        data-side="R"
        data-region="cranial"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V3', 'R')}
        aria-label="우측 V3 (하악신경 분절)"
      />
      <text x="135" y="310" className="d-label-face">V3 (우)</text>

      {/* Left V3 */}
      <path
        d="M 180 275 L 180 345 L 225 345 L 270 280 L 280 230 L 230 275 Z"
        data-dermatome="V3"
        data-side="L"
        data-region="cranial"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V3', 'L')}
        aria-label="좌측 V3 (하악신경 분절)"
      />
      <text x="225" y="310" className="d-label-face">V3 (좌)</text>

      {/* ============================================================== */}
      {/* C2 / C3 Angle of Mandible & Upper Neck                         */}
      {/* ============================================================== */}
      {/* Right C2/C3 Neck */}
      <path
        d="M 180 345 L 180 405 L 120 405 L 135 345 Z"
        data-dermatome="C2"
        data-side="R"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'R')}
        aria-label="우측 C2/C3 하악각 및 경부"
      />
      <text x="155" y="375" className="d-label-face">C2/C3</text>

      {/* Left C2/C3 Neck */}
      <path
        d="M 180 345 L 180 405 L 240 405 L 225 345 Z"
        data-dermatome="C2"
        data-side="L"
        data-region="cervical"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'L')}
        aria-label="좌측 C2/C3 하악각 및 경부"
      />
      <text x="205" y="375" className="d-label-face">C2/C3</text>
    </svg>
  );
};
