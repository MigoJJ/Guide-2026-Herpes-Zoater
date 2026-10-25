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

  it('updates pain score via slider', () => {
    render(<HistoryPanel />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '8' } });

    expect(useEncounterStore.getState().history.painNrs).toBe(8);
    expect(screen.getByText('8점')).toBeInTheDocument();
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
