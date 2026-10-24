import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function HRLeavePage() {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useApp();
  const [commentInput, setCommentInput] = useState({});

  const handleApprove = (id) => {
    const comment = commentInput[id] || 'Approved by HR Operations.';
    approveLeaveRequest(id, comment);
  };

  const handleReject = (id) => {
    const comment = commentInput[id] || 'Rejected due to department schedule conflict.';
    rejectLeaveRequest(id, comment);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1280px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Time-Off Operations · Absence Management
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Leave Approvals &amp; Quota Deductions
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Leave Approval Inbox &amp; Quota Deductions
            </h1>
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-surface-container text-secondary font-label-md text-label-md font-bold shadow-xs">
            {leaveRequests.filter(l => l.status === 'Pending').length} Pending Review
          </span>
        </div>

        {/* Leave Requests Queue */}
        <div className="space-y-4">
          {leaveRequests.map(req => (
            <div key={req.id} className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                    {req.name.split(' ').map(n=>n[0]).join('')}
                  </span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{req.name}</h3>
                    <div className="text-xs text-on-surface-variant">{req.dept} · #{req.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface font-bold text-xs font-data-tabular">
                    {req.type} Leave
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                    req.status === 'Approved'
                      ? 'bg-surface-container text-on-tertiary-container'
                      : req.status === 'Rejected'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container-high text-secondary'
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Details & Working Days */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-surface-container-low p-3.5 rounded-lg">
                <div>
                  <span className="text-outline block font-medium">Leave Window</span>
                  <strong className="text-on-surface font-data-tabular">{req.startDate} to {req.endDate}</strong>
                </div>
                <div>
                  <span className="text-outline block font-medium">Deducted Working Days</span>
                  <strong className="text-secondary font-data-tabular">{req.workingDays} Days (Skips Sat/Sun)</strong>
                </div>
                <div>
                  <span className="text-outline block font-medium">Reason Stated</span>
                  <span className="text-on-surface">"{req.reason}"</span>
                </div>
              </div>

              {/* HR Comment & Actions */}
              {req.status === 'Pending' ? (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter HR approval or rejection comment..."
                    value={commentInput[req.id] || ''}
                    onChange={e => setCommentInput({ ...commentInput, [req.id]: e.target.value })}
                    className="flex-1 h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:border-secondary focus:outline-none"
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="h-9 px-4 bg-on-tertiary-container text-on-tertiary hover:opacity-95 rounded-lg font-bold text-xs shadow-xs flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Approve with Comment</span>
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="h-9 px-3 bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface rounded-lg font-bold text-xs transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-on-surface-variant flex items-center gap-2 pt-1 border-t border-surface-container">
                  <span className="material-symbols-outlined text-secondary text-[16px]">comment</span>
                  <span><strong>HR Comment:</strong> {req.hrComment || 'Processed'}</span>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
