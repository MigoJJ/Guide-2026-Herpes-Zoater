import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TreatmentPanel } from '../../features/treatment/TreatmentPanel';
import { useEncounterStore } from '../../store';

describe('TreatmentPanel component', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders standard medications and shows CrCl renal adjustments', () => {
    // Set CrCl to 38 in store
    useEncounterStore.getState().setCrcl(38);

    render(<TreatmentPanel />);

    // Medications requiring renal adjustment should show the badge
    const badges = screen.getAllByText(/CrCl 용량감량 권고/i);
    expect(badges.length).toBeGreaterThan(0);
    expect(screen.getByText(/1000mg BID 권장/i)).toBeInTheDocument();
  });

  it('enforces single antiviral selection (radio behavior)', () => {
    render(<TreatmentPanel />);
    const famvirRadio = screen.getByLabelText(/팜시클로버 250mg|팜비어 250mg/i);

    fireEvent.click(famvirRadio);
    expect(
      useEncounterStore.getState().treatments.some((t) => t.drugId === 'famvir_kr_250')
    ).toBe(true);
    expect(
      useEncounterStore.getState().treatments.some((t) => t.drugId === 'valacyclovir')
    ).toBe(false);
  });

  it('shows IV-to-oral step-down button when IV antiviral is selected', () => {
    render(<TreatmentPanel />);
    const acyclovirIvRadio = screen.getByLabelText(/아시클로버 주사|아시클로버 정맥주사/i);

    fireEvent.click(acyclovirIvRadio);
    expect(screen.getByRole('button', { name: /IV → 경구 전환/i })).toBeInTheDocument();

    // Click step down button
    const stepDownBtn = screen.getByRole('button', { name: /IV → 경구 전환/i });
    fireEvent.click(stepDownBtn);

    expect(
      useEncounterStore.getState().treatments.some((t) => t.drugId === 'valacyclovir')
    ).toBe(true);
    expect(
      useEncounterStore.getState().treatments.some((t) => t.drugId === 'acyclovir_iv')
    ).toBe(false);
  });

  it('displays safety alert banner when Tramadol and Gabapentinoid are both selected', () => {
    useEncounterStore.getState().toggleTreatment('tramadol_apap');
    useEncounterStore.getState().selectGabapentinoid('pregabalin');

    render(<TreatmentPanel />);

    expect(
      screen.getByText(/트라마돌 \+ 가바펜티노이드\(프레가발린\/가바펜틴\) FDA 2019 안전성 경고/i)
    ).toBeInTheDocument();
  });

  it('renders oral glucocorticoid section with clinical indication guide and allows selection', () => {
    render(<TreatmentPanel />);

    // Glucocorticoid section header and guide must exist
    expect(screen.getByText(/4\. 전신 스테로이드/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ramsay Hunt 증후군/i).length).toBeGreaterThan(0);

    const predCheck = screen.getByLabelText(/프레드니솔론/i);
    expect(predCheck).toBeInTheDocument();

    fireEvent.click(predCheck);
    expect(
      useEncounterStore.getState().treatments.some((t) => t.drugId === 'steroid_prednisolone')
    ).toBe(true);
  });
});
