import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button, Card, Badge, PageHeader, Toast } from "../components/common";
import { UploadCloud, Camera, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { pestScannerService } from "../services/pestScannerService";

export const PestScanner = () => {
  const { t, addLocalNotification } = useApp();

  // Scanner Steps: 'idle', 'uploading', 'scanning', 'result'
  const [step, setStep] = useState("idle");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [diagnostics, setDiagnostics] = useState(null);
  const [toast, setToast] = useState(null);
  
  const fileInputRef = useRef(null);

  // Mock Leaf Images for Demo
  const mockLeafImages = [
    { name: "cotton_aphids.jpg", label: "Bt Cotton Leaf (Aphid infestation)", url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400" },
    { name: "early_blight.jpg", label: "Tomato Leaf (Early Blight spot)", url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400" },
    { name: "leaf_blight.jpg", label: "Generic Leaf (Unknown Spots)", url: "https://images.unsplash.com/photo-1587334206586-cf5ff9b97d26?auto=format&fit=crop&q=80&w=400" }
  ];

  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setStep("ready");
    };
    reader.readAsDataURL(file);
  };

  const selectMockLeaf = (mockLeaf) => {
    setSelectedFile({ name: mockLeaf.name });
    setImagePreview(mockLeaf.url);
    setStep("ready");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    } else {
      setToast({ type: "error", message: "Please drop a valid leaf image file." });
    }
  };

  const triggerScan = async () => {
    if (!selectedFile) return;
    setStep("scanning");
    
    try {
      const res = await pestScannerService.scanLeafImage(selectedFile);
      setDiagnostics(res.result);
      setStep("result");
      
      addLocalNotification(
        "Leaf Scan Completed",
        `Scanner identified ${res.result.name} on leaf sample.`,
        "Pest",
        res.result.severity === "High" ? "high" : "medium"
      );
    } catch (error) {
      setToast({ type: "error", message: "Leaf analysis failed. Try again." });
      setStep("ready");
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setImagePreview("");
    setDiagnostics(null);
    setStep("idle");
  };

  const severityBadgeVariant = (severity) => {
    if (severity === "High" || severity === "Severe") return "danger";
    if (severity === "Moderate") return "warning";
    return "success";
  };

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("pestScanner")}
        subtitle="Instant leaf diagnostic utility. Take or upload a photo of infected leaves to detect fungi, pests, and deficiencies."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* SCANNING CONTROL CONTAINER (Left/Center columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* IDLE OR READY TO SCAN SCREEN */}
          {step !== "scanning" && step !== "result" && (
            <Card className="flex flex-col gap-6 items-center text-center p-8 bg-white border border-border-soft">
              
              {/* Image Preview Box or DND Zone */}
              {imagePreview ? (
                <div className="relative w-64 h-64 rounded-xl border border-border-soft bg-surface-soft overflow-hidden shadow-inner group">
                  <img
                    src={imagePreview}
                    alt="Leaf Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="outline" size="sm" className="bg-white text-text-dark" onClick={resetScanner}>
                      Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[250px] border-2 border-dashed border-border-soft hover:border-primary-600 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer bg-bg-warm/50 hover:bg-primary-50/10 group transition-all duration-200"
                >
                  <div className="p-4 bg-primary-50 group-hover:bg-primary-100 text-primary-800 rounded-full mb-4 transition-colors">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-base text-text-dark">Drag & Drop Leaf Photo Here</h3>
                  <p className="text-xs text-text-muted mt-1.5 font-semibold">
                    Supports JPG, PNG formats. Or click to select from local camera roll.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full max-w-sm flex flex-col sm:flex-row gap-3">
                {!imagePreview ? (
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    icon={Camera}
                  >
                    Use Device Camera
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetScanner}
                      icon={RefreshCw}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1 font-bold"
                      onClick={triggerScan}
                    >
                      Analyze Leaf
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* SCANNING RUNNING SCREEN */}
          {step === "scanning" && (
            <Card className="flex flex-col gap-6 items-center text-center p-12 bg-white border border-border-soft relative overflow-hidden">
              {/* Scan Overlay Effect */}
              <div className="relative w-64 h-64 rounded-xl border border-border-soft bg-surface-soft overflow-hidden shadow-md">
                <img
                  src={imagePreview}
                  alt="Scanning Leaf"
                  className="w-full h-full object-cover filter brightness-75"
                />
                {/* Horizontal Laser Shimmer Bar */}
                <div className="absolute left-0 right-0 h-1 bg-accent-400 shadow-[0_0_15px_#22c55e] animate-bounce top-1/2" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
                <h3 className="font-extrabold text-lg text-text-dark mt-2">AI Diagnostic Analysis Running...</h3>
                <p className="text-xs text-text-muted font-semibold max-w-xs">
                  Evaluating leaf pigmentation patterns and searching for fungal spore textures against crop database.
                </p>
              </div>
            </Card>
          )}

          {/* DIAGNOSTIC RESULTS REPORT */}
          {step === "result" && diagnostics && (
            <Card className="bg-white border border-border-soft p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
              
              {/* Header result values */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-soft pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-16 h-16 rounded-xl border border-border-soft overflow-hidden shrink-0">
                    <img src={imagePreview} alt="Target leaf" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary-800 uppercase tracking-wider">Analysis Result</span>
                    <h3 className="font-black text-xl text-text-dark mt-0.5 leading-tight">{diagnostics.name}</h3>
                    <span className="text-xs text-text-muted mt-1 font-semibold">Affected Crop: <b>{diagnostics.affectedCrop}</b></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <div className="flex flex-col items-end">
                    <Badge variant={severityBadgeVariant(diagnostics.severity)}>
                      Severity: {diagnostics.severity}
                    </Badge>
                    <span className="text-[10px] font-bold text-text-muted mt-1.5">{diagnostics.confidence}% Match Confidence</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic detail splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Left col: symptoms & causes */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-text-dark uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      Observed Symptoms
                    </h4>
                    <ul className="list-disc pl-4 space-y-1.5 text-text-muted font-medium leading-relaxed">
                      {diagnostics.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-border-soft/60 pt-4">
                    <h4 className="font-bold text-text-dark uppercase tracking-wider text-[10px]">Possible Cause</h4>
                    <p className="text-text-muted leading-relaxed font-medium">
                      {diagnostics.possibleCause}
                    </p>
                  </div>
                </div>

                {/* Right col: Treatment & organic controls */}
                <div className="space-y-4 bg-surface-soft/40 border border-border-soft/60 rounded-xl p-4">
                  <h4 className="font-bold text-primary-900 uppercase tracking-wider text-[10px] border-b border-border-soft pb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                    Recommended Advisory Treatment
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="font-bold text-text-dark text-[10px] uppercase">Chemical Control:</span>
                      <p className="text-text-muted leading-relaxed font-medium">{diagnostics.treatment.chemical}</p>
                    </div>
                    
                    <div className="space-y-1 border-t border-border-soft/60 pt-2.5">
                      <span className="font-bold text-emerald-800 text-[10px] uppercase">Organic Control:</span>
                      <p className="text-emerald-800 leading-relaxed font-semibold">{diagnostics.treatment.organic}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Prevention metrics */}
              <div className="border-t border-border-soft pt-5 space-y-2 text-xs">
                <h4 className="font-bold text-text-dark uppercase tracking-wider text-[10px]">Long-Term Prevention Strategy</h4>
                <ul className="list-decimal pl-4 space-y-1 text-text-muted font-medium leading-relaxed">
                  {diagnostics.prevention.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>

              {/* Action resets */}
              <div className="flex justify-end border-t border-border-soft pt-4 mt-2">
                <Button variant="primary" onClick={resetScanner}>
                  Scan Another Leaf
                </Button>
              </div>

            </Card>
          )}

        </div>

        {/* DEMO SIDEBAR SELECTOR (1/3 width on Desktop) */}
        <div className="space-y-6">
          <Card className="flex flex-col gap-4 bg-primary-900 text-white border-0">
            <h4 className="font-bold text-base flex items-center gap-2 text-accent-300">
              <Camera className="w-5 h-5 shrink-0" />
              Demo Mock Leaf Library
            </h4>
            <p className="text-xs text-primary-100 leading-relaxed font-medium">
              Since this is the <b>FRONTEND PHASE ONLY</b>, you can select one of these mock leaf templates to load and test diagnostic scan resolutions.
            </p>
            
            <div className="flex flex-col gap-2.5 pt-2">
              {mockLeafImages.map((leaf, idx) => (
                <button
                  key={idx}
                  onClick={() => selectMockLeaf(leaf)}
                  className="w-full text-left p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/15">
                    <img src={leaf.url} alt={leaf.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate group-hover:text-accent-300 transition-colors">{leaf.label}</div>
                    <div className="text-[10px] text-primary-200 mt-0.5">{leaf.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
          
          <div className="flex items-start gap-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-xl p-4 text-xs leading-relaxed font-semibold">
            <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <b>Integrations Contract note:</b> This component consumes `pestScannerService.js`. When ML servers are ready later, this service will submit image binaries to `api.js` for MobileNetV2 prediction endpoints.
            </div>
          </div>
        </div>

      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};
export default PestScanner;
