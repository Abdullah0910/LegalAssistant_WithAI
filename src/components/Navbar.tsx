import React, { useState } from 'react';
import { Scale, Globe, ShieldAlert, FileText, MessageSquareText, Compass, BookOpen, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'assistant' | 'analyzer' | 'intake' | 'resources';
  setActiveTab: (tab: 'overview' | 'assistant' | 'analyzer' | 'intake' | 'resources') => void;
  jurisdiction: string;
  setJurisdiction: (j: string) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  jurisdiction,
  setJurisdiction,
  onOpenEmergency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: 'overview' | 'assistant' | 'analyzer' | 'intake' | 'resources'; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'assistant', label: 'Legal Assistant', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'analyzer', label: 'Document Analyzer', icon: <FileText className="w-4 h-4" /> },
    { id: 'intake', label: 'Issue Intake', icon: <Scale className="w-4 h-4" /> },
    { id: 'resources', label: 'Official Resources', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg p-1"
              aria-label="LegalEase AI Home"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900">LegalEase AI</span>
                <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium border-l border-slate-200 pl-2">
                  Access & Literacy
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Jurisdiction Selector & Emergency Trigger */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="jurisdiction-select" className="sr-only">Jurisdiction</label>
              <select
                id="jurisdiction-select"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="India">Jurisdiction: India (Default)</option>
                <option value="United States">Jurisdiction: United States</option>
                <option value="United Kingdom">Jurisdiction: United Kingdom</option>
                <option value="Canada">Jurisdiction: Canada</option>
                <option value="International">Jurisdiction: International / Other</option>
              </select>
            </div>

            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
              title="Immediate Crisis & Emergency Helplines"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Helplines</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenEmergency}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              aria-label="Emergency Helplines"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="mb-3 pb-2 border-b border-slate-100">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Active Jurisdiction:</label>
            <select
              value={jurisdiction}
              onChange={(e) => {
                setJurisdiction(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full text-sm p-2 rounded-lg bg-slate-100 border border-slate-200 font-medium"
            >
              <option value="India">India (Default)</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="International">International / Other</option>
            </select>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
