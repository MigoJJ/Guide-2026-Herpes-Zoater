import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotePanel } from '../../features/note/NotePanel';
import { useEncounterStore } from '../../store';

describe('NotePanel component', () => {
  beforeEach(() => {
    useEncounterStore.getState().resetAll();
  });

  it('renders automatically generated note from store state', () => {
    useEncounterStore.getState().toggleLesion('T4', 'R');
    useEncounterStore.getState().setPainNrs(7);

    render(<NotePanel />);

    const textarea = screen.getByLabelText(/생성된 EMR 표준 진료기록/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('우측(Right) T4');
    expect(textarea.value).toContain('NRS 7/10');
  });

  it('switches to dirty/manual mode on manual edit and restores on reset', () => {
    render(<NotePanel />);
    const textarea = screen.getByLabelText(/생성된 EMR 표준 진료기록/i);

    fireEvent.change(textarea, { target: { value: '의사 수동 메모 작성됨' } });

    expect(screen.getByText(/의사 직접 수정 모드/i)).toBeInTheDocument();

    // Click reset to auto
    const resetBtn = screen.getByRole('button', { name: /자동 생성으로 초기화/i });
    fireEvent.click(resetBtn);

    expect(screen.queryByText(/의사 직접 수정 모드/i)).not.toBeInTheDocument();
  });

  it('copies note to clipboard and shows toast', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<NotePanel />);
    const copyBtn = screen.getByRole('button', { name: /EMR 복사/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText(/클립보드에 복사되었습니다/i)).toBeInTheDocument();
    });
  });
});
