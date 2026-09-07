import React from 'react';
import { Blocks, Clock } from 'lucide-react';

export default function BlockExplorerTab({ chainInfo, onSelectRecord }) {
  const blocks = chainInfo?.blocks || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-[#145334]">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-[#0b6839]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#fee101] bg-[#071d13] px-3 py-1 rounded-full border border-[#fee101]/30">
              Immutable Ledger Telemetry
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              EVM Blockchain Explorer
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Transparent, immutable ledger tracking all facial biometric registrations and Merkle proofs.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#071d13] px-4 py-2 rounded-2xl border border-[#145334] font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">TOTAL BLOCKS</span>
              <span className="text-[#fee101] font-bold text-base">{chainInfo?.total_blocks || 0}</span>
            </div>
            <div className="border-l border-[#145334] pl-3">
              <span className="text-slate-400 block text-[10px] font-bold">REGISTRATIONS</span>
              <span className="text-emerald-400 font-bold text-base">{chainInfo?.total_records || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.block_number} className="glass-panel p-5 rounded-2xl border border-[#145334] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#145334]">
              <div className="flex items-center space-x-2">
                <Blocks className="w-4 h-4 text-[#fee101]" />
                <span className="font-bold text-white text-sm">
                  Block #{block.block_number}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#0b6839] text-[#fee101] font-bold border border-[#fee101]/30">
                  {block.transactions_count} TX
                </span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center space-x-1">
                <Clock className="w-3 h-3 text-[#fee101]" />
                <span>{new Date(block.timestamp * 1000).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold block">BLOCK HASH:</span>
                <span className="text-slate-300 truncate block">{block.block_hash}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">MERKLE ROOT:</span>
                <span className="text-[#fee101] truncate block">{block.merkle_root}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">PARENT HASH:</span>
                <span className="text-slate-500 truncate block">{block.parent_hash}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">VALIDATOR:</span>
                <span className="text-emerald-400 truncate block">{block.validator}</span>
              </div>
            </div>

            {/* Transactions in block */}
            {block.transactions?.map((tx, idx) => (
              <div key={idx} className="mt-3 p-3 rounded-xl bg-[#071d13] border border-[#145334] flex items-center justify-between">
                <div className="truncate max-w-lg space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#fee101] font-bold">{tx.method || 'Transaction'}</span>
                    <span className="text-slate-400 text-[10px]">{tx.tx_hash.slice(0, 16)}...</span>
                  </div>
                  {tx.record?.post_url && (
                    <div className="text-slate-300 truncate text-[11px]">
                      {tx.record.post_url}
                    </div>
                  )}
                </div>

                {tx.record?.record_id && (
                  <button
                    onClick={() => onSelectRecord(tx.record.record_id)}
                    className="px-3 py-1 rounded-lg bg-[#0b6839] hover:bg-[#15803d] border border-[#fee101]/40 text-[#fee101] text-[11px] shrink-0 font-bold transition-colors shadow-sm"
                  >
                    Audit Record
                  </button>
                )}
              </div>
            ))}

          </div>
        ))}
      </div>

    </div>
  );
}
