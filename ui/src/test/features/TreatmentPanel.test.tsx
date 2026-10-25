import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TreatmentPanel } from '../../features/treatment/TreatmentPanel';
import { useEncounterStore } from '../../store';

describe('TreatmentPanel component', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders standard medications and shows eGFR adjustments', () => {
    // Set eGFR to 35 in store
    useEncounterStore.getState().setEgfr(35);

    render(<TreatmentPanel />);

    // Medications requiring renal adjustment should show the badge
    const badges = screen.getAllByText(/eGFR 용량감량 권고/i);
    expect(badges.length).toBeGreaterThan(0);
    expect(screen.getByText(/1000\s?mg BID로 감량/i)).toBeInTheDocument();
  });

  it('toggles medication selection', () => {
    render(<TreatmentPanel />);
    const famciclovirCheck = screen.getByLabelText(/팜시클로버/i);

    fireEvent.click(famciclovirCheck);
    expect(
      useEncounterStore.getState().treatments.some((t) => t.drugId === 'famciclovir')
    ).toBe(true);
  });
});
