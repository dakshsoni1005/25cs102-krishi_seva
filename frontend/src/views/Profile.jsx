import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Button, Input, Select, PageHeader, Toast } from "../components/common";
import { User, MapPin, Sprout, Award, Save, RefreshCw } from "lucide-react";

export const Profile = () => {
  const { farmer, t, updateFarmerProfile, addLocalNotification } = useApp();

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form States initialized with farmer context
  const [fullName, setFullName] = useState(farmer?.fullName || "");
  const [mobileNumber, setMobileNumber] = useState(farmer?.mobileNumber || "");
  const [email, setEmail] = useState(farmer?.email || "");
  const [language, setLanguage] = useState(farmer?.language || "en");
  
  const [state, setState] = useState(farmer?.state || "Gujarat");
  const [district, setDistrict] = useState(farmer?.district || "");
  const [taluka, setTaluka] = useState(farmer?.taluka || "");
  const [village, setVillage] = useState(farmer?.village || "");
  
  const [farmSize, setFarmSize] = useState(farmer?.farmSize || "");
  const [mainCrop, setMainCrop] = useState(farmer?.mainCrop || "Cotton");
  const [irrigationType, setIrrigationType] = useState(farmer?.irrigationType || "Drip Irrigation");

  const cropOptions = [
    { value: "Cotton", label: "Cotton (કપાસ)" },
    { value: "Groundnut", label: "Groundnut (મગફળી)" },
    { value: "Wheat", label: "Wheat (ઘઉં)" },
    { value: "Castor", label: "Castor (દિવેલા)" },
    { value: "Bajra", label: "Bajra (બાજરી)" },
    { value: "Paddy", label: "Paddy (ડાંગર)" }
  ];

  const irrigationOptions = [
    { value: "Drip Irrigation", label: "Drip Irrigation (ટપક પદ્ધતિ)" },
    { value: "Sprinkler Irrigation", label: "Sprinkler Irrigation (ફુવારા પદ્ધતિ)" },
    { value: "Flood Irrigation", label: "Flood Irrigation (ધોરીયા પદ્ધતિ)" },
    { value: "Rainfed", label: "Rainfed (વરસાદ આધારિત)" }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = {
        fullName,
        mobileNumber,
        email,
        language,
        state,
        district,
        taluka,
        village,
        farmSize: parseFloat(farmSize) || 5.0,
        mainCrop,
        irrigationType,
        profileCompletion: 100 // completed edit
      };

      await updateFarmerProfile(updated);
      setToast({ type: "success", message: "Profile context saved. Syncing recommendations..." });
      
      addLocalNotification(
        "Profile Context Saved",
        "Your farm intelligence settings were updated. recommendations have re-aligned.",
        "AI Recommendation",
        "info"
      );
    } catch (err) {
      setToast({ type: "error", message: "Failed to save profile details." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("profile")}
        subtitle="Manage secure agronomy profile credentials. These parameters act as the shared context filtering soil, schemes, and water advisors."
      />

      <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: COMPLETION DIAL & CONTEXT SUMMARY (1/3 width) */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center p-6 bg-white border border-border-soft">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              Profile Completeness
            </span>
            
            {/* Completion Percentage dial */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" className="stroke-surface-soft stroke-8 fill-none" />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-primary-850 stroke-8 fill-none transition-all duration-500"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - (farmer?.profileCompletion || 85) / 100)}
                />
              </svg>
              <span className="absolute text-2xl font-black text-text-dark">{farmer?.profileCompletion || 85}%</span>
            </div>

            <h3 className="font-extrabold text-lg text-text-dark mt-4">{farmer?.fullName}</h3>
            <p className="text-xs text-text-muted font-semibold mt-1">Farming since {farmer?.farmingSince || "2010"}</p>
            
            <div className="w-full border-t border-border-soft/60 mt-4 pt-4 text-xs font-semibold text-text-muted space-y-2">
              <div className="flex justify-between">
                <span>Soil type:</span>
                <span className="text-text-dark font-extrabold">{farmer?.soilHealthScore ? "Medium Black Clay" : "Goradu"}</span>
              </div>
              <div className="flex justify-between">
                <span>Soil Health:</span>
                <span className="text-primary-800 font-extrabold">{farmer?.soilHealthScore || 78}/100</span>
              </div>
            </div>
          </Card>

          <Card className="bg-primary-900 text-white border-0 p-5 flex items-start gap-3">
            <Award className="w-6 h-6 text-accent-300 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold leading-relaxed">
              <span className="font-extrabold text-accent-300 uppercase tracking-wider block mb-1">Ecosystem Context Integration</span>
              Your farm details directly shape your experience. Changing your <b>Main Crop</b> or <b>Irrigation Type</b> here instantly updates the smart advisories in the **Smart Krishi** section.
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: DETAILED EDIT FORM (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="bg-white border border-border-soft p-6 flex flex-col gap-6">
            
            {/* A. PERSONAL DETAILS */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-2 flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="profName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Mobile Number"
                  id="profMobile"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  id="profEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <Select
                  label="Language preference"
                  id="profLang"
                  options={[
                    { value: "en", label: "English" },
                    { value: "gu", label: "ગુજરાતી (Gujarati)" },
                    { value: "hi", label: "हिन्दी (Hindi)" }
                  ]}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
            </div>

            {/* B. GEOGRAPHIC COORDINATES */}
            <div className="space-y-4 border-t border-border-soft/60 pt-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-2 flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Geographic Location
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  id="profState"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <Input
                  label="District"
                  id="profDistrict"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Taluka"
                  id="profTaluka"
                  required
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                />
                <Input
                  label="Village"
                  id="profVillage"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>
            </div>

            {/* C. FARM PARAMETERS */}
            <div className="space-y-4 border-t border-border-soft/60 pt-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-2 flex items-center gap-2">
                <Sprout className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Farming Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Farm Size (Acres)"
                  id="profSize"
                  type="number"
                  step="0.1"
                  required
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                />

                <Select
                  label="Main Crop"
                  id="profCrop"
                  options={cropOptions}
                  value={mainCrop}
                  onChange={(e) => setMainCrop(e.target.value)}
                />

                <Select
                  label="Irrigation Type"
                  id="profIrrig"
                  options={irrigationOptions}
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border-soft mt-2">
              <Button type="submit" disabled={loading} icon={Save}>
                {loading ? "Saving context..." : "Save Profile Context"}
              </Button>
            </div>

          </Card>

        </div>

      </form>

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
export default Profile;
