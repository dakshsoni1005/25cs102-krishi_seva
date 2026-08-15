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
    <Card className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 shadow-xl border border-emerald-800/60 rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Sparkles className="w-44 h-44 text-emerald-200" />
      </div>

      <div className="flex items-center gap-3.5 mb-5 relative z-10">
        <div className="p-3 bg-emerald-800/70 backdrop-blur-md rounded-2xl border border-emerald-700/80 text-amber-300 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-300/20">
            Smart Krishi AI Intelligence
          </span>
          <h2 className="text-xl font-extrabold text-white m-0 mt-1 leading-tight tracking-tight">
            Field Advisory Overview
          </h2>
        </div>
      </div>

      {recommendation.summary && (
        <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-medium bg-emerald-800/30 backdrop-blur-sm p-4 rounded-2xl border border-emerald-700/40">
          {recommendation.summary}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
        {/* DO's */}
        {recommendation.dos && recommendation.dos.length > 0 && (
          <div className="bg-emerald-950/60 backdrop-blur-sm border border-emerald-700/50 p-4 rounded-2xl">
            <h4 className="text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recommended Actions (DO's)
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100 font-medium">
              {recommendation.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DONT's */}
        {recommendation.donts && recommendation.donts.length > 0 && (
          <div className="bg-rose-950/50 backdrop-blur-sm border border-rose-800/40 p-4 rounded-2xl">
            <h4 className="text-rose-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-rose-400" />
              Actions to Avoid (DON'Ts)
            </h4>
            <ul className="space-y-2 text-xs text-rose-100 font-medium">
              {recommendation.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
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
        <div className="bg-amber-950/50 backdrop-blur-sm border border-amber-700/50 p-4 rounded-2xl flex items-start gap-3 relative z-10">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              Critical Field Warnings
            </h4>
            <div className="text-xs text-amber-100 space-y-1 font-medium">
              {recommendation.warnings.map((w, idx) => (
                <p key={idx} className="m-0 leading-relaxed">• {w}</p>
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
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50/60 border-2 border-amber-300 p-6 rounded-3xl shadow-sm select-none">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="p-3 bg-amber-500/10 text-amber-900 rounded-2xl border border-amber-300/60 shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
            Agronomy Compatibility Warning
          </span>
          <h3 className="text-base font-extrabold text-amber-950 m-0 mt-1 leading-tight">
            Soil Type & Crop Compatibility Alert
          </h3>
          <p className="text-xs font-semibold text-amber-900 mt-1.5 leading-relaxed">
            {warning.message}
          </p>
        </div>
      </div>

      {warning.suggestion && (
        <p className="text-xs font-medium text-amber-900 mb-5 bg-amber-100/80 p-3.5 rounded-xl border border-amber-200/80">
          💡 <b>Agronomist Tip:</b> {warning.suggestion}
        </p>
      )}

      {warning.recommendedCrops && warning.recommendedCrops.length > 0 && (
        <div className="border-t border-amber-200/80 pt-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-3">
            Recommended Suitable Crops for {warning.district || "this area"}'s {warning.soilType || "soil"}:
          </span>
          <div className="flex flex-wrap gap-2">
            {warning.recommendedCrops.map((cropName, idx) => (
              <button
                key={idx}
                onClick={() => onSelectCrop && onSelectCrop(cropName)}
                className="px-3.5 py-2 bg-amber-800 text-white font-bold text-xs rounded-xl hover:bg-amber-900 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 leading-none">Soil Profile & Nutrients</h3>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-200/80">
          pH {soil.ph || "7.0"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Soil Type</span>
          <p className="text-xs font-extrabold text-slate-900 m-0 mt-0.5">{soil.type || "Medium Black"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Texture</span>
          <p className="text-xs font-extrabold text-slate-900 m-0 mt-0.5">{soil.texture || "Clay Loam"}</p>
        </div>
      </div>

      {soil.npk && (
        <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block mb-2">
            NPK Nutrient Balance
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-emerald-200/60 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-400 block">Nitrogen (N)</span>
              <span className="text-xs font-black text-emerald-800">{soil.npk.nitrogen || "Medium"}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-200/60 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-400 block">Phosphorus (P)</span>
              <span className="text-xs font-black text-emerald-800">{soil.npk.phosphorus || "Medium"}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-200/60 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-400 block">Potassium (K)</span>
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-sky-500/10 text-sky-700 rounded-xl">
            <Thermometer className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 leading-none">Live Agro-Meteorology</h3>
        </div>
        <span className="text-xs bg-sky-50 text-sky-800 font-extrabold px-3 py-1 rounded-full border border-sky-200/80">
          {curr.condition || "Clear Skies"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-amber-100/60 text-amber-700 rounded-xl shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Temp</span>
            <span className="text-xs font-black text-slate-900">{curr.temperature || 30}°C</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-sky-100/60 text-sky-700 rounded-xl shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Humidity</span>
            <span className="text-xs font-black text-slate-900">{curr.humidity || 70}%</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-100/60 text-indigo-700 rounded-xl shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Rain Prob</span>
            <span className="text-xs font-black text-slate-900">{curr.rainfall || curr.rainProbability || 20}%</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-teal-100/60 text-teal-700 rounded-xl shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Wind Speed</span>
            <span className="text-xs font-black text-slate-900">{curr.windSpeed || 12} km/h</span>
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-700 rounded-xl">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">7-Day Weather Outlook</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {forecast.map((day, idx) => (
          <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center space-y-1.5 hover:border-indigo-200 transition-colors">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">{day.day || `Day ${idx + 1}`}</span>
            <div className="text-xs font-black text-slate-900">
              {day.max || day.temp || 32}° <span className="text-slate-400 font-bold text-[10px]">{day.min ? `/ ${day.min}°` : ""}</span>
            </div>
            {day.rain !== undefined && (
              <span className="text-[9px] font-black text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded-md block">
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
          <Sprout className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">Fertilizer Schedule</h3>
      </div>

      <div className="space-y-3">
        {fertilizers.map((f, idx) => (
          <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200/60">
                {f.stage || "Growth Stage"}
              </span>
              <h4 className="text-xs font-black text-slate-900 m-0 mt-1.5">{f.name || f.fertilizerName}</h4>
            </div>
            <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100/50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-sky-500/10 text-sky-700 rounded-xl">
          <Droplets className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">Irrigation Advisory</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
          <span className="text-[10px] font-extrabold text-sky-900 uppercase tracking-wider block">Frequency</span>
          <p className="text-xs font-black text-slate-900 m-0 mt-1">{irrigation.frequency || "Every 8-10 days"}</p>
        </div>
        <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
          <span className="text-[10px] font-extrabold text-sky-900 uppercase tracking-wider block">Water Requirement</span>
          <p className="text-xs font-black text-slate-900 m-0 mt-1">{irrigation.waterRequirement || "Moderate"}</p>
        </div>
      </div>
    </Card>
  );
};

// 8. DISEASE CARD
export const DiseaseCard = ({ diseases }) => {
  if (!diseases || !Array.isArray(diseases) || diseases.length === 0) return null;

  return (
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-rose-500/10 text-rose-700 rounded-xl">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">Disease Vulnerability</h3>
      </div>

      <div className="space-y-3">
        {diseases.map((d, idx) => (
          <div key={idx} className="bg-rose-50/40 p-3.5 rounded-2xl border border-rose-100/80 space-y-1.5">
            <h4 className="text-xs font-extrabold text-rose-950 m-0">{d.name}</h4>
            {d.symptoms && (
              <p className="text-[11px] text-slate-600 font-medium m-0 leading-relaxed">
                <b className="text-slate-800">Symptoms:</b> {d.symptoms}
              </p>
            )}
            {d.solution && (
              <p className="text-[11px] text-emerald-800 font-bold m-0 pt-1 leading-relaxed">
                💡 <b className="text-emerald-900">Treatment:</b> {d.solution}
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl">
          <Bug className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">Pest Threat Control</h3>
      </div>

      <div className="space-y-3">
        {pests.map((p, idx) => (
          <div key={idx} className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100/80 space-y-1.5">
            <h4 className="text-xs font-extrabold text-amber-950 m-0">{p.name}</h4>
            {p.solution && (
              <p className="text-[11px] text-amber-900 font-bold m-0 leading-relaxed">
                🛡 <b className="text-amber-950">Control Action:</b> {p.solution}
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
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
          <Info className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">Government & Field Advisories</h3>
      </div>

      <div className="space-y-2.5">
        {advisories.map((adv, idx) => (
          <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-slate-800 leading-relaxed">
              <span className="font-black text-emerald-800 uppercase text-[9px] tracking-wider mr-1.5">[{adv.type || "Notice"}]</span>
              {adv.message}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 11. WEATHER ALERTS CARD
export const WeatherAlertsCard = ({ alerts }) => {
  if (!alerts || !Array.isArray(alerts) || alerts.length === 0) return null;

  return (
    <Card className="bg-amber-500/10 border border-amber-300 p-5 rounded-3xl shadow-xs">
      <div className="flex items-center gap-2.5 mb-3">
        <AlertTriangle className="w-5 h-5 text-amber-700" />
        <h3 className="font-extrabold text-sm text-amber-950 m-0">Deterministic Weather Safety Alerts</h3>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200">
            <span className="text-amber-600 font-extrabold">⚠️</span>
            <span>{typeof alert === 'string' ? alert : alert.message || alert.title}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 12. CROP CALENDAR CARD
export const CalendarCard = ({ calendar }) => {
  if (!calendar) return null;

  return (
    <Card className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-none">Crop Growth & Season Calendar</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">Cropping Season</span>
          <p className="text-xs font-black text-slate-900 m-0 mt-1">{calendar.season || "Kharif"}</p>
        </div>
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">Growth Duration</span>
          <p className="text-xs font-black text-slate-900 m-0 mt-1">{calendar.duration || "120-140 Days"}</p>
        </div>
        {calendar.sowingWindow && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Sowing Window</span>
            <p className="text-xs font-black text-slate-900 m-0 mt-1">{calendar.sowingWindow}</p>
          </div>
        )}
        {calendar.harvestWindow && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Harvesting Window</span>
            <p className="text-xs font-black text-slate-900 m-0 mt-1">{calendar.harvestWindow}</p>
          </div>
        )}
      </div>
    </Card>
  );
};


