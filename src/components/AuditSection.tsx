import React from 'react';
import AuditLogWidget from './AuditLogWidget';
import type { AuditLog } from '../types';

interface AuditSectionProps {
  logs: AuditLog[];
}

export const AuditSection: React.FC<AuditSectionProps> = ({ logs }) => (
  <div className="mt-8">
    <AuditLogWidget logs={logs} />
  </div>
);
