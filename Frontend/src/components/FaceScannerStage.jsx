import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, RefreshCw, Eye, ShieldCheck, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function FaceScannerStage({ onStartPipeline, isProcessing, faceData }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample portrait faces for instant testing
  const sampleImages = [
    {
      name: "Vitalik Buterin",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Vitalik_Buterin_TechCrunch_London_2015_%28cropped%29.jpg/330px-Vitalik_Buterin_TechCrunch_London_2015_%28cropped%29.jpg",
      tag: "Ethereum Founder"
    },
    {
      name: "Sam Altman",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg/330px-Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg",
      tag: "OpenAI CEO"
    },
    {
      name: "Andrej Karpathy",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Andrej_Karpathy_in_2023.jpg/330px-Andrej_Karpathy_in_2023.jpg",
      tag: "AI Pioneer"
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setIsWebcamActive(false);
    }
  };

  const handleSelectSample = async (sample) => {
    try {
      setPreviewUrl(sample.url);
      setSearchQuery(sample.name);
      
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      setSelectedImage(file);
      setIsWebcamActive(false);
    } catch (err) {
      console.error("Failed to load sample image:", err);
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#071d13';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#fee101';
      ctx.beginPath();
      ctx.arc(150, 150, 80, 0, Math.PI * 2);
      ctx.fill();
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(dataUrl);
      const blob = await (await fetch(dataUrl)).blob();
      setSelectedImage(new File([blob], 'sample.jpg', { type: 'image/jpeg' }));
    }
  };

  const startWebcam = async () => {
    setIsWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access was not granted or is unavailable on this device.");
      setIsWebcamActive(false);
    }
  };

  const captureWebcam = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setPreviewUrl(dataUrl);
    
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        setSelectedImage(new File([blob], 'webcam_capture.jpg', { type: 'image/jpeg' }));
        setIsWebcamActive(false);
      });
  };

  const handleLaunch = () => {
    if (!selectedImage && !previewUrl) return;
    onStartPipeline({
      file: selectedImage,
      imageBase64: previewUrl,
      searchQuery: searchQuery
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-[#145334]">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#0b6839]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#fee101] bg-[#071d13] px-3 py-1 rounded-full border border-[#fee101]/30">
              Stage 1 / 3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Face Scan & Biometric Identification
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mt-1">
              Upload a face image or capture via webcam. The system detects landmarks, generates a 128D biometric matrix, and computes an immutable SHA-256 fingerprint.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="w-full md:w-auto">
            <div className="text-xs font-mono text-[#fee101] mb-2 flex items-center space-x-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#fee101]" />
              <span>Quick Test Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="px-3 py-1.5 rounded-xl bg-[#071d13] hover:bg-[#0b6839] border border-[#145334] text-xs font-medium text-slate-200 transition-all flex items-center space-x-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#fee101]" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload / Camera Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Image Input Area */}
        <div className="md:col-span-7 glass-panel p-6 rounded-3xl flex flex-col justify-between border-[#145334]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#fee101]" />
                <span>Input Face Image</span>
              </h3>
              
              <div className="flex space-x-2">
                {!isWebcamActive ? (
                  <button
                    onClick={startWebcam}
                    className="px-3 py-1 rounded-lg bg-[#071d13] hover:bg-[#0b6839] border border-[#145334] text-xs text-slate-200 flex items-center space-x-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#fee101]" />
                    <span>Use Webcam</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsWebcamActive(false)}
                    className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Drop / Viewport Box */}
            <div className="relative rounded-2xl border-2 border-dashed border-[#145334] hover:border-[#fee101]/60 bg-[#071d13]/70 p-4 min-h-[260px] flex flex-col items-center justify-center transition-all overflow-hidden group">
              {isWebcamActive ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-60 object-cover rounded-xl border border-[#145334]"
                  />
                  <button
                    onClick={captureWebcam}
                    className="mt-4 px-5 py-2 rounded-xl bg-[#fee101] hover:bg-[#ffd000] text-black font-bold text-xs flex items-center space-x-2 shadow-lg shadow-[#fee101]/20"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Face Photo</span>
                  </button>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full flex flex-col items-center">
                  <img
                    src={faceData?.annotated_image || previewUrl}
                    alt="Face Preview"
                    className="max-h-64 object-contain rounded-xl border border-[#145334] shadow-2xl"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 text-xs text-slate-300 hover:text-[#fee101] flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change Image</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-center space-y-3 p-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#0b6839]/30 text-[#fee101] flex items-center justify-center mx-auto ring-1 ring-[#fee101]/30 group-hover:scale-105 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG, WEBP (Clear portrait photo)
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Optional Search Context */}
          <div className="mt-4 pt-4 border-t border-[#145334]">
            <label className="text-xs font-mono text-slate-300 block mb-1.5 font-semibold">
              Optional Context / Search Keyword:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. vitalik, developer, tech founder, photographer..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#071d13] border border-[#145334] text-xs text-white focus:outline-none focus:border-[#fee101] placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Column: Real-time Biometrics & Action */}
        <div className="md:col-span-5 glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4 border-[#145334]">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2 mb-3">
              <Eye className="w-4 h-4 text-[#fee101]" />
              <span>Biometric Telemetry</span>
            </h3>

            {faceData ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#071d13] border border-[#145334]">
                  <span className="text-slate-400 text-[10px] block font-bold">DETECTED FACES</span>
                  <span className="text-[#fee101] font-bold text-sm">
                    {faceData.total_faces} Face(s) Identified
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#071d13] border border-[#145334]">
                  <span className="text-slate-400 text-[10px] block font-bold">PRIMARY FACE SHA-256</span>
                  <span className="text-slate-200 break-all text-[11px]">
                    {faceData.primary_face_hash}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#071d13] border border-[#145334] flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">VECTOR MATRIX</span>
                    <span className="text-slate-200">128-D Spatial Descriptor</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#0b6839] border border-[#fee101]/40 text-[#fee101] font-bold text-[10px]">
                    ENCODED
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#071d13]/70 border border-[#145334] text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#0b6839] mx-auto" />
                <p className="text-xs text-slate-300">
                  Ready to detect face features, landmarks, and extract vector representation.
                </p>
              </div>
            )}
          </div>

          {/* Execute Pipeline Action Button */}
          <button
            onClick={handleLaunch}
            disabled={(!previewUrl && !selectedImage) || isProcessing}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl ${
              (!previewUrl && !selectedImage) || isProcessing
                ? 'bg-[#071d13] text-slate-600 border border-[#145334] cursor-not-allowed'
                : 'bg-[#fee101] hover:bg-[#ffd000] text-black shadow-[#fee101]/20 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <span>Run End-to-End Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
