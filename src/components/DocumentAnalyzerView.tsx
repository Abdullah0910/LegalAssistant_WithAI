import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  Calendar,
  Users,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Copy,
  Search,
  BookOpen,
  ArrowRight,
  Send,
  FileCode,
  Tag,
} from 'lucide-react';
import { api, DocumentAnalysisResult } from '../services/api.js';
import { DEMO_DOCUMENTS, DemoDocument } from '../data/demoDocuments.js';

interface DocumentAnalyzerViewProps {
  jurisdiction: string;
  selectedSampleDocId?: string | null;
  onAnnounce?: (message: string) => void;
}

export const DocumentAnalyzerView: React.FC<DocumentAnalyzerViewProps> = ({
  jurisdiction,
  selectedSampleDocId,
  onAnnounce,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'clauses' | 'dates' | 'obligations' | 'risks' | 'questions' | 'qa'>('clauses');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [documentText, setDocumentText] = useState('');
  const [filename, setFilename] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Document Q&A State
  const [qaInput, setQaInput] = useState('');
  const [isQaLoading, setIsQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; answer: string; excerpts: string[] }>>([]);

  // Search filter inside document text
  const [searchTerm, setSearchTerm] = useState('');

  // Handle passed sample doc ID
  useEffect(() => {
    if (selectedSampleDocId) {
      const doc = DEMO_DOCUMENTS.find((d) => d.id === selectedSampleDocId);
      if (doc) {
        loadDemoDocument(doc);
      }
    }
  }, [selectedSampleDocId]);

  const loadDemoDocument = async (doc: DemoDocument) => {
    setFilename(doc.title + '.txt');
    setDocumentText(doc.content);
    setAnalysisError(null);
    setIsAnalyzing(true);
    onAnnounce?.(`Started analyzing document: ${doc.title}`);
    try {
      const res = await api.analyzeDocument({
        filename: doc.title + '.txt',
        text: doc.content,
        jurisdiction,
      });
      setAnalysisResult(res);
      setQaHistory([]);
      onAnnounce?.(`Document analysis complete for ${doc.title}. Summary, ${res.analysis.keyClauses.length} clauses, and critical dates are ready.`);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to analyze demo document.';
      setAnalysisError(errMsg);
      onAnnounce?.(`Error analyzing document: ${errMsg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    setAnalysisError(null);
    setIsAnalyzing(true);
    onAnnounce?.(`Uploaded file ${file.name}. Reading content and starting legal analysis.`);

    try {
      const reader = new FileReader();
      const isText = file.type === 'text/plain' || file.name.endsWith('.txt');

      if (isText) {
        reader.onload = async (event) => {
          const text = event.target?.result as string;
          setDocumentText(text);
          try {
            const res = await api.analyzeDocument({
              filename: file.name,
              text,
              mimeType: 'text/plain',
              jurisdiction,
            });
            setAnalysisResult(res);
            setQaHistory([]);
            onAnnounce?.(`Document analysis complete for ${file.name}. ${res.analysis.keyClauses.length} clauses categorized.`);
          } catch (err: any) {
            const msg = err.message || 'Analysis failed.';
            setAnalysisError(msg);
            onAnnounce?.(`Error analyzing document: ${msg}`);
          } finally {
            setIsAnalyzing(false);
          }
        };
        reader.readAsText(file);
      } else {
        // Read as base64 data for PDF or DOCX
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          const base64Data = dataUrl.split(',')[1];
          try {
            const res = await api.analyzeDocument({
              filename: file.name,
              base64Data,
              mimeType: file.type || 'application/octet-stream',
              jurisdiction,
            });
            setAnalysisResult(res);
            setDocumentText(res.document.previewText);
            setQaHistory([]);
            onAnnounce?.(`Document analysis complete for ${file.name}. ${res.analysis.keyClauses.length} clauses categorized.`);
          } catch (err: any) {
            const msg = err.message || 'Analysis failed.';
            setAnalysisError(msg);
            onAnnounce?.(`Error analyzing document: ${msg}`);
          } finally {
            setIsAnalyzing(false);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      const msg = 'Error reading uploaded file: ' + err.message;
      setAnalysisError(msg);
      onAnnounce?.(msg);
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || isQaLoading || !documentText) return;

    const q = qaInput.trim();
    setQaInput('');
    setIsQaLoading(true);

    try {
      const res = await api.askDocumentQA(documentText, q, jurisdiction);
      setQaHistory((prev) => [
        ...prev,
        {
          question: q,
          answer: res.answer,
          excerpts: res.relevantExcerpts || [],
        },
      ]);
    } catch (err: any) {
      setQaHistory((prev) => [
        ...prev,
        {
          question: q,
          answer: 'Unable to process document inquiry: ' + (err.message || 'Unknown error'),
          excerpts: [],
        },
      ]);
    } finally {
      setIsQaLoading(false);
    }
  };

  const getClauseBadgeStyle = (label: string) => {
    switch (label) {
      case 'Important Date':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Payment Obligation':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Termination Clause':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Notice Requirement':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Potentially Important Clause':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Dispute Resolution':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Liability / Indemnity':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-legal">Legal Document Analyzer</h1>
          <p className="text-xs text-slate-600 mt-1">
            Plain-English summaries, clause categorization, obligation breakdown, and grounded document Q&A.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Supported: <strong>PDF, DOCX, TXT</strong> (Max 10MB)
        </div>
      </div>

      {/* Upload Zone & Demo Loaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors text-center relative flex flex-col items-center justify-center min-h-[180px]">
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileUpload}
            disabled={isAnalyzing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload legal document"
          />
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-900">
            {filename ? `Current: ${filename}` : 'Drag & drop your contract or notice here'}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Click to browse files (PDF, DOCX, TXT). Analyzed in-memory with strict privacy guarantees.
          </p>
        </div>

        {/* 1-Click Demo Documents */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Or Try a Synthetic Sample:
            </span>
            <div className="mt-2.5 space-y-2">
              {DEMO_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => loadDemoDocument(doc)}
                  disabled={isAnalyzing}
                  className="w-full text-left p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 truncate pr-2">{doc.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 block">
            Safe synthetic cases — no personal data included.
          </span>
        </div>
      </div>

      {/* Loading Indicator */}
      {isAnalyzing && (
        <div
          role="status"
          aria-live="polite"
          className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-900" />
          <h3 className="text-sm font-bold text-slate-900">Analyzing Document & Extracting Covenants</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Extracting text, categorizing termination and payment clauses, verifying notice requirements, and identifying potential risks...
          </p>
        </div>
      )}

      {/* Error Message */}
      {analysisError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Analysis Error:</strong> {analysisError}
          </div>
        </div>
      )}

      {/* Main Analysis Display */}
      {analysisResult && !isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Document Preview (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                    {analysisResult.document.filename}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {analysisResult.document.wordCount} words
                </span>
              </div>

              {/* In-text search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter document text..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Document Text Box */}
              <div className="h-[460px] overflow-y-auto bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 font-mono text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap selection:bg-slate-300">
                {documentText}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Safe untrusted text container</span>
                <button
                  onClick={() => navigator.clipboard.writeText(documentText)}
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Structured Analysis Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Plain-English Executive Summary */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Plain-English Summary
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {analysisResult.analysis.documentType} · {analysisResult.analysis.governingLaw}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {analysisResult.analysis.summary}
              </p>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveSubTab('clauses')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'clauses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Key Clauses ({analysisResult.analysis.keyClauses.length})
              </button>
              <button
                onClick={() => setActiveSubTab('dates')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'dates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dates & Deadlines
              </button>
              <button
                onClick={() => setActiveSubTab('obligations')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'obligations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mutual Obligations
              </button>
              <button
                onClick={() => setActiveSubTab('risks')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'risks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Risks & Red Flags
              </button>
              <button
                onClick={() => setActiveSubTab('questions')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'questions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Questions for Lawyer
              </button>
              <button
                onClick={() => setActiveSubTab('qa')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                  activeSubTab === 'qa' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Ask Document</span>
              </button>
            </div>

            {/* TAB 1: KEY CLAUSES */}
            {activeSubTab === 'clauses' && (
              <div className="space-y-3">
                {analysisResult.analysis.keyClauses.map((clause, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{clause.clauseTitle}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getClauseBadgeStyle(clause.label)}`}>
                        {clause.label}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border-l-2 border-slate-400">
                      "{clause.originalSnippet}"
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 font-semibold">Plain-English Meaning:</strong> {clause.plainEnglishMeaning}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: CRITICAL DATES */}
            {activeSubTab === 'dates' && (
              <div className="space-y-3">
                {analysisResult.analysis.importantDates.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">{item.dateOrTimeframe}</h4>
                      <p className="text-xs text-slate-700">
                        <strong>Milestone:</strong> {item.obligationOrMilestone}
                      </p>
                      <p className="text-xs text-red-700">
                        <strong>Consequence of Default:</strong> {item.consequenceOfMissing}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: MUTUAL OBLIGATIONS & PARTIES */}
            {activeSubTab === 'obligations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.analysis.parties.map((p, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{p.role}</span>
                      <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc list-inside">
                        {p.primaryObligations.map((ob, obIdx) => (
                          <li key={obIdx}>{ob}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bilateral Obligation Matrix
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h5 className="text-xs font-bold text-slate-900 mb-1.5">Your Obligations:</h5>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        {analysisResult.analysis.mutualObligations.userObligations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h5 className="text-xs font-bold text-slate-900 mb-1.5">Counterparty's Obligations:</h5>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        {analysisResult.analysis.mutualObligations.counterpartyObligations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RISKS & RED FLAGS */}
            {activeSubTab === 'risks' && (
              <div className="space-y-3">
                {analysisResult.analysis.risksAndAttentionPoints.map((risk, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-bold text-slate-900">{risk.riskTitle}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        risk.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {risk.severity} Severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>
                    <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200">
                      <strong>Mitigation Tip:</strong> {risk.mitigationTip}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: QUESTIONS FOR LAWYER */}
            {activeSubTab === 'questions' && (
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>5 High-Value Questions to Bring to Your Lawyer</span>
                </div>
                <p className="text-xs text-slate-500">
                  Print or copy these questions when scheduling a consultation with an attorney or visiting a free legal aid clinic:
                </p>
                <div className="space-y-2.5">
                  {analysisResult.analysis.questionsForLawyer.map((q, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                      <span className="font-bold text-slate-400">{idx + 1}.</span>
                      <p className="font-medium">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: GROUNDED DOCUMENT Q&A */}
            {activeSubTab === 'qa' && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ask Follow-up Questions About This Document
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Answers are strictly restricted to the text of "{analysisResult.document.filename}".
                  </p>
                </div>

                {/* Q&A Stream */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {qaHistory.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No questions asked yet. Try asking: "Can the landlord deduct painting costs?" or "What is the penalty for early termination?"
                    </div>
                  ) : (
                    qaHistory.map((item, idx) => (
                      <div key={idx} className="space-y-2 text-xs">
                        <div className="p-2.5 bg-slate-100 rounded-lg text-slate-900 font-semibold">
                          Q: {item.question}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-1.5">
                          <p>{item.answer}</p>
                          {item.excerpts?.length > 0 && (
                            <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200">
                              <strong>Document Excerpt:</strong> {item.excerpts.join(' · ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {isQaLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reading document clauses to answer your question...</span>
                    </div>
                  )}
                </div>

                {/* Question Input */}
                <form onSubmit={handleAskQuestion} className="flex gap-2 pt-2 border-t border-slate-100">
                  <label htmlFor="doc-qa-input" className="sr-only">Ask a question about this document</label>
                  <input
                    id="doc-qa-input"
                    type="text"
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    placeholder="Ask about a specific clause, deadline, or fee..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    disabled={isQaLoading}
                  />
                  <button
                    type="submit"
                    disabled={!qaInput.trim() || isQaLoading}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-semibold"
                  >
                    Ask
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
