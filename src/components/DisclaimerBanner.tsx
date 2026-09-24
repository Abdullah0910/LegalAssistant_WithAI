import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside aria-label="Legal Information Notice" className="bg-amber-50/90 border-b border-amber-200/80 text-amber-950 text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <p className="leading-tight">
            <strong className="font-semibold">General Legal Information Only:</strong> LegalEase AI is an educational accessibility platform. We do not provide formal legal representation, attorney-client privilege, or individualized legal advice. Consult a licensed advocate/attorney for binding counsel.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-amber-800 shrink-0 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Statutory Grounding & Privacy First</span>
        </div>
      </div>
    </aside>
  );
};
