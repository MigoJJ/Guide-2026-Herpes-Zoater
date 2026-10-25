import React from 'react';
import { DashboardLayout } from './app/DashboardLayout';
import { ErrorBoundary } from './shared/ui/ErrorBoundary';

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <DashboardLayout />
    </ErrorBoundary>
  );
}
