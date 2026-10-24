import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminAuditPage() {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = auditLogs.filter(l =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1680px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Compliance &amp; Governance · Security Ledger
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Actor, Action, Entity, Before/After JSON
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              System Audit Trail
            </h1>
          </div>

          <div className="w-72 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit actions, actors..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:border-secondary focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2 Rule Banner */}
        <div className="p-4 rounded-xl bg-surface-container-high border border-surface-container text-xs text-on-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
            <span>
              <strong>Restricted Access:</strong> Audit logs are exclusively accessible to Administrators. Records are cryptographically signed and immutable.
            </span>
          </div>
          <span className="font-mono text-secondary font-bold text-[11px]">{auditLogs.length} Total Events Recorded</span>
        </div>

        {/* Audit Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Timestamp</th>
                  <th className="p-space-md">Actor</th>
                  <th className="p-space-md">Action Type</th>
                  <th className="p-space-md">Target Entity</th>
                  <th className="p-space-md">Human-Readable Details</th>
                  <th className="p-space-md text-right">State Diffs (JSON)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-container-low/50">
                    <td className="p-space-md font-mono text-outline whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-space-md font-bold text-on-surface">{log.actor}</td>
                    <td className="p-space-md">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-surface-container-high text-secondary border border-surface-container">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-space-md font-semibold text-on-surface-variant">{log.entity}</td>
                    <td className="p-space-md text-on-surface max-w-md">{log.details}</td>
                    <td className="p-space-md text-right">
                      <button
                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                        className="text-secondary hover:underline font-mono text-xs font-bold"
                      >
                        {selectedLog?.id === log.id ? 'Hide JSON ▲' : 'View JSON ▼'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Diff Inspector Drawer / Modal */}
        {selectedLog && (
          <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <h4 className="font-bold text-on-surface text-sm">
                Before / After JSON State Snapshot — #{selectedLog.id} ({selectedLog.action})
              </h4>
              <button onClick={() => setSelectedLog(null)} className="text-outline hover:text-on-surface text-xs font-bold">
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span className="font-bold text-error block mb-1">Before State JSON:</span>
                <pre className="text-[11px] overflow-x-auto text-on-surface-variant">
                  {selectedLog.before ? JSON.stringify(selectedLog.before, null, 2) : 'null (Created fresh)'}
                </pre>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span className="font-bold text-on-tertiary-container block mb-1">After State JSON:</span>
                <pre className="text-[11px] overflow-x-auto text-on-surface">
                  {selectedLog.after ? JSON.stringify(selectedLog.after, null, 2) : 'null (Deleted)'}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
