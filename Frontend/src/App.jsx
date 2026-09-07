import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Camera, Search, Link2, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck, Users, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Pipeline Results
  const [faceResult, setFaceResult] = useState(null);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedMatchIdx, setSelectedMatchIdx] = useState(0);
  const [blockchainResult, setBlockchainResult] = useState(null);
  
  // Re-verification state
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Quick Sample Presets
  const samplePresets = [
    {
      name: "Sachin Tendulkar",
      hint: "sachin tendulkar cricketer",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg/330px-Sachin_Tendulkar_at_MRF_Promotion_Event.jpg"
    },
    {
      name: "Virat Kohli",
      hint: "virat kohli cricketer",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_05.jpg/330px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_05.jpg"
    },
    {
      name: "Vitalik Buterin",
      hint: "vitalik buterin ethereum",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Vitalik_Buterin_TechCrunch_London_2015_%28cropped%29.jpg/330px-Vitalik_Buterin_TechCrunch_London_2015_%28cropped%29.jpg"
    },
    {
      name: "Sam Altman",
      hint: "sam altman openai",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg/330px-Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg"
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setIsWebcamOpen(false);
      resetPipeline();
    }
  };

  const handleSelectPreset = async (preset) => {
    try {
      setPreviewUrl(preset.url);
      setSearchQuery(preset.hint || preset.name);
      resetPipeline();
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const file = new File([blob], `${preset.name}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setIsWebcamOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const startWebcam = async () => {
    setIsWebcamOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera permission not granted.");
      setIsWebcamOpen(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const stream = videoRef.current.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());

    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(dataUrl);
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        setSelectedFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
        setIsWebcamOpen(false);
        resetPipeline();
      });
  };

  const resetPipeline = () => {
    setFaceResult(null);
    setAllMatches([]);
    setSelectedMatchIdx(0);
    setBlockchainResult(null);
    setVerifyStatus(null);
    setCurrentStep(1);
  };

  // Run the full 3-step pipeline
  const runPipeline = async () => {
    if (!selectedFile && !previewUrl) return;
    setLoading(true);
    resetPipeline();

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (previewUrl) {
        formData.append('image_base64', previewUrl);
      }
      formData.append('search_query', searchQuery.trim());
      formData.append('selected_index', 0);

      const res = await axios.post('/api/pipeline/run', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFaceResult(res.data.stage_1_face);
        const matches = res.data.stage_2_search?.matches || [];
        setAllMatches(matches);
        setSelectedMatchIdx(0);
        setBlockchainResult(res.data.stage_3_blockchain);
        setCurrentStep(3);
      } else {
        alert(res.data.error || "Failed to process image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Backend. Ensure python main.py is running.");
    } finally {
      setLoading(false);
    }
  };

  // Switch which social match is notarized on blockchain
  const handleSelectSocialPost = async (idx) => {
    setSelectedMatchIdx(idx);
    if (!faceResult || !allMatches[idx]) return;

    try {
      setLoading(true);
      const res = await axios.post('/api/pipeline/blockchain-upload', {
        face_hash: faceResult.primary_face_hash,
        post_data: allMatches[idx]
      });
      if (res.data.success) {
        setBlockchainResult({
          tx_hash: res.data.tx_hash,
          block_number: res.data.block_number,
          block_hash: res.data.block_hash,
          contract_address: res.data.contract_address,
          record_id: res.data.record_id,
          certificate: res.data.certificate
        });
        setVerifyStatus(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-verify against blockchain
  const handleReVerify = async () => {
    const activePost = allMatches[selectedMatchIdx] || allMatches[0];
    if (!blockchainResult || !activePost) return;
    setIsVerifying(true);
    try {
      const res = await axios.post('/api/pipeline/verify-record', {
        record_id_or_tx: blockchainResult.record_id,
        candidate_face_hash: faceResult?.primary_face_hash,
        candidate_post_url: activePost.post_url
      });
      setVerifyStatus(res.data);
    } catch (err) {
      console.error(err);
      alert("Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'Twitter / X':
        return { color: 'bg-sky-950 text-sky-400 border-sky-800', label: '𝕏 Twitter' };
      case 'Reddit':
        return { color: 'bg-orange-950 text-orange-400 border-orange-800', label: '🔴 Reddit' };
      case 'Instagram':
        return { color: 'bg-pink-950 text-pink-400 border-pink-800', label: '📸 Instagram' };
      case 'LinkedIn':
        return { color: 'bg-blue-950 text-blue-400 border-blue-800', label: '💼 LinkedIn' };
      case 'YouTube':
        return { color: 'bg-red-950 text-red-400 border-red-800', label: '▶️ YouTube' };
      default:
        return { color: 'bg-[#0b6839] text-[#fee101] border-[#fee101]/30', label: platform };
    }
  };

  return (
    <div className="min-h-screen bg-[#071d13] text-white p-3 sm:p-6 md:p-8 flex flex-col justify-between items-center font-mono">
      
      {/* Top Header */}
      <header className="w-full max-w-2xl mb-6 text-center border-b border-[#145334] pb-5">
        <div className="inline-block bg-[#0b6839] text-[#fee101] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#fee101]/30">
          HH Goa 2026 • Task 3
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight px-2">
          Face Identification & Blockchain Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 px-2">
          Face Scan &rarr; Find Matching Social Post &rarr; Notarize & Verify on Blockchain
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl space-y-5">

        {/* STEP 1: Face Scan Input */}
        <section className="bg-[#0c2e1f] border border-[#145334] rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg shadow-black/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#fee101] flex items-center space-x-2">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#fee101] text-black text-xs flex items-center justify-center font-bold">1</span>
              <span>Input Face Scan</span>
            </h2>
            
            {/* Quick Samples */}
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="text-[11px] sm:text-xs bg-[#071d13] hover:bg-[#0b6839] text-slate-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#145334] transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Upload / Camera Box */}
          <div className="border-2 border-dashed border-[#145334] bg-[#071d13]/80 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px]">
            {isWebcamOpen ? (
              <div className="flex flex-col items-center w-full">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-xs h-44 object-cover rounded-lg border border-[#145334]" />
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-1.5 bg-[#fee101] text-black font-bold text-xs rounded-lg shadow-md"
                  >
                    Take Photo
                  </button>
                  <button
                    onClick={() => setIsWebcamOpen(false)}
                    className="px-3 py-1.5 bg-red-900/90 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={faceResult?.annotated_image || previewUrl}
                  alt="Face Input"
                  className="max-h-40 sm:max-h-48 object-contain rounded-lg border border-[#145334] shadow-md"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-[#fee101] mt-2 underline"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-[#fee101] mx-auto opacity-80" />
                <p className="text-xs text-slate-300">Upload a face photo or use camera</p>
                <div className="flex space-x-2 justify-center pt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#0b6839] hover:bg-[#15803d] text-white text-xs font-semibold rounded-lg border border-[#145334]"
                  >
                    Choose Image
                  </button>
                  <button
                    onClick={startWebcam}
                    className="px-3 py-1.5 bg-[#071d13] hover:bg-[#0b6839] text-slate-300 text-xs rounded-lg border border-[#145334] flex items-center space-x-1"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#fee101]" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Optional Context Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
              <span>Related Context / Person Info (Optional):</span>
              <span className="text-[10px] text-slate-500 font-normal">Can be left empty for auto-detect</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. virat kohli, cricketer, vitalik, singer, or leave blank"
                className="flex-1 bg-[#071d13] border border-[#145334] text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#fee101] placeholder-slate-500"
              />
              <button
                onClick={runPipeline}
                disabled={(!selectedFile && !previewUrl) || loading}
                className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md ${
                  (!selectedFile && !previewUrl) || loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-[#fee101] hover:bg-[#ffd000] text-black active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Pipeline...</span>
                  </>
                ) : (
                  <span>Run Pipeline</span>
                )}
              </button>
            </div>
          </div>

          {/* Face Result Detail */}
          {faceResult && (
            <div className="bg-[#071d13] p-3 rounded-lg border border-[#145334] text-xs space-y-1">
              <div className="text-emerald-400 font-bold flex items-center space-x-1">
                <span>✓</span>
                <span>Face Identified & Biometrics Encoded</span>
              </div>
              <div className="text-slate-400 break-all text-[10px] sm:text-[11px]">
                <span className="text-slate-500">Face SHA-256: </span>
                {faceResult.primary_face_hash}
              </div>
            </div>
          )}
        </section>

        {/* STEP 2: Multi-Platform Social Media Matches */}
        {allMatches.length > 0 && (
          <section className="bg-[#0c2e1f] border border-[#145334] rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg shadow-black/40">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#fee101] flex items-center space-x-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#fee101] text-black text-xs flex items-center justify-center font-bold">2</span>
                <span>Matching Social Media Posts ({allMatches.length})</span>
              </h2>
              <span className="text-[10px] text-slate-400">Click a card to select</span>
            </div>

            {/* List of social platform posts one by one */}
            <div className="space-y-2.5">
              {allMatches.map((item, idx) => {
                const isSelected = selectedMatchIdx === idx;
                const badge = getPlatformBadge(item.platform);
                const conf = Math.round((item.match_confidence || 0.6) * 100);

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectSocialPost(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#071d13] border-[#fee101] ring-1 ring-[#fee101]/40'
                        : 'bg-[#071d13]/70 hover:bg-[#071d13] border-[#145334]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-white">
                          {item.author}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {conf >= 80 ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                            {conf}% Match
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#fee101] bg-[#0b6839]/60 px-1.5 py-0.5 rounded border border-[#fee101]/30">
                            {conf}% Match
                          </span>
                        )}

                        {isSelected && (
                          <span className="text-[10px] font-bold bg-[#fee101] text-black px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                      {item.post_title}
                    </div>
                    <div className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                      {item.snippet}
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#145334]/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Click card to record on-chain</span>
                      <a
                        href={item.post_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#fee101] hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <span>Open Direct Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3: Blockchain Notarization & Re-Verification */}
        {blockchainResult && (
          <section className="bg-[#0c2e1f] border border-[#145334] rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg shadow-black/40">
            <h2 className="text-sm sm:text-base font-bold text-[#fee101] flex items-center space-x-2">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#fee101] text-black text-xs flex items-center justify-center font-bold">3</span>
              <span>Blockchain Notarization & Verification</span>
            </h2>

            <div className="bg-[#071d13] p-3 sm:p-4 rounded-xl border border-[#145334] text-xs space-y-2">
              <div className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Recorded on Blockchain (Block #{blockchainResult.block_number})</span>
              </div>

              <div className="text-slate-400 break-all text-[10px] sm:text-[11px]">
                <span className="text-slate-500 block font-bold">TRANSACTION HASH:</span>
                <span className="text-[#fee101]">{blockchainResult.tx_hash}</span>
              </div>

              <div className="text-slate-400 break-all text-[10px] sm:text-[11px]">
                <span className="text-slate-500 block font-bold">RECORD ID (LEAF HASH):</span>
                <span className="text-slate-200">{blockchainResult.record_id}</span>
              </div>

              <div className="text-slate-400 text-[10px] sm:text-[11px] truncate">
                <span className="text-slate-500 font-bold">CONTRACT: </span>
                <span className="text-slate-300">{blockchainResult.contract_address}</span>
              </div>
            </div>

            {/* Re-Verify Action */}
            <div className="pt-1">
              <button
                onClick={handleReVerify}
                disabled={isVerifying}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#fee101] hover:bg-[#ffd000] text-black font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-md active:scale-95"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking Chain...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Re-Verify On-Chain Record</span>
                  </>
                )}
              </button>
            </div>

            {/* Verification Result Banner */}
            {verifyStatus && (
              <div className={`p-3.5 sm:p-4 rounded-xl text-xs border ${
                verifyStatus.verified
                  ? 'bg-[#0b6839]/80 border-[#fee101] text-white'
                  : 'bg-red-950/80 border-red-700 text-red-200'
              }`}>
                <div className="font-bold flex items-center space-x-1.5 text-xs sm:text-sm mb-1 text-[#fee101]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#fee101]" />
                  <span>{verifyStatus.message}</span>
                </div>
                {verifyStatus.checks_passed?.map((chk, i) => (
                  <div key={i} className="text-slate-200 text-[10px] sm:text-[11px]">• {chk}</div>
                ))}
              </div>
            )}

          </section>
        )}

      </main>

      {/* Footer - Team Horizon Credits */}
      <footer className="w-full max-w-2xl mt-10 pt-6 border-t border-[#145334] text-center space-y-2">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-[#fee101]">
          <Users className="w-4 h-4" />
          <span>Made by Team Horizon</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-300 font-medium">
          <span className="bg-[#0c2e1f] px-2.5 py-1 rounded-md border border-[#145334]">Prince Sahu</span>
          <span className="bg-[#0c2e1f] px-2.5 py-1 rounded-md border border-[#145334]">Aniket Raj</span>
          <span className="bg-[#0c2e1f] px-2.5 py-1 rounded-md border border-[#145334]">Utkarsh Tiwari</span>
        </div>

        <p className="text-[10px] text-slate-500 pt-1">
          HackerHouse Goa 2026 • Task 3
        </p>
      </footer>

    </div>
  );
}
