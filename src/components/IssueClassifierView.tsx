import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Loader2,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api.js';
import { IssueClassificationResponse } from '../../server/services/aiService.js';

interface IssueClassifierViewProps {
  jurisdiction: string;
}

export const IssueClassifierView: React.FC<IssueClassifierViewProps> = ({ jurisdiction }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IssueClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // User responses to the minimal follow-up questions
  const [followupAnswers, setFollowupAnswers] = useState<Record<string, string>>({});

  const sampleSituations = [
    'My employer hasn\'t paid my salary for two months and is refusing to issue my experience letter unless I forfeit my severance.',
    'My landlord has kept my ₹45,000 security deposit for arbitrary wall painting even though I stayed for 2 years with normal wear and tear.',
    'I purchased an air conditioner that broke down within 10 days of delivery. The retailer refuses a refund and says parts are out of stock indefinitely.',
    'An unauthorized micro-lending app is making defamatory calls to my phone contacts claiming I owe a loan I never applied for.',
  ];

  const handleClassify = async (overrideText?: string) => {
    const textToUse = (overrideText || description).trim();
    if (!textToUse || isLoading) return;

    if (overrideText) {
      setDescription(overrideText);
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.classifyIssue(textToUse, jurisdiction);
      setResult(res);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Classification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDescription('');
    setFollowupAnswers({});
    setStep(1);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-legal">Legal Issue Intake & Classifier</h1>
          <p className="text-xs text-slate-600 mt-1">
            Describe your situation in plain words. We categorize the legal dispute, identify missing facts, and chart immediate next steps.
          </p>
        </div>
        {step === 2 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Intake</span>
          </button>
        )}
      </div>

      {/* STEP 1: SITUATION INPUT */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <label htmlFor="issue-description" className="block text-sm font-bold text-slate-900">
              What happened? Describe your legal situation:
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Explain the dispute in your own words. Include who is involved, what was agreed upon, and what went wrong.
            </p>
            <textarea
              id="issue-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., My landlord hasn't returned my deposit... or My employer delayed my salary for two months..."
              className="mt-3 w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Quick-fill samples */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Try a Typical Dispute Scenario:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleSituations.map((sit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClassify(sit)}
                  disabled={isLoading}
                  className="text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors flex items-center justify-between"
                >
                  <span className="line-clamp-2 pr-2">"{sit}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleClassify()}
              disabled={!description.trim() || isLoading}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Classifying Legal Category ({jurisdiction})...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Analyze & Classify Dispute</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CLASSIFICATION RESULT & ACTION ROADMAP */}
      {step === 2 && result && (
        <div className="space-y-6">
          {/* Classification Header Banner */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Identified Category:
                </span>
                <span className="text-sm font-bold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/30">
                  {result.category}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                result.urgencyLevel === 'High' || result.urgencyLevel === 'Immediate Danger'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}>
                Urgency: {result.urgencyLevel}
              </span>
            </div>

            <h2 className="text-xl font-bold font-serif-legal">
              {result.specificIssue}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Minimal Missing Questions Wizard */}
          {result.informationNeeded?.length > 0 && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Essential Missing Details to Strengthen Your Case
                  </h3>
                  <p className="text-xs text-slate-500">
                    Before approaching an authority or sending a notice, have these specific facts ready:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.informationNeeded.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{idx + 1}. {item.field}</span>
                      <span className="text-[11px] text-slate-500 font-medium">Why it matters: {item.importance}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{item.question}</p>
                    <input
                      type="text"
                      placeholder="Your notes for this point (optional)..."
                      value={followupAnswers[item.field] || ''}
                      onChange={(e) =>
                        setFollowupAnswers({ ...followupAnswers, [item.field]: e.target.value })
                      }
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Action Steps */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Immediate Recommended Action Plan
            </h3>
            <div className="space-y-2.5">
              {result.immediateActions.map((act) => (
                <div key={act.stepNumber} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {act.stepNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{act.action}</h4>
                    <p className="text-xs text-slate-600 mt-1">{act.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence To Preserve */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Evidence to Preserve Right Away</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {result.evidenceToPreserve.map((ev, idx) => (
                  <li key={idx}>{ev}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Applicable Laws in {jurisdiction}</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {result.potentialApplicableLaws.map((law, idx) => (
                  <li key={idx} className="font-medium">{law}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
