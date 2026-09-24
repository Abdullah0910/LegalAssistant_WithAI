import React from 'react';
import { ShieldAlert, Phone, ExternalLink, X, AlertTriangle } from 'lucide-react';
import { EMERGENCY_RESOURCES } from '../../server/services/legalSources.js';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jurisdiction: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, jurisdiction }) => {
  if (!isOpen) return null;

  const helplines = EMERGENCY_RESOURCES.filter(
    (h) => h.jurisdiction.toLowerCase() === jurisdiction.toLowerCase() || h.jurisdiction === 'India'
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-red-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-red-50 p-5 border-b border-red-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-lg font-bold text-red-950">
                Immediate Crisis & Legal Helplines
              </h2>
              <p className="text-xs text-red-800">
                If you or someone else is in physical danger or immediate distress, use these direct emergency services.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-slate-900"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              AI systems are never an appropriate tool for active emergencies, ongoing physical violence, arrest custody, or acute mental health crises. Please contact the direct telephone numbers below.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Helplines ({jurisdiction})
            </h3>
            {helplines.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.purpose}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${item.contactNumber.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Dial {item.contactNumber}</span>
                  </a>
                  {item.portalUrl && (
                    <a
                      href={item.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
                      title="Visit official portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legal Aid Rights */}
          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
            <h4 className="font-semibold text-slate-900 mb-1">Right to Free Legal Representation:</h4>
            <p>
              In India, under Section 12 of the Legal Services Authorities Act, women, children, industrial workers, custody detainees, and low-income individuals have a statutory right to free advocate assistance through NALSA / DLSA. Dial <strong>15100</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
