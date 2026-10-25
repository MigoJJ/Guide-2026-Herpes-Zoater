import type { DermatomeId, DermatomeMetadata } from './types';

export const DERMATOMES: Record<DermatomeId, DermatomeMetadata> = {
  // Cranial Nerves (Trigeminal V1-V3)
  V1: {
    id: 'V1',
    nerve: 'CN V1 (Ophthalmic)',
    labelKo: '삼차신경 제1지 (안분지)',
    labelEn: 'Trigeminal V1 (Ophthalmic)',
    region: 'cranial',
    landmarks: '이마, 상안검, 코끝 (Hutchinson 징후 확인 부위)',
  },
  V2: {
    id: 'V2',
    nerve: 'CN V2 (Maxillary)',
    labelKo: '삼차신경 제2지 (상악분지)',
    labelEn: 'Trigeminal V2 (Maxillary)',
    region: 'cranial',
    landmarks: '뺨, 하안검, 상순, 콧날개',
  },
  V3: {
    id: 'V3',
    nerve: 'CN V3 (Mandibular)',
    labelKo: '삼차신경 제3지 (하악분지)',
    labelEn: 'Trigeminal V3 (Mandibular)',
    region: 'cranial',
    landmarks: '턱, 하순, 외이도 앞쪽',
  },

  // Cervical (C2 - C8)
  C2: {
    id: 'C2',
    nerve: 'Cervical 2',
    labelKo: '경추 2번 (C2)',
    labelEn: 'Cervical C2',
    region: 'cervical',
    landmarks: '후두부, 후두융기 최소 1cm 외측',
  },
  C3: {
    id: 'C3',
    nerve: 'Cervical 3',
    labelKo: '경추 3번 (C3)',
    labelEn: 'Cervical C3',
    region: 'cervical',
    landmarks: '쇄골상와 (Supraclavicular fossa)',
  },
  C4: {
    id: 'C4',
    nerve: 'Cervical 4',
    labelKo: '경추 4번 (C4)',
    labelEn: 'Cervical C4',
    region: 'cervical',
    landmarks: '견봉쇄골관절 상부, 목 기저부',
  },
  C5: {
    id: 'C5',
    nerve: 'Cervical 5',
    labelKo: '경추 5번 (C5)',
    labelEn: 'Cervical C5',
    region: 'cervical',
    landmarks: '상완 외측 (삼각근 부위, 주와 외측)',
  },
  C6: {
    id: 'C6',
    nerve: 'Cervical 6',
    labelKo: '경추 6번 (C6)',
    labelEn: 'Cervical C6',
    region: 'cervical',
    landmarks: '전완 외측, 무지(엄지손가락) 등쪽',
  },
  C7: {
    id: 'C7',
    nerve: 'Cervical 7',
    labelKo: '경추 7번 (C7)',
    labelEn: 'Cervical C7',
    region: 'cervical',
    landmarks: '중지(가운데손가락) 등쪽',
  },
  C8: {
    id: 'C8',
    nerve: 'Cervical 8',
    labelKo: '경추 8번 (C8)',
    labelEn: 'Cervical C8',
    region: 'cervical',
    landmarks: '소지(새끼손가락), 손목 내측',
  },

  // Thoracic (T1 - T12)
  T1: {
    id: 'T1',
    nerve: 'Thoracic 1',
    labelKo: '흉추 1번 (T1)',
    labelEn: 'Thoracic T1',
    region: 'thoracic',
    landmarks: '전완 내측, 주관절 바로 몸쪽',
  },
  T2: {
    id: 'T2',
    nerve: 'Thoracic 2',
    labelKo: '흉추 2번 (T2)',
    labelEn: 'Thoracic T2',
    region: 'thoracic',
    landmarks: '액와 첨부, 상흉부 쇄골 바로 아래',
  },
  T3: {
    id: 'T3',
    nerve: 'Thoracic 3',
    labelKo: '흉추 3번 (T3)',
    labelEn: 'Thoracic T3',
    region: 'thoracic',
    landmarks: '제3 늑간, 쇄골중간선',
  },
  T4: {
    id: 'T4',
    nerve: 'Thoracic 4',
    labelKo: '흉추 4번 (T4)',
    labelEn: 'Thoracic T4',
    region: 'thoracic',
    landmarks: '제4 늑간, 유두(Nipple) 높이',
  },
  T5: {
    id: 'T5',
    nerve: 'Thoracic 5',
    labelKo: '흉추 5번 (T5)',
    labelEn: 'Thoracic T5',
    region: 'thoracic',
    landmarks: '제5 늑간, 유두와 검상돌기 중간',
  },
  T6: {
    id: 'T6',
    nerve: 'Thoracic 6',
    labelKo: '흉추 6번 (T6)',
    labelEn: 'Thoracic T6',
    region: 'thoracic',
    landmarks: '검상돌기(Xiphoid process) 높이',
  },
  T7: {
    id: 'T7',
    nerve: 'Thoracic 7',
    labelKo: '흉추 7번 (T7)',
    labelEn: 'Thoracic T7',
    region: 'thoracic',
    landmarks: '검상돌기와 배꼽 사이 상부 1/4',
  },
  T8: {
    id: 'T8',
    nerve: 'Thoracic 8',
    labelKo: '흉추 8번 (T8)',
    labelEn: 'Thoracic T8',
    region: 'thoracic',
    landmarks: '검상돌기와 배꼽 중간',
  },
  T9: {
    id: 'T9',
    nerve: 'Thoracic 9',
    labelKo: '흉추 9번 (T9)',
    labelEn: 'Thoracic T9',
    region: 'thoracic',
    landmarks: '검상돌기와 배꼽 사이 하부 1/4',
  },
  T10: {
    id: 'T10',
    nerve: 'Thoracic 10',
    labelKo: '흉추 10번 (T10)',
    labelEn: 'Thoracic T10',
    region: 'thoracic',
    landmarks: '배꼽(Umbilicus) 높이',
  },
  T11: {
    id: 'T11',
    nerve: 'Thoracic 11',
    labelKo: '흉추 11번 (T11)',
    labelEn: 'Thoracic T11',
    region: 'thoracic',
    landmarks: '배꼽과 서혜인대 중간',
  },
  T12: {
    id: 'T12',
    nerve: 'Thoracic 12',
    labelKo: '흉추 12번 (T12)',
    labelEn: 'Thoracic T12',
    region: 'thoracic',
    landmarks: '서혜인대(Inguinal ligament) 중앙 부위',
  },

  // Lumbar (L1 - L5)
  L1: {
    id: 'L1',
    nerve: 'Lumbar 1',
    labelKo: '요추 1번 (L1)',
    labelEn: 'Lumbar L1',
    region: 'lumbar',
    landmarks: '서혜인대 바로 아래, 대퇴부 상부 내측',
  },
  L2: {
    id: 'L2',
    nerve: 'Lumbar 2',
    labelKo: '요추 2번 (L2)',
    labelEn: 'Lumbar L2',
    region: 'lumbar',
    landmarks: '대퇴부 전내측 중간 부위',
  },
  L3: {
    id: 'L3',
    nerve: 'Lumbar 3',
    labelKo: '요추 3번 (L3)',
    labelEn: 'Lumbar L3',
    region: 'lumbar',
    landmarks: '대퇴골 내측상과, 무릎 내측',
  },
  L4: {
    id: 'L4',
    nerve: 'Lumbar 4',
    labelKo: '요추 4번 (L4)',
    labelEn: 'Lumbar L4',
    region: 'lumbar',
    landmarks: '내측 복사뼈(Medial malleolus), 하퇴 전내측',
  },
  L5: {
    id: 'L5',
    nerve: 'Lumbar 5',
    labelKo: '요추 5번 (L5)',
    labelEn: 'Lumbar L5',
    region: 'lumbar',
    landmarks: '발등(Dorsum of foot), 1-3번째 족지',
  },

  // Sacral (S1 - S5)
  S1: {
    id: 'S1',
    nerve: 'Sacral 1',
    labelKo: '천추 1번 (S1)',
    labelEn: 'Sacral S1',
    region: 'sacral',
    landmarks: '외측 복사뼈, 발꿈치 외측, 5번째 족지',
  },
  S2: {
    id: 'S2',
    nerve: 'Sacral 2',
    labelKo: '천추 2번 (S2)',
    labelEn: 'Sacral S2',
    region: 'sacral',
    landmarks: '오금(Popliteal fossa) 중앙, 대퇴 후면',
  },
  S3: {
    id: 'S3',
    nerve: 'Sacral 3',
    labelKo: '천추 3번 (S3)',
    labelEn: 'Sacral S3',
    region: 'sacral',
    landmarks: '좌골결절(Ischial tuberosity), 둔부 내측',
  },
  S4: {
    id: 'S4',
    nerve: 'Sacral 4',
    labelKo: '천추 4번 (S4)',
    labelEn: 'Sacral S4',
    region: 'sacral',
    landmarks: '회음부(Perineal area)',
  },
  S5: {
    id: 'S5',
    nerve: 'Sacral 5',
    labelKo: '천추 5번 (S5)',
    labelEn: 'Sacral S5',
    region: 'sacral',
    landmarks: '항문주위(Perianal area)',
  },
};

export const ALL_DERMATOME_IDS = Object.keys(DERMATOMES) as DermatomeId[];

export function getDermatome(id: DermatomeId): DermatomeMetadata {
  const meta = DERMATOMES[id];
  return meta;
}

export function getDermatomesByRegion(
  region: 'cranial' | 'cervical' | 'thoracic' | 'lumbar' | 'sacral'
): DermatomeMetadata[] {
  return ALL_DERMATOME_IDS.map((id) => DERMATOMES[id]).filter((meta) => meta.region === region);
}
