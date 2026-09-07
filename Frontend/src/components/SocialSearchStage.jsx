import React from 'react';
import { Search, ExternalLink, Award, Clock } from 'lucide-react';

export default function SocialSearchStage({ searchData, selectedMatchIndex, onSelectMatch }) {
  if (!searchData || !searchData.matches) {
    return (
      <div className="max-w-4xl mx-auto glass-panel p-8 rounded-3xl text-center space-y-3 border-[#145334]">
        <Search className="w-10 h-10 text-[#fee101] mx-auto animate-pulse" />
        <h3 className="text-lg font-bold text-white">Social Search Pending</h3>
        <p className="text-xs text-slate-400">Complete Stage 1 Face Scan to initiate real-time web & social media discovery.</p>
      </div>
    );
  }

  const matches = searchData.matches || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner / Metrics */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-[#145334]">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-[#0b6839]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#fee101] bg-[#071d13] px-3 py-1 rounded-full border border-[#fee101]/30">
              Stage 2 / 3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Web & Social Media Discovery Results
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Live crawler identified matching social media posts and profile footprints across public feeds.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#071d13] px-4 py-2 rounded-2xl border border-[#145334] font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">ENGINE</span>
              <span className="text-[#fee101] font-bold">{searchData.engine}</span>
            </div>
            <div className="border-l border-[#145334] pl-3">
              <span className="text-slate-400 block text-[10px] font-bold">LATENCY</span>
              <span className="text-emerald-400 font-bold">{searchData.latency_ms} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Post Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <span>Discovered Matches ({matches.length})</span>
            <span className="text-xs font-mono text-slate-400">• Select target post for blockchain notarization</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {matches.map((item, idx) => {
            const isSelected = selectedMatchIndex === idx;
            
            return (
              <div
                key={idx}
                onClick={() => onSelectMatch(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#0c2e1f] border-[#fee101] shadow-lg shadow-[#fee101]/10 ring-1 ring-[#fee101]/40'
                    : 'bg-[#071d13]/80 hover:bg-[#0c2e1f]/60 border-[#145334]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  
                  {/* Left: Platform & Info */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#071d13] flex items-center justify-center text-[#fee101] shrink-0 font-bold border border-[#145334]">
                      {item.platform.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0b6839] text-[#fee101] border border-[#fee101]/30">
                          {item.platform}
                        </span>
                        <span className="text-xs font-mono text-white font-bold">
                          {item.author}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">
                        {item.post_title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  {/* Right: Confidence Score & Selector */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-mono text-xs text-black bg-[#fee101] font-bold px-2.5 py-1 rounded-lg">
                      <Award className="w-3.5 h-3.5" />
                      <span>{Math.round(item.match_confidence * 100)}% Match</span>
                    </div>

                    <a
                      href={item.post_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-slate-300 hover:text-[#fee101] flex items-center space-x-1 transition-colors"
                    >
                      <span>View Live Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>

                {/* Bottom Fingerprint Row */}
                <div className="mt-3 pt-3 border-t border-[#145334] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="truncate max-w-md">
                    <span className="text-slate-500 font-bold">POST HASH: </span>
                    <span className="text-slate-300">{item.post_fingerprint_sha256}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Clock className="w-3 h-3 text-[#fee101]" />
                    <span>Real-Time Crawl</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
