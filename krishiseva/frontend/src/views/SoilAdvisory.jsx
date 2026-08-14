import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, PageHeader, Select, Button, Toast, EmptyState } from "../components/common";
import { Sprout, BarChart3, MapPin, FlaskConical, Beaker } from "lucide-react";
import { soilService } from "../services/soilService";

export const SoilAdvisory = () => {
  const { t } = useApp();

  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("Central Gujarat");
  const [soilData, setSoilData] = useState(null);
  const [toast, setToast] = useState(null);

  const regionOptions = [
    { value: "Central Gujarat", label: "Central Gujarat (મધ્ય ગુજરાત)" },
    { value: "Saurashtra", label: "Saurashtra (સૌરાષ્ટ્ર)" },
    { value: "North Gujarat", label: "North Gujarat (ઉત્તર ગુજરાત)" },
    { value: "South Gujarat", label: "South Gujarat (દક્ષિણ ગુજરાત)" },
    { value: "Kachchh", label: "Kachchh (કચ્છ)" }
  ];

  const fetchSoil = async () => {
    try {
      setLoading(true);
      const res = await soilService.getSoilByRegion(selectedRegion);
      setSoilData(res);
    } catch (error) {
      setToast({ type: "error", message: "Failed to fetch soil data for selected region." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoil();
  }, [selectedRegion]);

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("soilAdvisory")}
        subtitle="Live soil health diagnostics. Analyze chemical parameters, track nitrogen deficiencies, and review crop suitability metrics."
      />

      {/* 1. REGION SELECTOR */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-soft p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-lg shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Region Selection</span>
            <span className="text-sm font-bold text-text-dark">Currently showing soil test profiles for: <b>{selectedRegion}</b></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Select
            id="regionSelect"
            options={regionOptions}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full sm:w-60"
          />
          <Button variant="outline" size="sm" onClick={fetchSoil} icon={FlaskConical}>
            Refresh Soil Report
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2"><Card><div className="h-64 bg-surface-soft animate-shimmer rounded-xl" /></Card></div>
          <div><Card><div className="h-64 bg-surface-soft animate-shimmer rounded-xl" /></Card></div>
        </div>
      ) : !soilData ? (
        <EmptyState
          title="No Soil Profile Available"
          description="No official soil test parameters have been logged for this region yet."
          actionLabel="Refresh Region Data"
          onAction={fetchSoil}
          icon={FlaskConical}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
          
          {/* LEFT & CENTER COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SOIL HEALTH CARD */}
            <Card className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 border-0 text-white relative overflow-hidden p-6 shadow-md">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-accent-300/5 rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-primary-750 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-accent-300" />
                  <span className="text-xs font-bold text-primary-200 uppercase tracking-widest">Official Soil Health Card</span>
                </div>
                <Badge className="bg-primary-950 text-accent-300 border-primary-800 font-extrabold">
                  Score: {soilData.healthScore}/100
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-primary-200 uppercase font-bold tracking-wider">Soil Structure</span>
                  <span className="text-sm font-extrabold mt-1 text-white truncate">{soilData.type}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] text-primary-200 uppercase font-bold tracking-wider">Acidic/Alkaline pH</span>
                  <span className="text-sm font-extrabold mt-1 text-white">{soilData.ph}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-primary-200 uppercase font-bold tracking-wider">Average Moisture</span>
                  <span className="text-sm font-extrabold mt-1 text-white">{soilData.moisture}% Moisture</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-primary-200 uppercase font-bold tracking-wider">Region Zone</span>
                  <span className="text-sm font-extrabold mt-1 text-white truncate">
                    {selectedRegion}
                  </span>
                </div>
              </div>
            </Card>

            {/* CHEMICAL NPK NUTRIENTS PANEL */}
            <Card className="flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-border-soft pb-3.5">
                <BarChart3 className="w-5 h-5 text-primary-800 shrink-0" />
                <h3 className="font-extrabold text-base text-text-dark leading-none">Chemical Nutrient Parameters</h3>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                {Object.entries(soilData.nutrients || {}).map(([key, nut]) => {
                  const labelMap = { nitrogen: "Nitrogen (N) - Leaf development", phosphorus: "Phosphorus (P) - Root growth", potassium: "Potassium (K) - Disease resistance", organicCarbon: "Organic Carbon (OC) - Soil biology" };
                  const unitMap = { nitrogen: "kg/ha", phosphorus: "kg/ha", potassium: "kg/ha", organicCarbon: "%" };
                  
                  const statusColors = {
                    Low: "bg-rose-500",
                    Medium: "bg-amber-500",
                    High: "bg-emerald-600"
                  };

                  const widthMap = { Low: "w-1/3", Medium: "w-2/3", High: "w-full" };

                  return (
                    <div key={key} className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="w-52 shrink-0 flex flex-col">
                        <span className="text-text-dark font-bold leading-tight">{labelMap[key]}</span>
                        <span className="text-[10px] text-text-muted mt-0.5 font-normal">Ideal limit: {nut.ideal}</span>
                      </div>
                      
                      <div className="flex-1 h-3 bg-surface-soft border border-border-soft/60 rounded-full overflow-hidden relative">
                        <div className={`h-full ${statusColors[nut.status]} ${widthMap[nut.status]} transition-all duration-300`} />
                      </div>
                      
                      <div className="w-24 shrink-0 text-right flex flex-col">
                        <span className="text-text-dark font-extrabold">{nut.value} {unitMap[key]}</span>
                        <span className={`text-[10px] font-bold ${nut.status === "Low" ? "text-rose-600" : nut.status === "High" ? "text-emerald-600" : "text-amber-600"}`}>
                          {nut.status} Status
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* CROP SUITABILITY MATRIX */}
            <Card className="flex flex-col gap-4">
              <h3 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3.5">
                Dynamic Crop Compatibility Matrix
              </h3>
              
              <div className="divide-y divide-border-soft/60">
                {(soilData.recommendedCrops || []).map((crop, idx) => (
                  <div key={idx} className="py-3.5 flex flex-col md:flex-row justify-between gap-2.5 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-text-dark text-sm">{crop.name}</span>
                      <span className="text-text-muted font-medium leading-relaxed">{crop.reason}</span>
                    </div>
                    <div className="shrink-0 flex items-center md:self-center gap-3">
                      <span className="text-[10px] font-bold text-text-muted">Compatibility:</span>
                      <span className="bg-primary-100 text-primary-800 font-extrabold px-2.5 py-1 rounded border border-primary-200">
                        {crop.suitability}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* RECOMMENDED FERTILIZERS */}
            <Card className="flex flex-col gap-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3 flex items-center gap-2">
                <FlaskConical className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Fertilization Schedule Advice
              </h4>
              
              <div className="space-y-4">
                {(soilData.recommendedFertilizers || []).map((fert, idx) => (
                  <div key={idx} className="bg-surface-soft/40 border border-border-soft/60 rounded-xl p-3.5 flex flex-col gap-1 text-xs">
                    <span className="font-extrabold text-primary-900">{fert.name}</span>
                    <span className="font-bold text-text-dark mt-1">Dosage: <span className="text-text-muted font-semibold">{fert.dosage}</span></span>
                    <span className="font-bold text-text-dark">Timing: <span className="text-text-muted font-semibold leading-relaxed">{fert.timing}</span></span>
                  </div>
                ))}
              </div>
            </Card>

            {/* SOIL IMPROVEMENT GUIDELINES */}
            <Card className="flex flex-col gap-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3 flex items-center gap-2">
                <Sprout className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Soil Improvement Guidelines
              </h4>
              
              <ul className="list-disc pl-4 space-y-3 text-xs text-text-muted font-medium leading-relaxed">
                {(soilData.suggestions || []).map((s, idx) => (
                  <li key={idx} className="marker:text-primary-800">
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

          </div>

        </div>
      )}

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
export default SoilAdvisory;
