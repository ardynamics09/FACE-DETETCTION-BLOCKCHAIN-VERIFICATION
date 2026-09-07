import React from 'react';
import { ScanFace, Search, Link2, CheckCircle2 } from 'lucide-react';

export default function PipelineStepIndicator({ currentStep, isProcessing }) {
  const steps = [
    {
      id: 1,
      name: 'Face Identification',
      sub: 'Biometric Vector Encoding',
      icon: ScanFace
    },
    {
      id: 2,
      name: 'Web & Social Search',
      sub: 'Reverse Intelligence Discovery',
      icon: Search
    },
    {
      id: 3,
      name: 'Blockchain Notarization',
      sub: 'Immutable Ledger Minting',
      icon: Link2
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div
              key={step.id}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? 'bg-[#0c2e1f] border-[#fee101] shadow-lg shadow-[#fee101]/10 ring-1 ring-[#fee101]/40'
                  : isCompleted
                  ? 'bg-[#092418] border-[#0b6839] text-slate-300'
                  : 'bg-[#071d13]/60 border-[#145334]/60 text-slate-500'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#fee101] animate-pulse" />
              )}
              
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#fee101] text-black font-bold'
                      : isCompleted
                      ? 'bg-[#0b6839] text-[#fee101] ring-1 ring-[#fee101]/40'
                      : 'bg-[#071d13] text-slate-600 border border-[#145334]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#fee101]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#fee101]">
                      Step 0{step.id}
                    </span>
                    {isActive && isProcessing && (
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fee101] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#fee101]"></span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">
                    {step.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {step.sub}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
