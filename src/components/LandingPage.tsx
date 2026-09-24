import React from 'react';
import {
  Scale,
  FileText,
  MessageSquareText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Building2,
  Users,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { DEMO_DOCUMENTS } from '../data/demoDocuments.js';

interface LandingPageProps {
  onNavigate: (tab: 'assistant' | 'analyzer' | 'intake' | 'resources') => void;
  onSelectSampleDoc: (docId: string) => void;
  jurisdiction: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectSampleDoc,
  jurisdiction,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Grounded in Official Legislation · Zero Hallucinated Citations</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 font-serif-legal">
          Understand the law. <br className="hidden sm:inline" />
          <span className="text-slate-800">Know your options.</span>
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered legal information that helps tenants, employees, consumers, and small businesses understand complex contracts, legal notices, and statutory rights in plain English.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('assistant')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <MessageSquareText className="w-4 h-4 text-amber-400" />
            <span>Ask a Legal Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('analyzer')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Analyze a Document</span>
          </button>

          <button
            onClick={() => onNavigate('intake')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <Scale className="w-4 h-4 text-slate-600" />
            <span>Classify My Issue</span>
          </button>
        </div>

        {/* Quiet Trust Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Active Jurisdiction: <strong>{jurisdiction}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Grounded in Government Portals
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-600" />
            No Document Storage / Confidential
          </span>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-legal">
            How LegalEase AI Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Translating opaque legalese into structured, verifiable next steps in three clear stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-serif-legal font-bold text-slate-300">01</span>
            <h3 className="text-base font-bold text-slate-900 mt-2">Submit Contract or Situation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Upload any PDF, Word (DOCX), or plain-text document, or ask about a dispute in conversational English.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-serif-legal font-bold text-slate-300">02</span>
            <h3 className="text-base font-bold text-slate-900 mt-2">AI Plain-English Translation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The engine identifies key clauses, critical deadlines, parties, mutual obligations, and red flags without inventing statutes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-serif-legal font-bold text-slate-300">03</span>
            <h3 className="text-base font-bold text-slate-900 mt-2">Actionable Checklist & Sources</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Receive a concrete evidence checklist, official regulatory links, notice templates, and sharp questions for your lawyer.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-legal">
            Comprehensive Legal Literacy Tools
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every feature designed specifically to demystify rights and level the playing field.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Legal Assistant</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Ask specific questions regarding tenancy notices, employment terminations, consumer warranties, or statutory provisions. Receives structured answers with Understanding, Legal Concepts, Next Steps, Documents to Collect, and Deadlines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Interactive Chat & Checklists</span>
              <button
                onClick={() => onNavigate('assistant')}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1"
              >
                <span>Launch Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Legal Document Analyzer</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Extracts contracts in PDF, DOCX, and TXT. Tags clauses with clear visual badges: "Payment Obligation", "Termination Clause", "Important Date", "Notice Requirement", and "Potentially Important Clause". Includes full document follow-up Q&A.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">PDF, DOCX & Text Extraction</span>
              <button
                onClick={() => onNavigate('analyzer')}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1"
              >
                <span>Analyze Contract</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Legal Issue Classifier & Intake</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Describe an issue in natural language. The intake engine classifies it across 12 legal categories (Employment, Rental, Consumer, Cybercrime, etc.), prompts for essential missing facts, and crafts a strategic resolution roadmap.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">12 Category Taxonomy & Intake</span>
              <button
                onClick={() => onNavigate('intake')}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1"
              >
                <span>Start Intake Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Authoritative Statutory Resources</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Connects directly to verified official repositories (India Code, e-Daakhil, NALSA Free Legal Aid, e-Courts, CFPB, HUD, and UK Legislation). Shows live verification dates and authentic statutory provisions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Curated Government Portals</span>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1"
              >
                <span>Browse Resources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DEMO SHOWCASE (1-CLICK TEST) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Instant Test Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-legal mt-1">
                  Try Realistic Synthetic Documents
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Test the document analyzer immediately without uploading personal files. Load these realistic synthetic agreements with one click:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl flex flex-col justify-between transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {doc.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 leading-snug">{doc.title}</h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">{doc.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectSampleDoc(doc.id);
                      onNavigate('analyzer');
                    }}
                    className="mt-4 w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Load & Analyze Sample</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEGAL INFORMATION VS. LEGAL ADVICE MATRIX */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-legal">
            General Legal Information vs. Professional Legal Advice
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            We hold a strict ethical duty to distinguish educational information from formal representation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Legal Information (What We Do) */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm">What LegalEase AI Delivers</h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Explaining contractual terminology, covenants, and clauses in plain English.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Identifying applicable public statutes and official government portals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Drafting evidence collection checklists and timeline preparation sheets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Suggesting questions to ask during a formal consultation with an advocate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Directing users to NALSA, Legal Aid clinics, and dispute redressal portals.</span>
                </li>
              </ul>
            </div>

            {/* Legal Advice (What You Need a Lawyer For) */}
            <div className="p-6 space-y-4 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm">What Requires a Licensed Lawyer</h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Applying subjective legal judgment to strategic trial tactics or litigation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Filing formal pleadings, affidavits, and court submissions under Vakalatnama.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Binding legal opinions guaranteeing outcome or court adjudication results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Creating attorney-client privilege protection for confidential admissions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>Representing clients in trials, cross-examinations, and oral arguments.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIVACY, SECURITY & RESPONSIBLE AI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 bg-slate-100 rounded-3xl border border-slate-200">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Security & Ethics</span>
            <h2 className="text-2xl font-bold text-slate-900 font-serif-legal mt-1">
              Built for Trust, Security & Privacy
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              Legal documents contain sensitive data. We implement strict defense-in-depth principles:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-slate-900 mb-2" />
              <h4 className="text-xs font-bold text-slate-900">Zero Document Logging</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Uploaded document text is processed purely in transient memory and never written to permanent disk or logged.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <Lock className="w-5 h-5 text-slate-900 mb-2" />
              <h4 className="text-xs font-bold text-slate-900">Prompt Injection Shield</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Untrusted document content is isolated in safe demarcation tags and sanitized against adversarial instructions.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-slate-900 mb-2" />
              <h4 className="text-xs font-bold text-slate-900">Zero Hallucinations Policy</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                The model is barred from inventing statutes, sections, citations, or fake government portals.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <AlertTriangle className="w-5 h-5 text-slate-900 mb-2" />
              <h4 className="text-xs font-bold text-slate-900">Emergency Safeguards</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Keywords indicating domestic abuse, violence, or immediate danger trigger prominent real-world helplines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
