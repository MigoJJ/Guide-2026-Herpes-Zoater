import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DermatomeMap } from '../../features/dermatome-map/DermatomeMap';
import { useEncounterStore } from '../../store';

describe('DermatomeMap component', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders all view tabs and switches views correctly', () => {
    render(<DermatomeMap />);

    expect(screen.getByRole('tab', { name: /전면/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /후면/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /안면/i })).toBeInTheDocument();

    // Default view is anterior
    expect(screen.getByRole('region', { name: /전면 피부분절 지도/i })).toBeInTheDocument();

    // Switch to Face view
    fireEvent.click(screen.getByRole('tab', { name: /안면/i }));
    expect(screen.getByRole('region', { name: /삼차신경/i })).toBeInTheDocument();

    // Switch to Posterior view
    fireEvent.click(screen.getByRole('tab', { name: /후면/i }));
    expect(screen.getByRole('region', { name: /후면 피부분절 지도/i })).toBeInTheDocument();
  });

  it('selects dermatome on clicking SVG path via event delegation', () => {
    const { container } = render(<DermatomeMap />);

    // In Anterior view, click on T4 Right rect
    const t4Right = container.querySelector('[data-dermatome="T4"][data-side="R"]');
    expect(t4Right).toBeInTheDocument();

    if (t4Right) {
      fireEvent.click(t4Right);
    }

    // Verify store has T4 R
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'R' }]);
    expect(t4Right?.getAttribute('aria-pressed')).toBe('true');
  });

  it('synchronizes auxiliary list buttons with store', () => {
    render(<DermatomeMap />);

    // Find the right button for T4 in the auxiliary list
    const buttons = screen.getAllByTitle('우측 선택');
    expect(buttons.length).toBeGreaterThan(0);

    const firstRightBtn = buttons[0];
    if (firstRightBtn) {
      fireEvent.click(firstRightBtn);
    }

    expect(useEncounterStore.getState().lesions.length).toBe(1);
  });

  it('filters auxiliary list based on search query', () => {
    render(<DermatomeMap />);

    const searchInput = screen.getByPlaceholderText(/분절 검색/i);
    fireEvent.change(searchInput, { target: { value: 'T4' } });

    // T4 text elements should exist
    const t4Elements = screen.getAllByText('T4');
    expect(t4Elements.length).toBeGreaterThan(0);
  });
});
