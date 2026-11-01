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

  it('calculates Cockcroft-Gault CrCl when demographics are entered', () => {
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
});
