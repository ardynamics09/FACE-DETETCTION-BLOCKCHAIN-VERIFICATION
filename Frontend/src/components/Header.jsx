import React from 'react';
import { Shield, Radio, CheckCircle2, Award } from 'lucide-react';

export default function Header({ chainInfo, activeTab, setActiveTab }) {
  return (
    <header className="border-b border-[#145334] bg-[#071d13]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Protocol Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pipeline')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b6839] to-[#fee101] p-[2px] shadow-lg shadow-[#0b6839]/40">
              <div className="w-full h-full bg-[#071d13] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#fee101]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                  HH GOA <span className="text-[#fee101]">2026</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold tracking-wider bg-[#0b6839]/80 text-[#fee101] border border-[#fee101]/40 rounded-full">
                  Task 3 • Verifier
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Face Identification & Blockchain Verification Protocol
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-[#0c2e1f] p-1 rounded-xl border border-[#145334]">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-[#fee101] text-black font-bold shadow-md shadow-[#fee101]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#071d13]'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'verify'
                  ? 'bg-[#fee101] text-black font-bold shadow-md shadow-[#fee101]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#071d13]'
              }`}
            >
              Re-Verifier Lab
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'ledger'
                  ? 'bg-[#fee101] text-black font-bold shadow-md shadow-[#fee101]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#071d13]'
              }`}
            >
              Ledger Explorer
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all hidden md:block ${
                activeTab === 'docs'
                  ? 'bg-[#fee101] text-black font-bold shadow-md shadow-[#fee101]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#071d13]'
              }`}
            >
              Architecture & Docs
            </button>
          </nav>

          {/* Network Status Widget */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#0c2e1f] border border-[#145334] text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fee101] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fee101]"></span>
              </span>
              <span className="text-slate-200">EVM Ledger (PoA)</span>
              <span className="text-[#fee101] border-l border-[#145334] pl-2 font-bold">
                Block #{chainInfo?.total_blocks || 1}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
