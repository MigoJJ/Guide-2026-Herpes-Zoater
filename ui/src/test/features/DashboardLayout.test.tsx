import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '../../app/DashboardLayout';
import { useEncounterStore } from '../../store';

describe('DashboardLayout integration', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders all 4 dashboard regions and header with CDS positioning', () => {
    render(<DashboardLayout />);

    expect(screen.getByText(/대상포진\(Herpes Zoster\) 근거공개형 임상결정지원\(CDS\)/i)).toBeInTheDocument();
    expect(screen.getByText(/최소 정보를 브라우저 안에서만 쓰고 아무것도 가져가지 않는/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /문진 및 병력 청취/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /피부분절 검진/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /처방 및 임상 경고/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /EMR 표준 진료기록/i })).toBeInTheDocument();
  });

  it('resets state when "새 환자 (초기화)" is confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    useEncounterStore.getState().toggleLesion('T4', 'R');
    useEncounterStore.getState().setPainNrs(9);

    render(<DashboardLayout />);

    const resetBtn = screen.getByRole('button', { name: /새 환자/i });
    fireEvent.click(resetBtn);

    expect(useEncounterStore.getState().lesions).toEqual([]);
    expect(useEncounterStore.getState().history.painNrs).toBeNull();
  });

  it('toggles non-device CDS regulatory positioning and editorial independence banner', () => {
    render(<DashboardLayout />);

    const infoBtn = screen.getByRole('button', { name: /CDS 근거 및 규제 안내/i });
    expect(infoBtn).toBeInTheDocument();

    // Click to open disclosure banner
    fireEvent.click(infoBtn);
    expect(screen.getByText(/21st Century Cures Act § 3060/i)).toBeInTheDocument();
    expect(screen.getByText(/독립성 및 이해상충\(COI\) 방지/i)).toBeInTheDocument();
    expect(screen.getByText(/성분명\(Generic\) 원칙/i)).toBeInTheDocument();

    // Click to close
    fireEvent.click(infoBtn);
    expect(screen.queryByText(/21st Century Cures Act § 3060/i)).not.toBeInTheDocument();
  });
});
