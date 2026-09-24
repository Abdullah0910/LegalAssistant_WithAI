import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { DisclaimerBanner } from './components/DisclaimerBanner.js';
import { EmergencyModal } from './components/EmergencyModal.js';
import { LandingPage } from './components/LandingPage.js';
import { AssistantView } from './components/AssistantView.js';
import { DocumentAnalyzerView } from './components/DocumentAnalyzerView.js';
import { IssueClassifierView } from './components/IssueClassifierView.js';
import { ResourcesDirectoryView } from './components/ResourcesDirectoryView.js';
import { Scale, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'assistant' | 'analyzer' | 'intake' | 'resources'>('overview');
  const [jurisdiction, setJurisdiction] = useState<string>('India');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [selectedSampleDocId, setSelectedSampleDocId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>('Welcome to LegalEase AI. Public legal literacy and access platform.');

  // Announce tab changes to screen readers
  const handleTabChange = (tab: 'overview' | 'assistant' | 'analyzer' | 'intake' | 'resources') => {
    setActiveTab(tab);
    const tabLabels: Record<string, string> = {
      overview: 'Navigated to Overview and Home page.',
      assistant: 'Navigated to AI Legal Assistant chat.',
      analyzer: 'Navigated to Legal Document Analyzer.',
      intake: 'Navigated to Legal Issue Intake and Classifier.',
      resources: 'Navigated to Authoritative Legal Sources and Portals.',
    };
    setAnnouncement(tabLabels[tab] || `Switched to ${tab} view.`);
  };

  const handleJurisdictionChange = (newJurisdiction: string) => {
    setJurisdiction(newJurisdiction);
    setAnnouncement(`Active jurisdiction updated to ${newJurisdiction}. Statutory resources and analysis now reflect ${newJurisdiction} laws.`);
  };

  const handleSelectSampleDoc = (docId: string) => {
    setSelectedSampleDocId(docId);
    handleTabChange('analyzer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Invisible Screen Reader Announcement Live Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="sr-announcements"
      >
        {announcement}
      </div>

      {/* Persistent Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        jurisdiction={jurisdiction}
        setJurisdiction={handleJurisdictionChange}
        onOpenEmergency={() => {
          setEmergencyModalOpen(true);
          setAnnouncement('Opened crisis and emergency helplines dialog.');
        }}
      />

      {/* Emergency Hotline Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => {
          setEmergencyModalOpen(false);
          setAnnouncement('Closed emergency helplines dialog.');
        }}
        jurisdiction={jurisdiction}
      />

      {/* Dynamic View Mount */}
      <main className="flex-1" id="main-content">
        {activeTab === 'overview' && (
          <LandingPage
            onNavigate={(tab) => handleTabChange(tab)}
            onSelectSampleDoc={handleSelectSampleDoc}
            jurisdiction={jurisdiction}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantView
            jurisdiction={jurisdiction}
            onOpenEmergency={() => {
              setEmergencyModalOpen(true);
              setAnnouncement('Emergency distress dialog opened.');
            }}
          />
        )}

        {activeTab === 'analyzer' && (
          <DocumentAnalyzerView
            jurisdiction={jurisdiction}
            selectedSampleDocId={selectedSampleDocId}
            onAnnounce={(msg) => setAnnouncement(msg)}
          />
        )}

        {activeTab === 'intake' && (
          <IssueClassifierView jurisdiction={jurisdiction} />
        )}

        {activeTab === 'resources' && (
          <ResourcesDirectoryView jurisdiction={jurisdiction} />
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-amber-400">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">LegalEase AI</span>
            <span>· Public Legal Literacy & Access Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>Active Jurisdiction: {jurisdiction}</span>
            <span>·</span>
            <span>Zero Data Selling</span>
            <span>·</span>
            <span>In-Memory Safe Analysis</span>
            <span>·</span>
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="text-red-600 font-semibold hover:underline"
            >
              Emergency Helplines
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center sm:text-left">
          Notice: LegalEase AI outputs educational information, not legal counsel or statutory advice. The use of this software does not create an attorney-client relationship. If you are experiencing a crisis, contact emergency services.
        </div>
      </footer>
    </div>
  );
}
