import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Lock, Unlock } from 'lucide-react';
import axios from 'axios';

export default function ReVerificationTab({ initialRecordId }) {
  const [recordIdOrTx, setRecordIdOrTx] = useState(initialRecordId || '');
  const [candidateFaceHash, setCandidateFaceHash] = useState('');
  const [candidatePostUrl, setCandidatePostUrl] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (customUrl = null, customFaceHash = null) => {
    if (!recordIdOrTx) {
      setErrorMsg('Please enter a valid Record ID or Transaction Hash');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const payload = {
        record_id_or_tx: recordIdOrTx.trim(),
        candidate_face_hash: customFaceHash !== null ? customFaceHash : (candidateFaceHash.trim() || undefined),
        candidate_post_url: customUrl !== null ? customUrl : (candidatePostUrl.trim() || undefined)
      };

      const res = await axios.post('/api/pipeline/verify-record', payload);
      setVerificationResult(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Verification request failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateTamperAttack = () => {
    const spoofedUrl = "https://phishing-fraudulent-impersonation.xyz/faked-identity";
    setCandidatePostUrl(spoofedUrl);
    handleVerify(spoofedUrl, candidateFaceHash || undefined);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-[#145334]">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#0b6839]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#fee101] bg-[#071d13] px-3 py-1 rounded-full border border-[#fee101]/30">
            Independent Verification & Audit Lab
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
            On-Chain Re-Verification & Tamper Detection
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Audit any biometric registration against the immutable blockchain state. Demonstrate mathematical tamper-proofing by verifying authentic data or testing malicious modifications.
          </p>
        </div>
      </div>

      {/* Input Verification Form */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border-[#145334]">
        
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#fee101]">
            RECORD ID OR TRANSACTION HASH *
          </label>
          <div className="relative">
            <input
              type="text"
              value={recordIdOrTx}
              onChange={(e) => setRecordIdOrTx(e.target.value)}
              placeholder="e.g. 0x60a50937c00d1f57bb76202fedd15b21f... or 0x0a707f0..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#071d13] border border-[#145334] text-xs font-mono text-[#fee101] focus:outline-none focus:border-[#fee101] placeholder-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-bold">
              OPTIONAL: CANDIDATE POST URL TO AUDIT
            </label>
            <input
              type="text"
              value={candidatePostUrl}
              onChange={(e) => setCandidatePostUrl(e.target.value)}
              placeholder="e.g. https://x.com/vitalikbuterin/status/..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#071d13] border border-[#145334] text-xs text-white focus:outline-none focus:border-[#fee101] placeholder-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-bold">
              OPTIONAL: CANDIDATE FACE HASH (SHA-256)
            </label>
            <input
              type="text"
              value={candidateFaceHash}
              onChange={(e) => setCandidateFaceHash(e.target.value)}
              placeholder="e.g. e297502bd3f2092659d5984ec5d50c..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#071d13] border border-[#145334] text-xs font-mono text-white focus:outline-none focus:border-[#fee101] placeholder-slate-600"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
          <button
            onClick={() => handleVerify()}
            disabled={isVerifying}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#fee101] hover:bg-[#ffd000] text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#fee101]/20 transition-all"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing On-Chain Ledger...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Authentic On-Chain Record</span>
              </>
            )}
          </button>

          <button
            onClick={handleSimulateTamperAttack}
            disabled={isVerifying || !recordIdOrTx}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Tamper Attack (Test Rejection)</span>
          </button>
        </div>

      </div>

      {/* Verification Result Output */}
      {verificationResult && (
        <div
          className={`glass-panel p-6 rounded-3xl border transition-all ${
            verificationResult.verified
              ? 'border-[#fee101] bg-[#0c2e1f]/90'
              : 'border-rose-500 bg-rose-950/50'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                verificationResult.verified
                  ? 'bg-[#fee101] text-black font-bold shadow-lg shadow-[#fee101]/20'
                  : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-400'
              }`}
            >
              {verificationResult.verified ? (
                <Lock className="w-6 h-6" />
              ) : (
                <Unlock className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    verificationResult.verified
                      ? 'bg-[#0b6839] text-[#fee101] border border-[#fee101]/40'
                      : 'bg-rose-950 text-rose-200 border border-rose-800'
                  }`}
                >
                  {verificationResult.verified ? '100% AUTHENTIC ON-CHAIN' : 'TAMPERING DETECTED'}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Block #{verificationResult.block_number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white pt-1">
                {verificationResult.message}
              </h3>

              {/* Passed Checks List */}
              {verificationResult.checks_passed?.length > 0 && (
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-mono text-[#fee101] uppercase font-bold block">
                    Cryptographic Proof Validations:
                  </span>
                  {verificationResult.checks_passed.map((chk, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-200 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#fee101] shrink-0" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tamper Discrepancies List */}
              {verificationResult.tamper_details?.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-800 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                    Security Violation & Mismatch Log:
                  </span>
                  {verificationResult.tamper_details.map((t, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-rose-200 font-mono">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stored On-Chain Metadata */}
              {verificationResult.stored_record && (
                <div className="mt-4 pt-3 border-t border-[#145334] text-xs font-mono space-y-1 text-slate-300">
                  <div>
                    <span className="text-slate-400 font-bold">ON-CHAIN TARGET URL: </span>
                    <span className="text-[#fee101]">{verificationResult.stored_record.post_url}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">ORIGINAL AUTHOR: </span>
                    <span className="text-white">{verificationResult.stored_record.author} ({verificationResult.stored_record.platform})</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
