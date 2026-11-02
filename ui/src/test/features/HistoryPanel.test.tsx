import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../../features/history/HistoryPanel';
import { useEncounterStore } from '../../store';

describe('HistoryPanel component', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('updates onset date when quick buttons are clicked', () => {
    render(<HistoryPanel />);
    const todayBtn = screen.getByRole('button', { name: '오늘' });
    fireEvent.click(todayBtn);

    const history = useEncounterStore.getState().history;
    expect(history.onsetDate).toBeTruthy();
  });

  it('calculates Cockcroft-Gault CrCl when demographics are entered and clears when sCr is cleared (Item 1 fix)', () => {
    render(<HistoryPanel />);

    const ageInput = screen.getByPlaceholderText('예: 75');
    const sexSelect = screen.getByRole('combobox');
    const weightInput = screen.getByPlaceholderText('예: 50');
    const crInput = screen.getByPlaceholderText('예: 1.0');

    fireEvent.change(ageInput, { target: { value: '75' } });
    fireEvent.change(sexSelect, { target: { value: 'F' } });
    fireEvent.change(weightInput, { target: { value: '50' } });
    fireEvent.change(crInput, { target: { value: '1.0' } });

    // Result box should appear showing CrCl ~ 38.4
    expect(screen.getByText(/CrCl:\s*38\.4\s*mL\/min/i)).toBeInTheDocument();
    expect(useEncounterStore.getState().history.crcl).toBe(38.4);

    // Item 1 test: Clear sCr -> CrCl must become null (not retained from previous value!)
    fireEvent.change(crInput, { target: { value: '' } });
    expect(useEncounterStore.getState().history.serumCreatinine).toBeNull();
    expect(useEncounterStore.getState().history.crcl).toBeNull();
  });

  it('preserves manually entered CrCl without silent overwrite and allows reset (Item 2 fix)', () => {
    render(<HistoryPanel />);

    // 1. Enter demographics
    const ageInput = screen.getByPlaceholderText('예: 75');
    const sexSelect = screen.getByRole('combobox');
    const weightInput = screen.getByPlaceholderText('예: 50');
    const crInput = screen.getByPlaceholderText('예: 1.0');

    fireEvent.change(ageInput, { target: { value: '75' } });
    fireEvent.change(sexSelect, { target: { value: 'F' } });
    fireEvent.change(weightInput, { target: { value: '50' } });
    fireEvent.change(crInput, { target: { value: '1.0' } });

    expect(useEncounterStore.getState().history.crcl).toBe(38.4);

    // 2. Doctor manually overrides CrCl to 45
    const manualCrclInput = screen.getByPlaceholderText('mL/min');
    fireEvent.change(manualCrclInput, { target: { value: '45' } });

    expect(useEncounterStore.getState().history.crcl).toBe(45);
    expect(useEncounterStore.getState().history.isCrclManual).toBe(true);
    expect(screen.getByText(/수동 입력됨/i)).toBeInTheDocument();

    // 3. Changing age or weight should NOT silently overwrite the manual CrCl!
    fireEvent.change(ageInput, { target: { value: '76' } });
    expect(useEncounterStore.getState().history.crcl).toBe(45);

    // 4. Click '자동 계산 복원' button to restore auto-calculated CrCl
    const resetBtn = screen.getByRole('button', { name: /자동 계산 복원/i });
    fireEvent.click(resetBtn);

    expect(useEncounterStore.getState().history.isCrclManual).toBe(false);
    // Recalculated for age 76, F, 50kg, 1.0 -> ~37.8
    expect(useEncounterStore.getState().history.crcl).toBe(37.8);
  });

  it('keeps the manual CrCl field empty while editing instead of refilling the auto value', () => {
    render(<HistoryPanel />);

    fireEvent.change(screen.getByPlaceholderText('예: 75'), { target: { value: '75' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'F' } });
    fireEvent.change(screen.getByPlaceholderText('예: 50'), { target: { value: '50' } });
    fireEvent.change(screen.getByPlaceholderText('예: 1.0'), { target: { value: '1.0' } });

    const manualCrclInput = screen.getByPlaceholderText('mL/min') as HTMLInputElement;
    fireEvent.change(manualCrclInput, { target: { value: '45' } });
    expect(useEncounterStore.getState().history.crcl).toBe(45);

    // Clearing mid-edit must not show 38.4 (typing would otherwise append to it)
    fireEvent.change(manualCrclInput, { target: { value: '' } });
    expect(manualCrclInput.value).toBe('');
    fireEvent.change(manualCrclInput, { target: { value: '30' } });
    expect(useEncounterStore.getState().history.crcl).toBe(30);
    expect(useEncounterStore.getState().history.isCrclManual).toBe(true);

    // Leaving the field empty falls back to the auto-computed value
    fireEvent.change(manualCrclInput, { target: { value: '' } });
    fireEvent.blur(manualCrclInput);
    expect(useEncounterStore.getState().history.isCrclManual).toBe(false);
    expect(useEncounterStore.getState().history.crcl).toBe(38.4);
    expect(manualCrclInput.value).toBe('38.4');
  });

  it('updates pain score via slider', () => {
    render(<HistoryPanel />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '8' } });

    expect(useEncounterStore.getState().history.painNrs).toBe(8);
    expect(screen.getByText('8점')).toBeInTheDocument();
  });

  it('toggles new vesicles emerging status', () => {
    render(<HistoryPanel />);
    const vesicleChip = screen.getByText(/새로운 수포가 계속 형성 중/i);
    fireEvent.click(vesicleChip);

    expect(useEncounterStore.getState().history.newVesiclesEmerging).toBe(true);
  });

  it('toggles red flag ocular and hutchinson signs', () => {
    render(<HistoryPanel />);
    const ocularChip = screen.getByText(/안구 증상/i);
    fireEvent.click(ocularChip);

    expect(useEncounterStore.getState().history.ocularSymptoms).toBe(true);

    const hutchinsonChip = screen.getByText(/허친슨 징후/i);
    fireEvent.click(hutchinsonChip);
    expect(useEncounterStore.getState().history.hutchinsonSign).toBe(true);
  });

  it('supports lb weight unit toggle with real-time kg conversion and displays calculation formula', () => {
    render(<HistoryPanel />);

    // Toggle to lb
    const lbBtn = screen.getByRole('button', { name: 'lb' });
    fireEvent.click(lbBtn);
    expect(useEncounterStore.getState().history.weightUnit).toBe('lb');

    // Type 110 lb
    const weightInput = screen.getByPlaceholderText('예: 110');
    fireEvent.change(weightInput, { target: { value: '110' } });

    // Should display converted kg
    expect(screen.getByText(/49\.9\s*kg\s*환산됨/i)).toBeInTheDocument();
    expect(useEncounterStore.getState().history.weightKg).toBe(49.9);

    // Enter age 75, sex F, sCr 1.0 to see formula
    fireEvent.change(screen.getByPlaceholderText('예: 75'), { target: { value: '75' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'F' } });
    fireEvent.change(screen.getByPlaceholderText('예: 1.0'), { target: { value: '1.0' } });

    // Formula code must be visible on screen for transparent non-device CDS inspection
    expect(screen.getByText(/계산 근거 수식:/i)).toBeInTheDocument();
    expect(screen.getByText(/\[\(140 - 75\) × 49\.9kg\]/i)).toBeInTheDocument();
  });

  it('displays warning when creatinine lab date is stale (> 30 days)', () => {
    render(<HistoryPanel />);

    const crDateInput = screen.getByTitle(/30일 초과 시 과거 수치 경고/i);
    fireEvent.change(crDateInput, { target: { value: '2026-08-01' } });

    expect(screen.getByText(/급성기 신기능 재확인 권장/i)).toBeInTheDocument();
  });
});
