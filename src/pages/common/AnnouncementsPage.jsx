import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AnnouncementsPage() {
  const { announcements, postAnnouncement, notifications, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isPoster = currentUser?.role === 'admin' || currentUser?.role === 'hr';

  const handlePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    postAnnouncement(title, content);
    setTitle('');
    setContent('');
    alert('Announcement published to all dashboards!');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1280px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Internal Communications · Company Feed
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Bulletins &amp; Alerts
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Announcements &amp; In-App Notifications
            </h1>
          </div>
        </div>

        {/* Post Announcement Form (Admin & HR only) */}
        {isPoster && (
          <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">campaign</span>
              Post Company Announcement (Admin &amp; HR)
            </h3>

            <form onSubmit={handlePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant mb-1 font-semibold">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office holiday announcement or policy update..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-semibold">Message Content</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Write message details..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface border border-outline-variant text-on-surface focus:border-secondary focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="h-9 px-5 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-bold shadow-xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements Stream */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">feed</span>
            Published Company Bulletins
          </h3>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-xl bg-surface-container-low border border-surface-container text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-sm">{ann.title}</span>
                  <span className="text-outline text-[11px] font-data-tabular">{ann.date}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">{ann.content}</p>
                <div className="text-[11px] text-secondary font-semibold pt-1">
                  Posted by: {ann.postedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-app Notifications (Checklist #24) */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">notifications</span>
            In-App Notifications (Leave Decisions &amp; Payslips)
          </h3>

          <div className="space-y-2 text-xs">
            {notifications.map(notif => (
              <div key={notif.id} className="p-3 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div>
                  <div className="font-bold text-on-surface">{notif.title}</div>
                  <div className="text-on-surface-variant text-[11px]">{notif.body}</div>
                </div>
                <span className="text-[10px] text-outline font-data-tabular">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
