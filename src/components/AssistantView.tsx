import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquareText,
  Send,
  Loader2,
  CheckSquare,
  Square,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Copy,
  Printer,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Clock,
  Check,
} from 'lucide-react';
import { api } from '../services/api.js';
import { AssistantChatResponse } from '../../server/services/aiService.js';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  response?: AssistantChatResponse;
  timestamp: string;
}

interface AssistantViewProps {
  jurisdiction: string;
  onOpenEmergency: () => void;
}

const SAMPLE_QUESTIONS = [
  'My landlord has not returned my ₹50,000 security deposit. What options do I have?',
  'What should I do after receiving an employment termination notice without severance?',
  'What does Section 27 of the Indian Contract Act mean regarding non-compete clauses?',
  'The brand refuses to repair or refund my defective refrigerator after 2 weeks. What are my consumer rights?',
  'What documents and evidence should I collect before sending a formal legal notice?',
] as const;

export const AssistantView: React.FC<AssistantViewProps> = ({ jurisdiction, onOpenEmergency }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am LegalEase Assistant, grounded in ${jurisdiction} law. I can help explain legal notices, outline your statutory rights, prepare evidence checklists, and explain options in plain English.\n\nAsk me any question below, or select one of the common topics to get started.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = useCallback(async (questionToSend?: string) => {
    const q = (questionToSend || inputText).trim();
    if (!q || isLoading) return;

    // Detect crisis words immediately
    const crisisPatterns = /kill|suicide|physically hitting|domestic violence|police beating|in jail right now|emergency/i;
    if (crisisPatterns.test(q)) {
      onOpenEmergency();
    }

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.text)
        .slice(-2)
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text || '',
        }));

      const res = await api.askAssistant(q, jurisdiction, historyPayload);

      const assistantMsg: Message = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        response: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        text: 'Something went wrong while analyzing your legal inquiry. Please check your internet connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputText, isLoading, messages, jurisdiction, onOpenEmergency]);

  const toggleCheck = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyResponse = (res: AssistantChatResponse, id: string) => {
    const lines = [
      `LEGAL ANALYSIS (${jurisdiction})`,
      `===========================`,
      `UNDERSTANDING:\n${res.understanding}\n`,
      `LEGAL CONCEPTS:\n` + res.relevantLegalConcepts.map((c) => `- ${c.concept} (${c.statuteOrRule}): ${c.explanation}`).join('\n') + '\n',
      `NEXT STEPS:\n` + res.possibleNextSteps.map((s) => `${s.stepNumber}. [${s.priority}] ${s.title}: ${s.description}`).join('\n') + '\n',
      `DOCUMENTS TO COLLECT:\n` + res.documentsToCollect.map((d) => `- ${d.documentName} (Purpose: ${d.purpose})`).join('\n') + '\n',
      `IMPORTANT CONSIDERATIONS:\n` + res.importantConsiderations.deadlines.join('\n') + '\n' + res.importantConsiderations.jurisdictionNotes + '\n',
      `SOURCES:\n` + res.sources.map((s) => `- ${s.name}: ${s.url}`).join('\n') + '\n',
      `DISCLAIMER:\n${res.disclaimer}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-legal">AI Legal Assistant</h1>
          <p className="text-xs text-slate-600 mt-1">
            Grounded in {jurisdiction} statutory law · Plain-English answers with structured checklists & verified sources.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts Carousel */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Suggested Legal Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-left text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-3 py-2 transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        className="space-y-6 min-h-[400px]"
        role="region"
        aria-live="polite"
        aria-label="Conversation with LegalEase AI"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {msg.sender === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-2xl bg-slate-900 text-white rounded-2xl rounded-tr-xs p-4 shadow-xs text-sm">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[10px] text-slate-400 mt-2 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-3xl w-full bg-white rounded-2xl rounded-tl-xs border border-slate-200 p-5 shadow-xs space-y-5 text-slate-800">
                  {/* Assistant standard message */}
                  {msg.text && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  )}

                  {/* Assistant Structured Analysis Card */}
                  {msg.response && (
                    <div className="space-y-6">
                      {/* 1. UNDERSTANDING */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          01. Plain-English Understanding
                        </h3>
                        <p className="text-sm font-medium text-slate-900 leading-relaxed">
                          {msg.response.understanding}
                        </p>
                      </div>

                      {/* 2. RELEVANT LEGAL CONCEPTS & STATUTES */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                          02. Relevant Legal Concepts & Provisions ({jurisdiction})
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5">
                          {msg.response.relevantLegalConcepts.map((concept, cIdx) => (
                            <div key={cIdx} className="p-3.5 bg-white rounded-xl border border-slate-200">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{concept.concept}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {concept.statuteOrRule}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                                {concept.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. ORDERED NEXT STEPS (Interactive Checklist) */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            03. Actionable Next Steps (Checklist)
                          </h3>
                          <span className="text-[11px] text-slate-400">Click steps to track completion</span>
                        </div>
                        <div className="space-y-2">
                          {msg.response.possibleNextSteps.map((step) => {
                            const stepId = `${msg.id}-step-${step.stepNumber}`;
                            const isChecked = !!checkedSteps[stepId];
                            return (
                              <button
                                key={step.stepNumber}
                                onClick={() => toggleCheck(stepId)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                                  isChecked
                                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <span className="mt-0.5 shrink-0 text-slate-500">
                                  {isChecked ? (
                                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                                  ) : (
                                    <Square className="w-5 h-5 text-slate-400" />
                                  )}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-sm font-semibold ${
                                        isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                                      }`}
                                    >
                                      {step.stepNumber}. {step.title}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        step.priority === 'High'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {step.priority} Priority
                                    </span>
                                  </div>
                                  <p
                                    className={`text-xs mt-1 leading-relaxed ${
                                      isChecked ? 'text-slate-400' : 'text-slate-600'
                                    }`}
                                  >
                                    {step.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. DOCUMENTS & EVIDENCE TO PREPARE */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                          04. Documents / Evidence to Preserve
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.response.documentsToCollect.map((doc, dIdx) => (
                            <div key={dIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                              <div className="flex items-start gap-2">
                                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{doc.documentName}</h4>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    <strong>Purpose:</strong> {doc.purpose}
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    <strong>Source:</strong> {doc.whereToObtain}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. IMPORTANT CONSIDERATIONS & DEADLINES */}
                      <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                          <Clock className="w-4 h-4 text-amber-700" />
                          <span>05. Critical Deadlines & Statutory Cautions</span>
                        </div>
                        <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                          {msg.response.importantConsiderations.deadlines.map((deadline, dlIdx) => (
                            <li key={dlIdx}>{deadline}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-amber-900 mt-2">
                          <strong>Jurisdiction Note:</strong> {msg.response.importantConsiderations.jurisdictionNotes}
                        </p>
                        {msg.response.importantConsiderations.uncertaintyFactors?.length > 0 && (
                          <div className="mt-2 text-xs text-amber-800">
                            <strong>Uncertainty / Caveats:</strong> {msg.response.importantConsiderations.uncertaintyFactors.join(' · ')}
                          </div>
                        )}
                      </div>

                      {/* 6. AUTHORITATIVE SOURCES */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          06. Authoritative Legal Sources
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {msg.response.sources.map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                              <span>{src.name}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* 7. DISCLAIMER */}
                      <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        <p>
                          <strong className="text-slate-800">Disclaimer:</strong> {msg.response.disclaimer}
                        </p>
                      </div>

                      {/* Response Action bar */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="text-[11px]">Grounded via Gemini 3.8 Flash</span>
                        <button
                          onClick={() => handleCopyResponse(msg.response!, msg.id)}
                          className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Structured Summary</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3 text-slate-600 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
              <span>Analyzing your legal question and retrieving relevant statutes ({jurisdiction})...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-2 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <label htmlFor="assistant-input" className="sr-only">Type your legal question</label>
          <textarea
            id="assistant-input"
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask a question under ${jurisdiction} law (e.g., "My employer delayed my salary for 2 months", "How do I challenge an illegal deduction?")...`}
            rows={2}
            className="flex-1 bg-transparent p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-slate-900"
            aria-label="Send legal question"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
