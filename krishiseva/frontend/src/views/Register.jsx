import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button, Card, Input, Select, Toast } from "../components/common";
import { UserCheck } from "lucide-react";

export const Register = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();

  // Wizard state: Step 1 (Personal & Location), Step 2 (Optional Farming Details)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("Gujarat");
  const [district, setDistrict] = useState("Anand");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  
  // Optional Farming Info
  const [farmSize, setFarmSize] = useState("");
  const [mainCrop, setMainCrop] = useState("Cotton");
  const [irrigationType, setIrrigationType] = useState("Drip Irrigation");

  const cropOptions = [
    { value: "Cotton", label: "Cotton (કપાસ)" },
    { value: "Groundnut", label: "Groundnut (મગફળી)" },
    { value: "Wheat", label: "Wheat (ઘઉં)" },
    { value: "Castor", label: "Castor (દિવેલા)" },
    { value: "Bajra", label: "Bajra (બાજરી)" },
    { value: "Paddy", label: "Paddy (ડાંગર)" },
    { value: "Mustard", label: "Mustard (રાઈ)" },
    { value: "Sesame", label: "Sesame (તલ)" }
  ];

  const irrigationOptions = [
    { value: "Drip Irrigation", label: "Drip Irrigation (ટપક પદ્ધતિ)" },
    { value: "Sprinkler Irrigation", label: "Sprinkler Irrigation (ફુવારા પદ્ધતિ)" },
    { value: "Flood Irrigation", label: "Flood Irrigation (ધોરીયા પદ્ધતિ)" },
    { value: "Rainfed", label: "Rainfed (વરસાદ આધારિત)" }
  ];

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!fullName || !mobileNumber || !password || !state || !district || !taluka || !village) {
      setToast({ type: "error", message: "Please fill in all required registration fields." });
      return;
    }
    if (mobileNumber.length !== 10) {
      setToast({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    setStep(2);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        fullName,
        mobileNumber,
        email,
        password,
        state,
        district,
        taluka,
        village,
        farmSize: farmSize || "5.0",
        mainCrop,
        irrigationType
      };

      await registerUser(data);
      setToast({ type: "success", message: "Registration successful! Welcome to KrishiSeva." });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-warm flex items-center justify-center p-4">
      <div className="max-w-lg w-full flex flex-col gap-6">
        
        {/* Title Logo */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-black tracking-tight text-primary-800 flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full bg-accent-500 inline-block animate-pulse" />
            KRISHISEVA
          </Link>
          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mt-2">
            Register Your Smarter Farm Profile
          </p>
        </div>

        {/* Wizard Form Card */}
        <Card className="shadow-md border border-border-soft p-6 md:p-8 bg-white">
          <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-6 text-xs font-semibold text-text-muted">
            <span className={`pb-1 border-b-2 uppercase tracking-wider ${step === 1 ? "border-primary-800 text-primary-800" : "border-transparent text-primary-800/60"}`}>
              1. Profile Info
            </span>
            <span className={`pb-1 border-b-2 uppercase tracking-wider ${step === 2 ? "border-primary-800 text-primary-800" : "border-transparent"}`}>
              2. Farming Info (Optional)
            </span>
          </div>

          {/* STEP 1: PERSONAL & GEOGRAPHIC INFO */}
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="fullName"
                  placeholder="Enter full name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                
                <Input
                  label="Mobile Number"
                  id="regMobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email (Optional)"
                  id="email"
                  type="email"
                  placeholder="farmer@farm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Account Password"
                  id="regPassword"
                  type="password"
                  placeholder="Create secure password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="border-t border-border-soft/60 my-2 pt-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Geographic Registration Context
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  id="state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <Input
                  label="District"
                  id="district"
                  placeholder="e.g. Anand"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Taluka"
                  id="taluka"
                  placeholder="e.g. Anand"
                  required
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                />
                <Input
                  label="Village"
                  id="village"
                  placeholder="e.g. Hadgud"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full mt-4">
                Continue to Farm Details
              </Button>
            </form>
          ) : (
            /* STEP 2: OPTIONAL FARMING DETAILS */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <Input
                label="Farm Size (in Acres)"
                id="farmSize"
                type="number"
                step="0.1"
                placeholder="e.g. 12.5"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
              />

              <Select
                label="Main Crop Grown"
                id="mainCrop"
                options={cropOptions}
                value={mainCrop}
                onChange={(e) => setMainCrop(e.target.value)}
              />

              <Select
                label="Irrigation System Type"
                id="irrigationType"
                options={irrigationOptions}
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
              />

              <div className="flex gap-3 mt-6 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 font-bold"
                  disabled={loading}
                  icon={UserCheck}
                >
                  {loading ? "Registering..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Footer Prompt */}
        <div className="text-center text-xs font-semibold text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-800 hover:underline">
            Log In
          </Link>
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
export default Register;
