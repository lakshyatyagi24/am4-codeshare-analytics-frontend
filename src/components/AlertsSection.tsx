import React from 'react';
import AnomalyAlerts from './AnomalyAlerts';
import type { AnomalyAlert } from '../types';

interface AlertsSectionProps {
  alerts: AnomalyAlert[];
  onDismissAlert: (alertId: string) => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, onDismissAlert }) => (
  <div className="mt-8">
    <AnomalyAlerts alerts={alerts} onDismiss={onDismissAlert} />
  </div>
);
