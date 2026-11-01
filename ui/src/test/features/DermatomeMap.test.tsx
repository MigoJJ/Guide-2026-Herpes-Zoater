import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DermatomeMap } from '../../features/dermatome-map/DermatomeMap';
import { useEncounterStore } from '../../store';

describe('DermatomeMap component with Clinical Illustration Overlay', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders all view tabs and switches views correctly', () => {
    render(<DermatomeMap />);

    expect(screen.getByRole('tab', { name: /전체 뷰/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /전면/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /후면/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /안면/i })).toBeInTheDocument();

    // Default view shows the clinical illustration map
    const mapRegion = screen.getByRole('region', { name: /임상 피부분절 일러스트 지도/i });
    expect(mapRegion).toBeInTheDocument();
    expect(mapRegion.getAttribute('viewBox')).toBe('0 0 618 650');

    // Switch to Anterior Focus
    fireEvent.click(screen.getByRole('tab', { name: /전면/i }));
    expect(mapRegion.getAttribute('viewBox')).toBe('0 0 318 650');

    // Switch to Posterior Focus
    fireEvent.click(screen.getByRole('tab', { name: /후면/i }));
    expect(mapRegion.getAttribute('viewBox')).toBe('300 0 318 650');

    // Switch to Face Focus
    fireEvent.click(screen.getByRole('tab', { name: /안면/i }));
    expect(mapRegion.getAttribute('viewBox')).toBe('0 0 618 200');
  });

  it('selects dermatome on clicking overlay path via event delegation', () => {
    const { container } = render(<DermatomeMap />);

    // Click on T4 Right path overlay
    const t4Right = container.querySelector('[data-dermatome="T4"][data-side="R"]');
    expect(t4Right).toBeInTheDocument();

    if (t4Right) {
      fireEvent.click(t4Right);
    }

    // Verify store has T4 R
    expect(useEncounterStore.getState().lesions).toEqual([{ dermatome: 'T4', side: 'R' }]);
    expect(t4Right?.getAttribute('aria-pressed')).toBe('true');
  });

  it('synchronizes auxiliary list buttons with store and overlay', () => {
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

  it('filters auxiliary list based on quick region chips', () => {
    render(<DermatomeMap />);

    // Click on '천추' region chip
    const sacralChip = screen.getByRole('button', { name: '천추' });
    fireEvent.click(sacralChip);

    // Should display Sacral section
    expect(screen.getByText(/천추 분절/i)).toBeInTheDocument();
    expect(screen.getByText('S1')).toBeInTheDocument();
    expect(screen.getByText('S5')).toBeInTheDocument();

    // Cervical should be hidden
    expect(screen.queryByText(/경추 분절/i)).not.toBeInTheDocument();
  });

  it('collapses and expands accordion sections', () => {
    render(<DermatomeMap />);

    // Click on '천추 분절' header to collapse
    const sacralHeader = screen.getByText(/천추 분절/i);
    fireEvent.click(sacralHeader);

    // S1 card should be hidden when collapsed
    expect(screen.queryByText('외측 복사뼈, 발꿈치 외측, 5번째 족지')).not.toBeInTheDocument();

    // Click '모두 펼치기' button
    const expandAllBtn = screen.getByRole('button', { name: /모두 펼치기/i });
    fireEvent.click(expandAllBtn);

    // S1 card should reappear
    expect(screen.getByText('외측 복사뼈, 발꿈치 외측, 5번째 족지')).toBeInTheDocument();
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
