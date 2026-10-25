import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI component:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '24px',
            margin: '24px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>오류가 발생하여 화면을 표시할 수 없습니다.</h3>
          <p style={{ fontSize: '13px', margin: '0 0 12px 0' }}>
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '6px 14px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            화면 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
