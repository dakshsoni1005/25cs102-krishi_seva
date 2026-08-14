import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Card,
  Badge,
  Button,
  RecommendationCard,
  LoadingSkeleton,
  EmptyState,
  PageHeader
} from "../components/common";
import {
  Cpu,
  Sprout,
  User,
  CloudRain,
  Timer,
  SlidersHorizontal,
  ChevronDown,
  Info
} from "lucide-react";
import { recommendationService } from "../services/recommendationService";

export const SmartKrishi = () => {
  const { farmer, t, addLocalNotification } = useApp();

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriority, setActivePriority] = useState("all");

  const categories = [
    { id: "all", label: "All Advisors" },
    { id: "Irrigation", label: "Irrigation" },
    { id: "Fertilizer", label: "Fertilizers" },
    { id: "Pest Control", label: "Pest Control" },
    { id: "Crop Health", label: "Crop Health" },
    { id: "Market Timing", label: "Market Timing" }
  ];

  const priorities = [
    { id: "all", label: "All Priorities" },
    { id: "HIGH", label: "High Priority" },
    { id: "MEDIUM", label: "Medium Priority" },
    { id: "LOW", label: "Low Priority" }
  ];

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const data = await recommendationService.getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const handleResolveAction = (rec) => {
    addLocalNotification(
      "Recommendation Actioned",
      `Successfully registered action for: "${rec.title}".`,
      "AI Recommendation",
      "medium"
    );
    // Remove completed from screen or just show toast
    alert(`Action initiated: ${rec.action}\n\nExpected Benefit: ${rec.benefit}`);
  };

  const filteredRecs = recommendations.filter((r) => {
    const catMatch = activeCategory === "all" || r.category.toLowerCase() === activeCategory.toLowerCase();
    const priMatch = activePriority === "all" || r.priority.toUpperCase() === activePriority.toUpperCase();
    return catMatch && priMatch;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Page Header */}
      <PageHeader
        title={t("smartKrishi")}
        subtitle="Central AI intelligence compiling weather forecasting, soil tests, and market signals into direct field operations."
      />

      {/* 1. FARMER PROFILE CONTEXT BOARD */}
      <Card className="bg-white border border-border-soft p-5">
        <div className="flex items-center gap-2 border-b border-border-soft pb-3 mb-4">
          <Cpu className="w-5 h-5 text-primary-800 shrink-0" />
          <h3 className="font-extrabold text-base text-text-dark leading-none">Active Intelligence Parameters</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-semibold text-text-muted">
          <div className="flex flex-col gap-1.5 p-3.5 bg-surface-soft/60 rounded-lg border border-border-soft/40">
            <span className="text-[10px] uppercase font-bold text-text-muted">Farmer Location</span>
            <span className="text-text-dark font-extrabold truncate">{farmer?.village}, {farmer?.district}</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 bg-surface-soft/60 rounded-lg border border-border-soft/40">
            <span className="text-[10px] uppercase font-bold text-text-muted">Crop Under Cultivation</span>
            <span className="text-text-dark font-extrabold truncate">{farmer?.mainCrop}</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 bg-surface-soft/60 rounded-lg border border-border-soft/40">
            <span className="text-[10px] uppercase font-bold text-text-muted">Soil Profile</span>
            <span className="text-text-dark font-extrabold truncate">Medium Black Clay</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 bg-surface-soft/60 rounded-lg border border-border-soft/40">
            <span className="text-[10px] uppercase font-bold text-text-muted">Irrigation Method</span>
            <span className="text-text-dark font-extrabold truncate">{farmer?.irrigationType}</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 bg-surface-soft/60 rounded-lg border border-border-soft/40 col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-bold text-text-muted">Micro-Climate Warning</span>
            <span className="text-rose-600 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              Heavy Rain Alerts
            </span>
          </div>
        </div>
      </Card>

      {/* 2. FILTER CONTROLS BAR */}
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

      {/* 3. RECOMMENDATION RESULTS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : filteredRecs.length === 0 ? (
        <EmptyState
          title="No Advisory Recommendations Found"
          description="Try changing your filters or searching across other categories to explore recommendations."
          actionLabel="Clear Filters"
          onAction={() => { setActiveCategory("all"); setActivePriority("all"); }}
          icon={Cpu}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {filteredRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onActionClick={handleResolveAction}
            />
          ))}
        </div>
      )}

      {/* 4. FOOTER NOTE */}
      <div className="flex items-start gap-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-xl p-4 text-xs leading-relaxed font-semibold">
        <Info className="w-5 h-5 text-primary-800 shrink-0 mt-0.5" />
        <div>
          <b>How AI recommendations work:</b> KrishiSeva aggregates real-time agricultural data. Recommendations are recalculated when your weather alerts update or when soil samples are logged in the **Soil Advisory** module.
        </div>
      </div>

    </div>
  );
};
export default SmartKrishi;
