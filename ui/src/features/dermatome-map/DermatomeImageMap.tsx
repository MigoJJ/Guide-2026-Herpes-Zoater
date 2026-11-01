import React from 'react';
import type { DermatomeId, LesionSelection } from '../../domain/types';
import dermatomeImg from '../../assets/dermatome_map.webp';

export type MapViewFocus = 'all' | 'anterior' | 'posterior' | 'face';

interface DermatomeImageMapProps {
  lesions: LesionSelection[];
  viewFocus: MapViewFocus;
}

export const DermatomeImageMap: React.FC<DermatomeImageMapProps> = ({
  lesions,
  viewFocus,
}) => {
  const isSelected = (dermatome: DermatomeId, side: 'L' | 'R') => {
    return lesions.some(
      (l) => l.dermatome === dermatome && (l.side === side || l.side === 'Bilateral')
    );
  };

  // Dynamic viewBox depending on active tab
  let viewBox = '0 0 618 650';
  if (viewFocus === 'anterior') {
    viewBox = '0 0 318 650';
  } else if (viewFocus === 'posterior') {
    viewBox = '300 0 318 650';
  } else if (viewFocus === 'face') {
    viewBox = '0 0 618 200';
  }

  return (
    <svg
      viewBox={viewBox}
      className="svgRoot"
      xmlns="http://www.w3.org/2000/svg"
      role="region"
      aria-label="대상포진 임상 피부분절 일러스트 지도"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
      }}
    >
      <defs>
        <style>
          {`
            .overlay-path {
              fill: transparent;
              stroke: rgba(0, 0, 0, 0.12);
              stroke-width: 0.8px;
              cursor: pointer;
              transition: fill 150ms ease, stroke 150ms ease, opacity 150ms ease;
              vector-effect: non-scaling-stroke;
            }
            .overlay-path:hover {
              fill: rgba(59, 130, 246, 0.32) !important;
              stroke: #2563eb !important;
              stroke-width: 1.5px !important;
            }
            .overlay-path[aria-pressed="true"] {
              fill: rgba(37, 99, 235, 0.58) !important;
              stroke: #1e40af !important;
              stroke-width: 2px !important;
            }
            .overlay-path:focus-visible {
              outline: none;
              stroke: #2563eb;
              stroke-width: 2.5px;
            }
            .label-text {
              font-size: 8px;
              font-weight: 700;
              fill: #1e293b;
              pointer-events: none;
              text-anchor: middle;
              dominant-baseline: central;
            }
          `}
        </style>
      </defs>

      {/* 1. Base Clinical Illustration Image */}
      <image href={dermatomeImg} x="0" y="0" width="618" height="650" />

      {/* ============================================================== */}
      {/* 2. ANTERIOR VIEW OVERLAYS (Left half, center ~ 155)            */}
      {/* Patient's Right is Viewer's Left, Patient's Left is Viewer's Right */}
      {/* ============================================================== */}

      {/* Head / Trigeminal V1-V3 (Anterior Face) */}
      {/* V1 Forehead / Eye */}
      <path
        d="M 143 28 L 155 28 L 155 68 L 140 68 Z"
        data-dermatome="V1"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V1', 'R')}
        aria-label="우측 V1 (안신경 분절)"
        className="overlay-path"
      />
      <path
        d="M 155 28 L 167 28 L 170 68 L 155 68 Z"
        data-dermatome="V1"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V1', 'L')}
        aria-label="좌측 V1 (안신경 분절)"
        className="overlay-path"
      />

      {/* V2 Cheek / Upper Lip */}
      <path
        d="M 138 68 L 155 68 L 155 83 L 138 83 Z"
        data-dermatome="V2"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V2', 'R')}
        aria-label="우측 V2 (상악신경 분절)"
        className="overlay-path"
      />
      <path
        d="M 155 68 L 172 68 L 172 83 L 155 83 Z"
        data-dermatome="V2"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V2', 'L')}
        aria-label="좌측 V2 (상악신경 분절)"
        className="overlay-path"
      />

      {/* V3 Mandible / Chin */}
      <path
        d="M 140 83 L 155 83 L 155 98 L 140 98 Z"
        data-dermatome="V3"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V3', 'R')}
        aria-label="우측 V3 (하악신경 분절)"
        className="overlay-path"
      />
      <path
        d="M 155 83 L 170 83 L 170 98 L 155 98 Z"
        data-dermatome="V3"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('V3', 'L')}
        aria-label="좌측 V3 (하악신경 분절)"
        className="overlay-path"
      />

      {/* C2, C3, C4 Anterior Neck */}
      <path
        d="M 142 98 L 155 98 L 155 110 L 140 110 Z"
        data-dermatome="C2"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'R')}
        aria-label="우측 C2 경부"
        className="overlay-path"
      />
      <path
        d="M 155 98 L 168 98 L 170 110 L 155 110 Z"
        data-dermatome="C2"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'L')}
        aria-label="좌측 C2 경부"
        className="overlay-path"
      />

      <path
        d="M 138 110 L 155 110 L 155 124 L 135 124 Z"
        data-dermatome="C3"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'R')}
        aria-label="우측 C3 쇄골상부"
        className="overlay-path"
      />
      <path
        d="M 155 110 L 172 110 L 175 124 L 155 124 Z"
        data-dermatome="C3"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'L')}
        aria-label="좌측 C3 쇄골상부"
        className="overlay-path"
      />

      <path
        d="M 130 124 L 155 124 L 155 138 L 122 138 Z"
        data-dermatome="C4"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'R')}
        aria-label="우측 C4 어깨 기저부"
        className="overlay-path"
      />
      <path
        d="M 155 124 L 180 124 L 188 138 L 155 138 Z"
        data-dermatome="C4"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'L')}
        aria-label="좌측 C4 어깨 기저부"
        className="overlay-path"
      />

      {/* Upper Extremities Anterior */}
      {/* C5 Lateral arm (Right/Viewer Left) */}
      <path
        d="M 100 138 L 122 138 L 115 195 L 85 185 Z"
        data-dermatome="C5"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'R')}
        aria-label="우측 C5 삼각근/상완 외측"
        className="overlay-path"
      />
      {/* C5 Lateral arm (Left/Viewer Right) */}
      <path
        d="M 188 138 L 210 138 L 225 185 L 195 195 Z"
        data-dermatome="C5"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'L')}
        aria-label="좌측 C5 삼각근/상완 외측"
        className="overlay-path"
      />

      {/* C6 Lateral forearm & thumb */}
      <path
        d="M 85 185 L 105 195 L 88 280 L 65 265 Z"
        data-dermatome="C6"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C6', 'R')}
        aria-label="우측 C6 전완 외측/엄지"
        className="overlay-path"
      />
      <path
        d="M 195 195 L 225 185 L 245 265 L 222 280 Z"
        data-dermatome="C6"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C6', 'L')}
        aria-label="좌측 C6 전완 외측/엄지"
        className="overlay-path"
      />

      {/* C7 Middle fingers */}
      <path
        d="M 50 310 L 72 310 L 68 360 L 45 360 Z"
        data-dermatome="C7"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'R')}
        aria-label="우측 C7 중지"
        className="overlay-path"
      />
      <path
        d="M 238 310 L 260 310 L 265 360 L 242 360 Z"
        data-dermatome="C7"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'L')}
        aria-label="좌측 C7 중지"
        className="overlay-path"
      />

      {/* C8 Medial hand/wrist */}
      <path
        d="M 68 280 L 88 280 L 85 340 L 68 335 Z"
        data-dermatome="C8"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C8', 'R')}
        aria-label="우측 C8 수근 내측/소지"
        className="overlay-path"
      />
      <path
        d="M 222 280 L 242 280 L 242 335 L 225 340 Z"
        data-dermatome="C8"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C8', 'L')}
        aria-label="좌측 C8 수근 내측/소지"
        className="overlay-path"
      />

      {/* T1 Medial forearm & arm */}
      <path
        d="M 105 195 L 125 200 L 115 270 L 98 265 Z"
        data-dermatome="T1"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('T1', 'R')}
        aria-label="우측 T1 상완/전완 내측"
        className="overlay-path"
      />
      <path
        d="M 185 200 L 205 195 L 212 265 L 195 270 Z"
        data-dermatome="T1"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('T1', 'L')}
        aria-label="좌측 T1 상완/전완 내측"
        className="overlay-path"
      />

      {/* Thoracic Anterior Bands T1 - T12 (Chevron/Curved bands across chest) */}
      {[
        { id: 'T1', y: 138, h: 14, label: 'T1' },
        { id: 'T2', y: 152, h: 13, label: 'T2' },
        { id: 'T3', y: 165, h: 13, label: 'T3' },
        { id: 'T4', y: 178, h: 14, label: 'T4 (유두)' },
        { id: 'T5', y: 192, h: 13, label: 'T5' },
        { id: 'T6', y: 205, h: 13, label: 'T6 (검상돌기)' },
        { id: 'T7', y: 218, h: 13, label: 'T7' },
        { id: 'T8', y: 231, h: 13, label: 'T8' },
        { id: 'T9', y: 244, h: 13, label: 'T9' },
        { id: 'T10', y: 257, h: 14, label: 'T10 (배꼽)' },
        { id: 'T11', y: 271, h: 13, label: 'T11' },
        { id: 'T12', y: 284, h: 14, label: 'T12 (서혜부)' },
      ].map((seg) => (
        <React.Fragment key={`ant-${seg.id}`}>
          {/* Right Thoracic (Viewer Left) */}
          <path
            d={`M 115 ${seg.y} L 155 ${seg.y + 2} L 155 ${seg.y + seg.h + 2} L 115 ${seg.y + seg.h} Z`}
            data-dermatome={seg.id}
            data-side="R"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'R')}
            aria-label={`우측 ${seg.id} 전면 분절`}
            className="overlay-path"
          />
          {/* Left Thoracic (Viewer Right) */}
          <path
            d={`M 155 ${seg.y + 2} L 195 ${seg.y} L 195 ${seg.y + seg.h} L 155 ${seg.y + seg.h + 2} Z`}
            data-dermatome={seg.id}
            data-side="L"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'L')}
            aria-label={`좌측 ${seg.id} 전면 분절`}
            className="overlay-path"
          />
        </React.Fragment>
      ))}

      {/* L1 Inguinal / Pelvis Anterior */}
      <path
        d="M 112 298 L 155 300 L 155 328 L 115 325 Z"
        data-dermatome="L1"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'R')}
        aria-label="우측 L1 서혜부"
        className="overlay-path"
      />
      <path
        d="M 155 300 L 198 298 L 195 325 L 155 328 Z"
        data-dermatome="L1"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'L')}
        aria-label="좌측 L1 서혜부"
        className="overlay-path"
      />

      {/* S3, S4 Genital / Perineal */}
      <path
        d="M 148 328 L 155 328 L 155 355 L 145 350 Z"
        data-dermatome="S3"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S3', 'R')}
        aria-label="우측 S3 생식기/회음부"
        className="overlay-path"
      />
      <path
        d="M 155 328 L 162 328 L 165 350 L 155 355 Z"
        data-dermatome="S3"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S3', 'L')}
        aria-label="좌측 S3 생식기/회음부"
        className="overlay-path"
      />

      {/* L2 Anterior Thigh (Upper Oblique) */}
      <path
        d="M 115 325 L 148 328 L 142 390 L 115 390 Z"
        data-dermatome="L2"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'R')}
        aria-label="우측 L2 대퇴부 상부 전면"
        className="overlay-path"
      />
      <path
        d="M 162 328 L 195 325 L 195 390 L 168 390 Z"
        data-dermatome="L2"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'L')}
        aria-label="좌측 L2 대퇴부 상부 전면"
        className="overlay-path"
      />

      {/* L3 Anterior Lower Thigh & Knee */}
      <path
        d="M 115 390 L 142 390 L 138 465 L 118 465 Z"
        data-dermatome="L3"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L3', 'R')}
        aria-label="우측 L3 슬관절 전내측"
        className="overlay-path"
      />
      <path
        d="M 168 390 L 195 390 L 192 465 L 172 465 Z"
        data-dermatome="L3"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L3', 'L')}
        aria-label="좌측 L3 슬관절 전내측"
        className="overlay-path"
      />

      {/* L4 Medial Lower Leg & Malleolus */}
      <path
        d="M 118 465 L 138 465 L 135 565 L 122 565 Z"
        data-dermatome="L4"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L4', 'R')}
        aria-label="우측 L4 하태 내측/내과"
        className="overlay-path"
      />
      <path
        d="M 172 465 L 192 465 L 188 565 L 175 565 Z"
        data-dermatome="L4"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L4', 'L')}
        aria-label="좌측 L4 하태 내측/내과"
        className="overlay-path"
      />

      {/* L5 Lateral Lower Leg & Foot Dorsum */}
      <path
        d="M 135 465 L 145 465 L 140 610 L 128 610 Z"
        data-dermatome="L5"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L5', 'R')}
        aria-label="우측 L5 하태 외측/발등"
        className="overlay-path"
      />
      <path
        d="M 165 465 L 175 465 L 182 610 L 170 610 Z"
        data-dermatome="L5"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L5', 'L')}
        aria-label="좌측 L5 하태 외측/발등"
        className="overlay-path"
      />

      {/* S1 Lateral Foot */}
      <path
        d="M 125 610 L 140 610 L 138 642 L 123 642 Z"
        data-dermatome="S1"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'R')}
        aria-label="우측 S1 발 외측/제5족지"
        className="overlay-path"
      />
      <path
        d="M 170 610 L 185 610 L 187 642 L 172 642 Z"
        data-dermatome="S1"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'L')}
        aria-label="좌측 S1 발 외측/제5족지"
        className="overlay-path"
      />

      {/* ============================================================== */}
      {/* 3. POSTERIOR VIEW OVERLAYS (Right half, center ~ 465)          */}
      {/* From Behind: Left is Viewer Left, Right is Viewer Right        */}
      {/* ============================================================== */}

      {/* Posterior Head C2 Occiput */}
      <path
        d="M 450 25 L 465 25 L 465 65 L 448 65 Z"
        data-dermatome="C2"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'L')}
        aria-label="좌측 C2 후두부"
        className="overlay-path"
      />
      <path
        d="M 465 25 L 480 25 L 482 65 L 465 65 Z"
        data-dermatome="C2"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C2', 'R')}
        aria-label="우측 C2 후두부"
        className="overlay-path"
      />

      {/* Posterior Neck C3, C4 */}
      <path
        d="M 445 65 L 465 65 L 465 85 L 442 85 Z"
        data-dermatome="C3"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'L')}
        aria-label="좌측 C3 경부 후면"
        className="overlay-path"
      />
      <path
        d="M 465 65 L 485 65 L 488 85 L 465 85 Z"
        data-dermatome="C3"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C3', 'R')}
        aria-label="우측 C3 경부 후면"
        className="overlay-path"
      />

      <path
        d="M 440 85 L 465 85 L 465 110 L 435 110 Z"
        data-dermatome="C4"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'L')}
        aria-label="좌측 C4 승모근/경부 기저"
        className="overlay-path"
      />
      <path
        d="M 465 85 L 490 85 L 495 110 L 465 110 Z"
        data-dermatome="C4"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C4', 'R')}
        aria-label="우측 C4 승모근/경부 기저"
        className="overlay-path"
      />

      {/* Posterior Arms C5, C6, C7, C8 */}
      <path
        d="M 410 120 L 435 120 L 425 185 L 395 180 Z"
        data-dermatome="C5"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'L')}
        aria-label="좌측 C5 견부/상완 외측 후면"
        className="overlay-path"
      />
      <path
        d="M 495 120 L 520 120 L 535 180 L 505 185 Z"
        data-dermatome="C5"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C5', 'R')}
        aria-label="우측 C5 견부/상완 외측 후면"
        className="overlay-path"
      />

      <path
        d="M 385 240 L 405 240 L 388 330 L 368 330 Z"
        data-dermatome="C7"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'L')}
        aria-label="좌측 C7 전완 후면/중지"
        className="overlay-path"
      />
      <path
        d="M 525 240 L 545 240 L 562 330 L 542 330 Z"
        data-dermatome="C7"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('C7', 'R')}
        aria-label="우측 C7 전완 후면/중지"
        className="overlay-path"
      />

      {/* Thoracic Posterior Bands T1 - T12 (Back bands curving down) */}
      {[
        { id: 'T1', y: 125, h: 12 },
        { id: 'T2', y: 137, h: 12 },
        { id: 'T3', y: 149, h: 12 },
        { id: 'T4', y: 161, h: 12 },
        { id: 'T5', y: 173, h: 12 },
        { id: 'T6', y: 185, h: 12 },
        { id: 'T7', y: 197, h: 12 },
        { id: 'T8', y: 209, h: 12 },
        { id: 'T9', y: 221, h: 12 },
        { id: 'T10', y: 233, h: 13 },
        { id: 'T11', y: 246, h: 13 },
        { id: 'T12', y: 259, h: 13 },
      ].map((seg) => (
        <React.Fragment key={`post-${seg.id}`}>
          {/* Left Posterior Thoracic (Viewer Left) */}
          <path
            d={`M 425 ${seg.y} L 465 ${seg.y + 2} L 465 ${seg.y + seg.h + 2} L 425 ${seg.y + seg.h} Z`}
            data-dermatome={seg.id}
            data-side="L"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'L')}
            aria-label={`좌측 ${seg.id} 등/후면 분절`}
            className="overlay-path"
          />
          {/* Right Posterior Thoracic (Viewer Right) */}
          <path
            d={`M 465 ${seg.y + 2} L 505 ${seg.y} L 505 ${seg.y + seg.h} L 465 ${seg.y + seg.h + 2} Z`}
            data-dermatome={seg.id}
            data-side="R"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected(seg.id as DermatomeId, 'R')}
            aria-label={`우측 ${seg.id} 등/후면 분절`}
            className="overlay-path"
          />
        </React.Fragment>
      ))}

      {/* L1 & L2 Lumbar Back */}
      <path
        d="M 425 272 L 465 274 L 465 292 L 425 290 Z"
        data-dermatome="L1"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'L')}
        aria-label="좌측 L1 요추 후면"
        className="overlay-path"
      />
      <path
        d="M 465 274 L 505 272 L 505 290 L 465 292 Z"
        data-dermatome="L1"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L1', 'R')}
        aria-label="우측 L1 요추 후면"
        className="overlay-path"
      />

      <path
        d="M 422 292 L 465 294 L 465 315 L 420 312 Z"
        data-dermatome="L2"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'L')}
        aria-label="좌측 L2 요추 하부"
        className="overlay-path"
      />
      <path
        d="M 465 294 L 508 292 L 510 312 L 465 315 Z"
        data-dermatome="L2"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('L2', 'R')}
        aria-label="우측 L2 요추 하부"
        className="overlay-path"
      />

      {/* S3 Gluteal / Buttocks */}
      <path
        d="M 420 315 L 465 318 L 460 365 L 415 355 Z"
        data-dermatome="S3"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S3', 'L')}
        aria-label="좌측 S3 둔부"
        className="overlay-path"
      />
      <path
        d="M 465 318 L 510 315 L 515 355 L 470 365 Z"
        data-dermatome="S3"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S3', 'R')}
        aria-label="우측 S3 둔부"
        className="overlay-path"
      />

      {/* S4 / S5 Perianal / Coccyx Saddle Rings */}
      <ellipse
        cx="462"
        cy="348"
        rx="5"
        ry="8"
        data-dermatome="S4"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S4', 'L')}
        aria-label="좌측 S4 회음부"
        className="overlay-path"
      />
      <ellipse
        cx="468"
        cy="348"
        rx="5"
        ry="8"
        data-dermatome="S4"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S4', 'R')}
        aria-label="우측 S4 회음부"
        className="overlay-path"
      />
      <circle
        cx="465"
        cy="353"
        r="4"
        data-dermatome="S5"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S5', 'L') || isSelected('S5', 'R')}
        aria-label="S5 항문주위"
        className="overlay-path"
      />

      {/* S2 Posterior Thigh Stripe */}
      <path
        d="M 435 365 L 465 365 L 460 470 L 440 470 Z"
        data-dermatome="S2"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S2', 'L')}
        aria-label="좌측 S2 대퇴 후면 중앙부"
        className="overlay-path"
      />
      <path
        d="M 465 365 L 495 365 L 490 470 L 470 470 Z"
        data-dermatome="S2"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S2', 'R')}
        aria-label="우측 S2 대퇴 후면 중앙부"
        className="overlay-path"
      />

      {/* S1 Posterior Calf, Achilles & Heel */}
      <path
        d="M 435 470 L 458 470 L 452 638 L 438 638 Z"
        data-dermatome="S1"
        data-side="L"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'L')}
        aria-label="좌측 S1 종아리 후면/발꿈치"
        className="overlay-path"
      />
      <path
        d="M 472 470 L 495 470 L 492 638 L 478 638 Z"
        data-dermatome="S1"
        data-side="R"
        role="button"
        tabIndex={0}
        aria-pressed={isSelected('S1', 'R')}
        aria-label="우측 S1 종아리 후면/발꿈치"
        className="overlay-path"
      />
    </svg>
  );
};
