import React, { useState } from "react";
import { PageHeader } from "../components/common";
import RecommendationForm from "../components/smart-krishi/RecommendationForm";
import Loading from "../components/smart-krishi/Loading";
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
import { getRecommendations } from "../services/smartKrishiService";
import { HelpCircle, AlertOctagon } from "lucide-react";

export const SmartKrishi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [result, setResult] = useState(null);
  const [queryParams, setQueryParams] = useState(null);

  const handleFormSubmit = async (params) => {
    setLoading(true);
    setError("");
    setValidationError(null);
    setResult(null);
    setQueryParams(params);

    try {
      const res = await getRecommendations(params);
      
      if (res && (res.success === false || res.code === "CROP_NOT_SUITABLE")) {
        setValidationError({
          message: res.message || `Crop '${params.crop}' is not suitable for ${params.district}'s soil type.`,
          suggestion: res.suggestion || "Please choose a more suitable crop for this district's soil type.",
          district: res.district || params.district,
          soilType: res.soilType,
          recommendedCrops: res.recommendedCrops || []
        });
      } else if (res && (res.success || res.data)) {
        setResult(res);
      } else {
        setError("Failed to fetch recommendation data.");
      }
    } catch (err) {
      console.error(err);
      const resData = err.response?.data;
      if (err.response?.status === 400 && resData && resData.success === false) {
        setValidationError({
          message: resData.message,
          suggestion: resData.suggestion || "Please choose a more suitable crop for this district.",
          recommendedCrops: resData.recommendedCrops
        });
      } else {
        setError(resData?.message || err.message || "Failed to connect to Smart Krishi server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCrop = (cropName) => {
    if (queryParams) {
      handleFormSubmit({ ...queryParams, crop: cropName });
    }
  };

  return (
    <div className="space-y-8 select-none pb-12">
      
      {/* Page Header Banner */}
      <PageHeader
        title="Smart Krishi Decision System"
        subtitle="Select your local district coordinates, desired crop, and growing season to generate action-oriented agricultural field advisories."
      />

      {/* 1. QUERY FILTER FORM */}
      <RecommendationForm onSubmit={handleFormSubmit} />

      {/* 2. DYNAMIC REPORT WRAPPER */}
      <div>
        {loading && <Loading key="loading-state" />}

        {/* Advisory Query Error */}
        {error && (
          <div 
            className="max-w-2xl mx-auto p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-2 text-rose-600 font-extrabold text-base">
              <AlertOctagon className="w-6 h-6" />
              <span>Advisory Query Error</span>
            </div>
            <p className="text-xs text-rose-800 font-medium">{error}</p>
          </div>
        )}

        {/* Soil Suitability Warning Card */}
        {validationError && (
          <div className="max-w-3xl mx-auto">
            <SoilSuitabilityWarningCard
              warning={validationError}
              onSelectCrop={handleSelectCrop}
            />
          </div>
        )}

        {/* Results Output Grid */}
        {result && result.data && (
          <div className="space-y-6">
            {/* AI Advisor Panel */}
            <AIRecommendationCard recommendation={result.recommendation} />

            {/* Warnings & Advisories */}
            {result.data.advisories && (
              <AdvisoryCard advisories={result.data.advisories} />
            )}

            {/* Environmental Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <SoilCard soil={result.data.soil} />
              <WeatherCard weather={result.data.weather} />
              <FertilizerCard fertilizers={result.data.fertilizers} />
              <IrrigationCard irrigation={result.data.irrigation} />
              <DiseaseCard diseases={result.data.diseases} />
              <PestCard pests={result.data.pests} />
              
              {/* Weather 7-Day Forecast */}
              {result.data.weather && result.data.weather.forecast && (
                <div className="md:col-span-2">
                  <ForecastCard forecast={result.data.weather.forecast} />
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Empty State Prompt */}
        {!loading && !result && !error && !validationError && (
          <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 bg-white/40 rounded-3xl border border-slate-200/60 max-w-md mx-auto">
            <HelpCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-sm font-semibold leading-relaxed m-0 text-slate-600">
              No query results loaded. Select your parameters in the form above and click <b>Generate Plan</b> to query agricultural conditions.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SmartKrishi;

