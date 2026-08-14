import React from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Sprout,
  ShieldAlert,
  Bug,
  Info,
  Calendar,
  AlertOctagon
} from "lucide-react";
import { Card } from "../common";

// 1. AI RECOMMENDATION CARD
export const AIRecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <Card className="bg-gradient-to-br from-primary-900 to-primary-950 text-white p-6 shadow-xl border border-primary-800 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-36 h-36 text-white" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-primary-800/80 rounded-xl border border-primary-700 text-amber-300">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
            Smart Krishi AI Intelligence
          </span>
          <h2 className="text-xl font-black text-white m-0 leading-tight">
            Field Advisory Overview
          </h2>
        </div>
      </div>

      {recommendation.summary && (
        <p className="text-primary-100 text-sm leading-relaxed mb-6 font-medium bg-primary-800/30 p-4 rounded-xl border border-primary-800/50">
          {recommendation.summary}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* DO's */}
        {recommendation.dos && recommendation.dos.length > 0 && (
          <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-xl">
            <h4 className="text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recommended Field Actions (DO's)
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100 font-medium">
              {recommendation.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DONT's */}
        {recommendation.donts && recommendation.donts.length > 0 && (
          <div className="bg-rose-950/40 border border-rose-800/40 p-4 rounded-xl">
            <h4 className="text-rose-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-rose-400" />
              Actions to Avoid (DON'Ts)
            </h4>
            <ul className="space-y-2 text-xs text-rose-100 font-medium">
              {recommendation.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* WARNINGS */}
      {recommendation.warnings && recommendation.warnings.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/40 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              Critical Management Warnings
            </h4>
            <div className="text-xs text-amber-100 space-y-1 font-medium">
              {recommendation.warnings.map((w, idx) => (
                <p key={idx} className="m-0">• {w}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// 2. SOIL SUITABILITY WARNING CARD
export const SoilSuitabilityWarningCard = ({ warning, onSelectCrop }) => {
  if (!warning) return null;

  return (
    <Card className="bg-amber-50 border-2 border-amber-300 p-6 rounded-2xl shadow-sm select-none">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-xl shrink-0">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
            Agronomy Compatibility Alert
          </span>
          <h3 className="text-lg font-black text-amber-950 m-0 leading-tight">
            Soil Type & Crop Incompatibility Warning
          </h3>
          <p className="text-sm font-semibold text-amber-900 mt-1.5 leading-relaxed">
            {warning.message}
          </p>
        </div>
      </div>

      {warning.suggestion && (
        <p className="text-xs font-medium text-amber-800 mb-5 bg-amber-100/60 p-3 rounded-lg border border-amber-200">
          💡 <b>Agronomist Tip:</b> {warning.suggestion}
        </p>
      )}

      {warning.recommendedCrops && warning.recommendedCrops.length > 0 && (
        <div className="border-t border-amber-200/80 pt-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block mb-3">
            Recommended Suitable Crops for {warning.district || "this district"}'s {warning.soilType || "soil"}:
          </span>
          <div className="flex flex-wrap gap-2">
            {warning.recommendedCrops.map((cropName, idx) => (
              <button
                key={idx}
                onClick={() => onSelectCrop && onSelectCrop(cropName)}
                className="px-3.5 py-2 bg-amber-800 text-white font-extrabold text-xs rounded-xl hover:bg-amber-900 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5" />
                Switch to {cropName}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

// 3. SOIL CARD
export const SoilCard = ({ soil }) => {
  if (!soil) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-text-dark leading-none">Soil Profile & Nutrients</h3>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
          pH {soil.ph || "7.0"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-soft p-3 rounded-xl border border-border-soft">
          <span className="text-[10px] font-extrabold uppercase text-text-muted">Soil Type</span>
          <p className="text-xs font-black text-text-dark m-0 mt-0.5">{soil.type || "Medium Black"}</p>
        </div>
        <div className="bg-surface-soft p-3 rounded-xl border border-border-soft">
          <span className="text-[10px] font-extrabold uppercase text-text-muted">Texture</span>
          <p className="text-xs font-black text-text-dark m-0 mt-0.5">{soil.texture || "Clay Loam"}</p>
        </div>
      </div>

      {soil.npk && (
        <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
          <span className="text-[10px] font-extrabold uppercase text-emerald-800 block mb-2">
            NPK Nutrient Balance
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-[10px] font-bold text-text-muted block">Nitrogen (N)</span>
              <span className="text-xs font-black text-emerald-800">{soil.npk.nitrogen || "Medium"}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-[10px] font-bold text-text-muted block">Phosphorus (P)</span>
              <span className="text-xs font-black text-emerald-800">{soil.npk.phosphorus || "Medium"}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-[10px] font-bold text-text-muted block">Potassium (K)</span>
              <span className="text-xs font-black text-emerald-800">{soil.npk.potassium || "High"}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// 4. WEATHER CARD
export const WeatherCard = ({ weather }) => {
  if (!weather || !weather.current) return null;
  const curr = weather.current;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-50 text-sky-800 rounded-lg">
            <Thermometer className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-text-dark leading-none">Live Agro-Meteorology</h3>
        </div>
        <span className="text-xs bg-sky-50 text-sky-800 font-bold px-2.5 py-1 rounded-full border border-sky-200">
          {curr.condition || "Clear Skies"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-soft p-3 rounded-xl border border-border-soft flex items-center gap-3">
          <Thermometer className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-text-muted block">Temp</span>
            <span className="text-sm font-black text-text-dark">{curr.temperature || 30}°C</span>
          </div>
        </div>

        <div className="bg-surface-soft p-3 rounded-xl border border-border-soft flex items-center gap-3">
          <Droplets className="w-5 h-5 text-sky-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-text-muted block">Humidity</span>
            <span className="text-sm font-black text-text-dark">{curr.humidity || 70}%</span>
          </div>
        </div>

        <div className="bg-surface-soft p-3 rounded-xl border border-border-soft flex items-center gap-3">
          <CloudRain className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-text-muted block">Rain Prob</span>
            <span className="text-sm font-black text-text-dark">{curr.rainfall || curr.rainProbability || 20}%</span>
          </div>
        </div>

        <div className="bg-surface-soft p-3 rounded-xl border border-border-soft flex items-center gap-3">
          <Wind className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-text-muted block">Wind Speed</span>
            <span className="text-sm font-black text-text-dark">{curr.windSpeed || 12} km/h</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// 5. FORECAST CARD
export const ForecastCard = ({ forecast }) => {
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
        <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-text-dark leading-none">7-Day Weather Outlook</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {forecast.map((day, idx) => (
          <div key={idx} className="bg-surface-soft p-3 rounded-xl border border-border-soft text-center space-y-1">
            <span className="text-[11px] font-black text-text-muted block uppercase">{day.day || `Day ${idx + 1}`}</span>
            <div className="text-xs font-black text-text-dark">
              {day.max || day.temp || 32}° <span className="text-text-muted font-bold text-[10px]">{day.min ? `/ ${day.min}°` : ""}</span>
            </div>
            {day.rain !== undefined && (
              <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded block">
                🌧 {day.rain}%
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// 6. FERTILIZER CARD
export const FertilizerCard = ({ fertilizers }) => {
  if (!fertilizers || !Array.isArray(fertilizers) || fertilizers.length === 0) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
          <Sprout className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-text-dark leading-none">Fertilizer Schedule</h3>
      </div>

      <div className="space-y-3">
        {fertilizers.map((f, idx) => (
          <div key={idx} className="bg-surface-soft p-3.5 rounded-xl border border-border-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {f.stage || "Growth Stage"}
              </span>
              <h4 className="text-xs font-black text-text-dark m-0 mt-1">{f.name || f.fertilizerName}</h4>
            </div>
            <span className="text-xs font-extrabold text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
              {f.quantity || f.dosage || "As per soil report"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 7. IRRIGATION CARD
export const IrrigationCard = ({ irrigation }) => {
  if (!irrigation) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
        <div className="p-2 bg-sky-50 text-sky-800 rounded-lg">
          <Droplets className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-text-dark leading-none">Irrigation Advisory</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100">
          <span className="text-[10px] font-bold text-sky-800 uppercase block">Frequency</span>
          <p className="text-xs font-black text-text-dark m-0 mt-0.5">{irrigation.frequency || "Every 8-10 days"}</p>
        </div>
        <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100">
          <span className="text-[10px] font-bold text-sky-800 uppercase block">Water Requirement</span>
          <p className="text-xs font-black text-text-dark m-0 mt-0.5">{irrigation.waterRequirement || "Moderate"}</p>
        </div>
      </div>
    </Card>
  );
};

// 8. DISEASE CARD
export const DiseaseCard = ({ diseases }) => {
  if (!diseases || !Array.isArray(diseases) || diseases.length === 0) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
        <div className="p-2 bg-rose-50 text-rose-800 rounded-lg">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-text-dark leading-none">Disease Vulnerability</h3>
      </div>

      <div className="space-y-3">
        {diseases.map((d, idx) => (
          <div key={idx} className="bg-rose-50/30 p-3.5 rounded-xl border border-rose-100 space-y-1">
            <h4 className="text-xs font-black text-rose-950 m-0">{d.name}</h4>
            {d.symptoms && (
              <p className="text-[11px] text-text-muted font-medium m-0">
                <b>Symptoms:</b> {d.symptoms}
              </p>
            )}
            {d.solution && (
              <p className="text-[11px] text-emerald-800 font-bold m-0 pt-0.5">
                💡 <b>Treatment:</b> {d.solution}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// 9. PEST CARD
export const PestCard = ({ pests }) => {
  if (!pests || !Array.isArray(pests) || pests.length === 0) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
        <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
          <Bug className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-text-dark leading-none">Pest Threat Control</h3>
      </div>

      <div className="space-y-3">
        {pests.map((p, idx) => (
          <div key={idx} className="bg-amber-50/30 p-3.5 rounded-xl border border-amber-100 space-y-1">
            <h4 className="text-xs font-black text-amber-950 m-0">{p.name}</h4>
            {p.solution && (
              <p className="text-[11px] text-amber-900 font-bold m-0">
                🛡 <b>Control Action:</b> {p.solution}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// 10. ADVISORY CARD
export const AdvisoryCard = ({ advisories }) => {
  if (!advisories || !Array.isArray(advisories) || advisories.length === 0) return null;

  return (
    <Card className="bg-white border border-border-soft p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
        <div className="p-2 bg-primary-50 text-primary-800 rounded-lg">
          <Info className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-text-dark leading-none">Government & Field Advisories</h3>
      </div>

      <div className="space-y-2.5">
        {advisories.map((adv, idx) => (
          <div key={idx} className="bg-surface-soft p-3 rounded-xl border border-border-soft flex items-start gap-2.5">
            <Info className="w-4 h-4 text-primary-800 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-text-dark">
              <span className="font-black text-primary-800 uppercase text-[10px] mr-1.5">[{adv.type || "Notice"}]</span>
              {adv.message}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
