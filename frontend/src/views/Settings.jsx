import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Button, PageHeader, Toast } from "../components/common";
import { Globe, BellRing, Settings2, Sliders, ShieldCheck, Database } from "lucide-react";

export const Settings = () => {
  const { language, setLanguage, t, updateFarmerProfile } = useApp();

  const [toast, setToast] = useState(null);
  
  // Settings Form values
  const [tempUnit, setTempUnit] = useState("c"); // c, f
  const [areaUnit, setAreaUnit] = useState("acres"); // acres, hectares
  
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifPest, setNotifPest] = useState(true);
  const [notifMarket, setNotifMarket] = useState(true);
  const [notifSchemes, setNotifSchemes] = useState(false);

  const handleLanguageChange = async (langCode) => {
    setLanguage(langCode);
    // Persist to mock profile context
    await updateFarmerProfile({ language: langCode });
    setToast({ type: "success", message: `System language set to: ${langCode === "en" ? "English" : langCode === "gu" ? "ગુજરાતી" : "हिन्दी"}` });
  };

  const handleSaveSettings = () => {
    setToast({ type: "success", message: "Application parameters saved successfully." });
  };

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("settings")}
        subtitle="Manage localized configurations. Customize translation languages, temperature formats, and alert push subscriptions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: GLOBAL PREFERENCES (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* A. i18n LANGUAGE CHANGER */}
          <Card className="flex flex-col gap-5">
            <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3.5 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-800 shrink-0" />
              {t("language")} Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  language === "en"
                    ? "border-primary-800 bg-primary-50/20 text-primary-900 font-extrabold"
                    : "border-border-soft bg-white text-text-muted hover:border-primary-200"
                }`}
              >
                <span className="text-sm">English</span>
                <span className="text-[10px] text-text-muted font-semibold uppercase">US Format</span>
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange("gu")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  language === "gu"
                    ? "border-primary-800 bg-primary-50/20 text-primary-900 font-extrabold"
                    : "border-border-soft bg-white text-text-muted hover:border-primary-200"
                }`}
              >
                <span className="text-sm">ગુજરાતી</span>
                <span className="text-[10px] text-text-muted font-semibold uppercase">Gujarati</span>
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange("hi")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  language === "hi"
                    ? "border-primary-800 bg-primary-50/20 text-primary-900 font-extrabold"
                    : "border-border-soft bg-white text-text-muted hover:border-primary-200"
                }`}
              >
                <span className="text-sm">हिन्दी</span>
                <span className="text-[10px] text-text-muted font-semibold uppercase">Hindi</span>
              </button>
            </div>
          </Card>

          {/* B. REGIONAL UNIT PARAMETERS */}
          <Card className="flex flex-col gap-4">
            <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3.5 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary-800 shrink-0" />
              Agronomic Units & Measures
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-text-muted">
              {/* Temp Unit */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-text-muted">Temperature Unit</span>
                <div className="flex bg-surface-soft p-1 rounded-lg border border-border-soft max-w-xs">
                  <button
                    type="button"
                    onClick={() => setTempUnit("c")}
                    className={`flex-1 py-1.5 rounded text-center cursor-pointer transition-all ${
                      tempUnit === "c" ? "bg-white text-primary-800 shadow-2xs font-extrabold" : ""
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnit("f")}
                    className={`flex-1 py-1.5 rounded text-center cursor-pointer transition-all ${
                      tempUnit === "f" ? "bg-white text-primary-800 shadow-2xs font-extrabold" : ""
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Area Unit */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-text-muted">Land Area Measurement</span>
                <div className="flex bg-surface-soft p-1 rounded-lg border border-border-soft max-w-xs">
                  <button
                    type="button"
                    onClick={() => setAreaUnit("acres")}
                    className={`flex-1 py-1.5 rounded text-center cursor-pointer transition-all ${
                      areaUnit === "acres" ? "bg-white text-primary-800 shadow-2xs font-extrabold" : ""
                    }`}
                  >
                    Acres
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaUnit("hectares")}
                    className={`flex-1 py-1.5 rounded text-center cursor-pointer transition-all ${
                      areaUnit === "hectares" ? "bg-white text-primary-800 shadow-2xs font-extrabold" : ""
                    }`}
                  >
                    Hectares
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* C. PUSH SUBSCRIPTIONS */}
          <Card className="flex flex-col gap-4">
            <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3.5 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-primary-800 shrink-0" />
              Ecosystem Push Subscriptions
            </h4>
            
            <div className="divide-y divide-border-soft/60">
              
              <div className="py-3.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-dark font-bold text-sm">Weather Alerts</span>
                  <span className="text-text-muted font-medium">Push lightning strikes and rainfall alerts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifWeather}
                  onChange={(e) => setNotifWeather(e.target.checked)}
                  className="w-4 h-4 text-primary-800 border-border-soft rounded focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="py-3.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-dark font-bold text-sm">Pest & Deficiencies Warnings</span>
                  <span className="text-text-muted font-medium">Alerts on regional insect and crop disease threats.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPest}
                  onChange={(e) => setNotifPest(e.target.checked)}
                  className="w-4 h-4 text-primary-800 border-border-soft rounded focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="py-3.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-dark font-bold text-sm">APMC Market Rate Peaks</span>
                  <span className="text-text-muted font-medium">Trigger warning when watchlisted crops spike &gt;10%.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifMarket}
                  onChange={(e) => setNotifMarket(e.target.checked)}
                  className="w-4 h-4 text-primary-800 border-border-soft rounded focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="py-3.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-dark font-bold text-sm">Government Scheme Deadlines</span>
                  <span className="text-text-muted font-medium">Alerts when eligibility check deadlines approach.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifSchemes}
                  onChange={(e) => setNotifSchemes(e.target.checked)}
                  className="w-4 h-4 text-primary-800 border-border-soft rounded focus:ring-primary-500 cursor-pointer"
                />
              </div>

            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={handleSaveSettings}>
              {t("saveChanges")}
            </Button>
          </div>

        </div>

        {/* RIGHT COLUMN: SECURITY & ACCOUNT MOCKS (1/3 width) */}
        <div className="space-y-6">
          <Card className="flex flex-col gap-4">
            <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-primary-800 shrink-0" />
              Privacy & Access
            </h4>
            
            <div className="space-y-3.5 text-xs font-semibold text-text-muted leading-relaxed">
              <p className="font-medium">
                Your land location, crops, and soil health databases are saved locally. Cloud synchronizations require permission settings.
              </p>
              
              <div className="flex flex-col gap-2.5 pt-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Database className="w-4 h-4 text-text-muted" />
                  Backup Local Data
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:bg-red-50">
                  Delete Agriculture Account
                </Button>
              </div>
            </div>
          </Card>
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
export default Settings;
