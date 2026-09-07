import React from 'react';
import { Blocks, CheckCircle2, Copy, Download, ShieldCheck, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BlockchainNotarizeStage({ blockchainData, onJumpToVerifier }) {
  if (!blockchainData) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadCertificate = () => {
    const cert = blockchainData.certificate;
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HH2026_Certificate_${cert.certificate_id}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Success Notification Banner */}
      <div className="glass-panel p-6 rounded-3xl border-[#0b6839] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#0b6839]/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#fee101] text-black flex items-center justify-center shrink-0 font-bold shadow-lg shadow-[#fee101]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#fee101] bg-[#071d13] px-3 py-1 rounded-full border border-[#fee101]/30">
                Stage 3 / 3 • Notarized On-Chain
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                Tamper-Evident Record Mined to Blockchain
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                The face scan fingerprint and social post metadata are immutably written into block #{blockchainData.block_number}.
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={downloadCertificate}
              className="px-4 py-2 rounded-xl bg-[#071d13] hover:bg-[#0b6839] text-xs font-bold text-[#fee101] border border-[#145334] flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Cert</span>
            </button>
            <button
              onClick={() => onJumpToVerifier(blockchainData.record_id)}
              className="px-4 py-2 rounded-xl bg-[#fee101] hover:bg-[#ffd000] text-black font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-lg shadow-[#fee101]/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Re-Verify Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* On-Chain Transaction Receipt Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border-[#145334]">
        <h3 className="text-sm font-semibold text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Blocks className="w-4 h-4 text-[#fee101]" />
            <span>Immutable Smart Contract Transaction Receipt</span>
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#0b6839] text-[#fee101] font-bold border border-[#fee101]/40">
            STATUS: 0x1 (SUCCESS)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          
          <div className="p-4 rounded-2xl bg-[#071d13] border border-[#145334] space-y-1">
            <span className="text-slate-400 text-[10px] block font-bold">TRANSACTION HASH</span>
            <div className="flex items-center justify-between">
              <span className="text-[#fee101] truncate pr-2">{blockchainData.tx_hash}</span>
              <button onClick={() => copyToClipboard(blockchainData.tx_hash)} className="text-slate-400 hover:text-[#fee101]">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#071d13] border border-[#145334] space-y-1">
            <span className="text-slate-400 text-[10px] block font-bold">RECORD ID (CANONICAL LEAF)</span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 truncate pr-2">{blockchainData.record_id}</span>
              <button onClick={() => copyToClipboard(blockchainData.record_id)} className="text-slate-400 hover:text-emerald-300">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#071d13] border border-[#145334] space-y-1">
            <span className="text-slate-400 text-[10px] block font-bold">BLOCK NUMBER & HASH</span>
            <span className="text-white block font-bold">Block #{blockchainData.block_number}</span>
            <span className="text-slate-400 truncate block text-[11px]">{blockchainData.block_hash}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#071d13] border border-[#145334] space-y-1">
            <span className="text-slate-400 text-[10px] block font-bold">SMART CONTRACT REGISTRY</span>
            <span className="text-slate-200 truncate block">{blockchainData.contract_address}</span>
            <span className="text-[#fee101] text-[10px] block font-bold">FaceVerificationRegistry.sol</span>
          </div>

        </div>

        {/* Certificate Preview */}
        {blockchainData.certificate && (
          <div className="mt-4 p-4 rounded-2xl bg-[#071d13] border border-[#fee101]/30 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#145334]">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#fee101]" />
                <span className="font-bold text-white">
                  {blockchainData.certificate.certificate_id}
                </span>
              </div>
              <span className="text-[10px] text-[#fee101] uppercase font-bold tracking-wider">
                Cryptographically Notarized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold block">TARGET URL:</span>
                <a
                  href={blockchainData.certificate.post_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fee101] hover:underline truncate block"
                >
                  {blockchainData.certificate.post_url}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">AUTHOR / PLATFORM:</span>
                <span className="text-white">
                  {blockchainData.certificate.author} ({blockchainData.certificate.platform})
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
