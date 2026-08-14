import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Card,
  Button,
  RecommendationCard,
  LoadingSkeleton,
  EmptyState,
  PageHeader
} from "../components/common";
import {
  Cpu,
  SlidersHorizontal,
  Info,
  RefreshCw,
  MapPin,
  Sprout,
  Sun
} from "lucide-react";
import { smartKrishiService } from "../services/smartKrishiService";
import {
  AIRecommendationCard,
  SoilSuitabilityWarningCard,
  SoilCard,
  WeatherCard,
  ForecastCard,
  FertilizerCard,
  IrrigationCard,
  DiseaseCard,
  PestCard,
  AdvisoryCard
} from "../components/smart-krishi/SmartKrishiCards";

export const SmartKrishi = () => {
  const { farmer, t, addLocalNotification } = useApp();

  const [loading, setLoading] = useState(true);
  const [resultPayload, setResultPayload] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [suitabilityWarning, setSuitabilityWarning] = useState(null);
  const [pipelineSource, setPipelineSource] = useState("smart_krishi");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriority, setActivePriority] = useState("all");

  // Selection state parameters
  const [selectedDistrict, setSelectedDistrict] = useState(farmer?.district || "Rajkot");
  const [selectedCrop, setSelectedCrop] = useState(farmer?.mainCrop || "Cotton");
  const [selectedSeason, setSelectedSeason] = useState("Kharif");

  const districtsList = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
    "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
    "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ];
  const cropsList = ["Cotton", "Groundnut", "Wheat", "Bajra", "Paddy", "Castor", "Mustard", "Sesame", "Sugarcane", "Tobacco"];
  const seasonsList = ["Kharif", "Rabi", "Zaid"];

  const categories = [
    { id: "all", label: "All Advisors" },
    { id: "Irrigation", label: "Irrigation" },
    { id: "Fertilizer", label: "Fertilizers" },
    { id: "Pest", label: "Pest Control" },
    { id: "Weather", label: "Weather Warnings" },
    { id: "Market", label: "Market Timing" }
  ];

  const priorities = [
    { id: "all", label: "All Priorities" },
    { id: "HIGH", label: "High Priority" },
    { id: "MEDIUM", label: "Medium Priority" },
    { id: "LOW", label: "Low Priority" }
  ];

  const fetchPipelineRecs = async (overrideParams = {}) => {
    try {
      setLoading(true);
      setSuitabilityWarning(null);
      setResultPayload(null);

      const targetDistrict = overrideParams.district || selectedDistrict;
      const targetCrop = overrideParams.crop || selectedCrop;
      const targetSeason = overrideParams.season || selectedSeason;

      const payload = {
        district: targetDistrict,
        crop: targetCrop,
        season: targetSeason
      };

      const res = await smartKrishiService.getRecommendations(payload);

      if (res) {
        if (res.success === false || res.code === "CROP_NOT_SUITABLE") {
          setSuitabilityWarning({
            message: res.message || `Crop '${targetCrop}' is not suitable for ${targetDistrict}'s soil type.`,
            suggestion: res.suggestion,
            district: res.district || targetDistrict,
            soilType: res.soilType,
            recommendedCrops: res.recommendedCrops || []
          });
        } else {
          setResultPayload(res.data ? res : { data: res, recommendation: res.recommendation });
          setPipelineSource(res.source || "smart_krishi");

          // Extract array recs if present
          if (res.recommendations && Array.isArray(res.recommendations)) {
            setRecommendations(res.recommendations);
          } else if (res.data && Array.isArray(res.data.advisories)) {
            const formatted = res.data.advisories.map((a, idx) => ({
              id: `adv-${idx}`,
              category: a.type || "General",
              priority: a.level === "High" || a.level === "Critical" ? "HIGH" : "MEDIUM",
              title: `${a.type || "Smart Krishi"} Advisory`,
              explanation: a.message,
              reason: "Smart Krishi automated soil-weather pipeline evaluation.",
              action: "Apply advised agronomic precautions.",
              benefit: a.message,
              timestamp: new Date()
            }));
            setRecommendations(formatted);
          }
        }
      }
    } catch (err) {
      console.error("Smart Krishi advisory pipeline error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelineRecs();
  }, []);

  const handleResolveAction = (rec) => {
    addLocalNotification(
      "Recommendation Actioned",
      `Successfully registered action for: "${rec.title}".`,
      "AI Recommendation",
      "medium"
    );
    alert(`Action initiated: ${rec.action}\n\nExpected Benefit: ${rec.benefit}`);
  };

  const handleCropSwitch = (newCrop) => {
    setSelectedCrop(newCrop);
    fetchPipelineRecs({ crop: newCrop });
  };

  const filteredRecs = recommendations.filter((r) => {
    const catMatch = activeCategory === "all" || (r.category && r.category.toLowerCase().includes(activeCategory.toLowerCase()));
    const priMatch = activePriority === "all" || (r.priority && r.priority.toUpperCase() === activePriority.toUpperCase());
    return catMatch && priMatch;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Page Header */}
      <PageHeader
        title={t("smartKrishi")}
        subtitle="Central AI decision support intelligence compiling weather forecasting, soil parameters, and crop requirements into direct field operations."
      />

      {/* 1. SELECTION & PIPELINE CONTROLS BOARD */}
      <Card className="bg-white border border-border-soft p-5">
        <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-800 shrink-0" />
            <h3 className="font-extrabold text-base text-text-dark leading-none">Smart Krishi Decision Pipeline</h3>
          </div>

          <span className="text-[10px] bg-primary-50 text-primary-800 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-primary-200">
            Engine: {pipelineSource === "smart_krishi" ? "Smart Krishi Service" : "Gujarat Dataset Engine"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* District selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary-800" />
              Target District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-surface-soft border border-border-soft text-text-dark text-xs rounded-lg px-3 py-2 font-bold outline-hidden focus:border-primary-800"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Crop selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-primary-800" />
              Cultivated Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-surface-soft border border-border-soft text-text-dark text-xs rounded-lg px-3 py-2 font-bold outline-hidden focus:border-primary-800"
            >
              {cropsList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Season selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-primary-800" />
              Cropping Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-surface-soft border border-border-soft text-text-dark text-xs rounded-lg px-3 py-2 font-bold outline-hidden focus:border-primary-800"
            >
              {seasonsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Submit refresh button */}
          <Button
            onClick={() => fetchPipelineRecs()}
            disabled={loading}
            className="w-full h-[38px] flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Evaluate Pipeline
          </Button>
        </div>
      </Card>

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      )}

      {/* 3. SOIL SUITABILITY WARNING (IF INCOMPATIBLE) */}
      {!loading && suitabilityWarning && (
        <SoilSuitabilityWarningCard
          warning={suitabilityWarning}
          onSelectCrop={handleCropSwitch}
        />
      )}

      {/* 4. SMART KRISHI DATASET & AI RESULTS GRID */}
      {!loading && resultPayload && (
        <div className="space-y-6">
          {/* AI Recommendation Summary Card */}
          {resultPayload.recommendation && (
            <AIRecommendationCard recommendation={resultPayload.recommendation} />
          )}

          {/* Dataset Breakdown Cards Grid */}
          {resultPayload.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <SoilCard soil={resultPayload.data.soil} />
              <WeatherCard weather={resultPayload.data.weather} />
              <FertilizerCard fertilizers={resultPayload.data.fertilizers} />
              <IrrigationCard irrigation={resultPayload.data.irrigation} />
              <DiseaseCard diseases={resultPayload.data.diseases} />
              <PestCard pests={resultPayload.data.pests} />
              {resultPayload.data.weather && resultPayload.data.weather.forecast && (
                <div className="md:col-span-2">
                  <ForecastCard forecast={resultPayload.data.weather.forecast} />
                </div>
              )}
              {resultPayload.data.advisories && (
                <div className="md:col-span-2">
                  <AdvisoryCard advisories={resultPayload.data.advisories} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. FILTER CONTROLS & ACTIONABLE RECOMMENDATION CARDS LIST */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-soft p-4 rounded-xl">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary-800 text-white"
                      : "bg-surface-soft text-text-muted hover:bg-primary-100 hover:text-primary-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Priority Filters */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-text-muted shrink-0" />
              <div className="flex bg-surface-soft p-0.5 rounded-lg border border-border-soft">
                {priorities.map((pri) => (
                  <button
                    key={pri.id}
                    onClick={() => setActivePriority(pri.id)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded cursor-pointer transition-all ${
                      activePriority === pri.id
                        ? "bg-white text-primary-800 shadow-xs"
                        : "text-text-muted hover:text-text-dark"
                    }`}
                  >
                    {pri.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {filteredRecs.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onActionClick={handleResolveAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. FOOTER ARCHITECTURE NOTE */}
      <div className="flex items-start gap-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-xl p-4 text-xs leading-relaxed font-semibold">
        <Info className="w-5 h-5 text-primary-800 shrink-0 mt-0.5" />
        <div>
          <b>Smart Krishi Integrated Architecture:</b> Live parameters ({selectedDistrict}, {selectedCrop}, {selectedSeason}) are evaluated against the Smart Krishi agronomy dataset, soil suitability matrices, weather telemetry, and AI models.
        </div>
      </div>

    </div>
  );
};

export default SmartKrishi;

