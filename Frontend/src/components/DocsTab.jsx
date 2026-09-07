import React from 'react';
import { BookOpen, Lock } from 'lucide-react';

export default function DocsTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-[#145334]">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-5 h-5 text-[#fee101]" />
          <h2 className="text-xl font-bold text-white">
            Architecture & Verification Protocol Specification
          </h2>
        </div>
        <p className="text-sm text-slate-300">
          Technical breakdown of the 3-stage pipeline: Face Identification &rarr; Social Media Intelligence &rarr; Blockchain Immutability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-[#145334] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b6839] text-[#fee101] flex items-center justify-center font-bold border border-[#fee101]/30">
            01
          </div>
          <h3 className="text-base font-semibold text-white">Face Biometrics</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-scale Haar & landmark cascade detects facial bounding boxes and extracts a 128-dimensional biometric spatial matrix, finalized into a cryptographic SHA-256 fingerprint.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#145334] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b6839] text-[#fee101] flex items-center justify-center font-bold border border-[#fee101]/30">
            02
          </div>
          <h3 className="text-base font-semibold text-white">Reverse Search Engine</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Performs live reverse crawling across Twitter/X, Reddit, LinkedIn, GitHub, and public media feeds. Formats discoverable posts with timestamps, author attribution, and Keccak fingerprints.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#145334] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b6839] text-[#fee101] flex items-center justify-center font-bold border border-[#fee101]/30">
            03
          </div>
          <h3 className="text-base font-semibold text-white">Blockchain Notarization</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Smart contract (<code className="text-[#fee101]">FaceVerificationRegistry.sol</code>) mints a block containing the canonical leaf hash, digital validator signature, and Merkle tree root.
          </p>
        </div>

      </div>

      <div className="glass-panel p-6 rounded-2xl border border-[#145334] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Lock className="w-4 h-4 text-[#fee101]" />
          <span>Cryptographic Guarantees & Tamper Resistance</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The pipeline binds the biometric face vector and discovered social post metadata into a cryptographic leaf:
        </p>
        <div className="p-4 rounded-xl bg-[#071d13] font-mono text-xs text-[#fee101] overflow-x-auto border border-[#145334]">
          RecordID = Keccak256(Face_SHA256 || Post_Fingerprint || Post_URL || Author || Timestamp)
        </div>
        <p className="text-xs text-slate-400">
          Any modification—such as changing 1 character in a social post URL, spoofing an author, or submitting an altered face—changes the resulting hash and immediately fails on-chain proof validation.
        </p>
      </div>

    </div>
  );
}
