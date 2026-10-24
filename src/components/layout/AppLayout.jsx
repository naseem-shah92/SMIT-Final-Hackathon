import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AICopilotDrawer from '../ai/AICopilotDrawer';
import AddEmployeeModal from '../modals/AddEmployeeModal';
import SmartLeaveModal from '../modals/SmartLeaveModal';
import BiometricCheckinModal from '../modals/BiometricCheckinModal';
import { useApp } from '../../context/AppContext';

export default function AppLayout({ children }) {
  const { toggleAIChat, isAIOpen } = useApp();

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Clean Fixed Top Header */}
        <Header />

        {/* Viewport Content */}
        <main className="pt-16 flex-1 w-full bg-surface pb-16">
          {children}
        </main>
      </div>

      {/* FLOATING BOTTOM-RIGHT AI COPILOT BUTTON (Placed at the bottom as requested) */}
      {!isAIOpen && (
        <button
          onClick={toggleAIChat}
          className="fixed bottom-6 right-6 z-40 h-12 px-5 bg-secondary text-on-secondary hover:bg-secondary-container rounded-full shadow-2xl flex items-center gap-2.5 font-label-md text-label-md font-bold transition-all hover:scale-105 active:scale-95 border-2 border-surface-container-lowest"
          type="button"
          title="Open AI Copilot Assistant"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-ping"></span>
        </button>
      )}

      {/* Slide-over AI Copilot Assistant */}
      <AICopilotDrawer />

      {/* Modals */}
      <AddEmployeeModal />
      <SmartLeaveModal />
      <BiometricCheckinModal />
    </div>
  );
}
