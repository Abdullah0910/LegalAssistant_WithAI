import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';
import { api } from '../services/api.js';
import { LegalSource } from '../../server/services/legalSources.js';

interface ResourcesDirectoryViewProps {
  jurisdiction: string;
}

export const ResourcesDirectoryView: React.FC<ResourcesDirectoryViewProps> = ({ jurisdiction }) => {
  const [sources, setSources] = useState<LegalSource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'All',
    'Consumer',
    'Rental / Housing',
    'Employment',
    'Legal Aid',
    'General / Legislation',
    'Cybercrime',
    'Civil / Criminal',
  ];

  useEffect(() => {
    loadResources();
  }, [jurisdiction, selectedCategory]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const res = await api.getResources(jurisdiction, selectedCategory);
      setSources(res.sources || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.relevantProvision && s.relevantProvision.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 font-serif-legal">
          Authoritative Legal Sources & Portals
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Curated directory of official government databases, courts, dispute commissions, and statutory free legal aid authorities for {jurisdiction}.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Categories segmented buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search statutes, courts, or portals..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-xs"
          />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {source.authorityType}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Verified: {source.lastVerifiedDate}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{source.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{source.description}</p>
              </div>

              {source.relevantProvision && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-900 font-semibold">Key Statutory Provision:</strong>{' '}
                  {source.relevantProvision}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{source.jurisdiction}</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSources.length === 0 && !isLoading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          No resources found matching your current filter. Try selecting "All" categories or adjusting your search.
        </div>
      )}
    </div>
  );
};
