import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '../../app/DashboardLayout';
import { useEncounterStore } from '../../store';

describe('DashboardLayout integration', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders all 4 dashboard regions and header', () => {
    render(<DashboardLayout />);

    expect(screen.getByText(/대상포진\(Herpes Zoster\) EMR 보조 시스템/i)).toBeInTheDocument();
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
});
