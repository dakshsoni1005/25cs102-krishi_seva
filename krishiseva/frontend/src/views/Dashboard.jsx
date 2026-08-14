import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Button,
  Card,
  Badge,
  StatCard,
  AlertCard,
  RecommendationCard,
  WeatherCard,
  LoadingSkeleton,
  EmptyState
} from "../components/common";
import {
  Sprout,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CloudSun,
  Award,
  ChevronRight,
  Cpu,
  CheckSquare,
  Square,
  Landmark,
  Scan
} from "lucide-react";
import { weatherService } from "../services/weatherService";
import { soilService } from "../services/soilService";
import { cropService } from "../services/cropService";
import { marketService } from "../services/marketService";
import { recommendationService } from "../services/recommendationService";
import { schemeService } from "../services/schemeService";

export const Dashboard = () => {
  const { farmer, t, addLocalNotification } = useApp();
  const navigate = useNavigate();

  // Component Data States
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [crops, setCrops] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Load data from services in parallel
        const [wData, sData, cData, mData, rData, scData] = await Promise.all([
          weatherService.getWeatherData(farmer?.state, farmer?.district, farmer?.taluka, farmer?.village),
          soilService.getSoilData(farmer?.id),
          cropService.getActiveCrops(),
          marketService.getMarketPrices(),
          recommendationService.getRecommendations(),
          schemeService.getSchemes()
        ]);

        setWeather(wData);
        setSoil(sData);
        setCrops(cData);
        
        // Filter markets to only show watchlisted or top 3 crops
        setMarkets(mData.slice(0, 3));
        setRecommendations(rData);
        setSchemes(scData.slice(0, 2)); // Show 2 relevant schemes
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (farmer) {
      fetchDashboardData();
    }
  }, [farmer]);

  const handleToggleTask = async (cropId, taskId, taskTitle) => {
    try {
      const updated = await cropService.toggleTaskStatus(cropId, taskId);
      // Update local state
      setCrops((prev) => prev.map((c) => (c.id === cropId ? updated : c)));
      
      const task = updated.tasks.find((t) => t.id === taskId);
      if (task.status === "completed") {
        addLocalNotification(
          "Task Completed",
          `Marked "${taskTitle}" as done. Your crop schedule has been updated.`,
          "Crop",
          "medium"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-white/50 animate-pulse rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <LoadingSkeleton rows={4} />
            <LoadingSkeleton rows={3} />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton rows={5} />
          </div>
        </div>
      </div>
    );
  }

  // Find high priority recommendation to display prominently
  const primaryRecommendation = recommendations.find((r) => r.priority === "HIGH") || recommendations[0];
  
  // Collect all today's tasks across all active crops
  const todaysTasks = crops.flatMap((c) => 
    c.tasks.filter((t) => t.status === "today").map((t) => ({ ...t, cropName: c.name, cropId: c.id }))
  );

  return (
    <div className="space-y-8 select-none">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-dark m-0 leading-none">
            {getGreeting()}, {farmer?.fullName}
          </h1>
          <p className="text-sm text-text-muted mt-2 font-medium">
            Location: <span className="text-primary-800 font-bold">{farmer?.village}, {farmer?.taluka}, {farmer?.district}</span> • Main Crop: <span className="text-primary-800 font-bold">{farmer?.mainCrop}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/pest-scanner")} icon={Scan}>
            Scan Leaf Disease
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/ai-guru")} icon={Cpu}>
            Ask AI Guru
          </Button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Soil Health Score"
          value={`${soil?.healthScore}`}
          unit="/100"
          change={{ value: "Stable", type: "neutral" }}
          icon={Sprout}
        />
        <StatCard
          title="Active Crops Managed"
          value={`${crops.length}`}
          unit="blocks"
          change={{ value: `${crops.reduce((acc, c) => acc + c.area, 0)} acres`, type: "positive" }}
          icon={Calendar}
        />
        <StatCard
          title="Market Average (Cotton)"
          value="₹7,200"
          unit="/qtl"
          change={{ value: "+₹50 today", type: "positive" }}
          icon={TrendingUp}
        />
        <StatCard
          title="Unread Alerts"
          value="2"
          unit="notifs"
          change={{ value: "Action Required", type: "negative" }}
          icon={AlertTriangle}
        />
      </div>

      {/* 3. CORE TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER COLUMNS (2/3 width on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. PROMINENT AI RECOMMENDATION */}
          {primaryRecommendation && (
            <Card className="border border-primary-200 bg-gradient-to-br from-primary-50/50 to-accent-50/20 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-accent-100/10 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-primary-800 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-primary-900 uppercase tracking-widest">
                  High-Priority Smart Advisory
                </span>
                <span className="text-[10px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded ml-2 animate-pulse">
                  CRITICAL ACTION
                </span>
              </div>
              
              <h3 className="text-lg font-black text-text-dark leading-snug">
                {primaryRecommendation.title}
              </h3>
              
              <p className="text-sm text-text-muted mt-2 leading-relaxed font-semibold">
                {primaryRecommendation.explanation}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-3.5 border border-primary-100 rounded-xl">
                <div className="flex-1 text-xs">
                  <div className="font-bold text-text-dark uppercase tracking-wider text-[10px]">Recommended Action:</div>
                  <div className="text-primary-800 font-bold mt-1 text-sm">{primaryRecommendation.action}</div>
                </div>
                <Button size="sm" onClick={() => navigate("/smart-krishi")}>
                  Resolve Issue
                </Button>
              </div>
            </Card>
          )}

          {/* B. TODAY'S TASKS AND ACTIVITIES */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-soft pb-3.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-800 shrink-0" />
                <h3 className="font-extrabold text-lg text-text-dark leading-none">Today's Crop Activities</h3>
              </div>
              <Link to="/crop-management" className="text-xs font-bold text-primary-800 flex items-center hover:underline">
                View Schedule <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-6 text-xs text-text-muted font-medium">
                No farming tasks scheduled for today. Keep inspecting your leaves!
              </div>
            ) : (
              <div className="space-y-3.5">
                {todaysTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTask(t.cropId, t.id, t.title)}
                    className="flex items-start gap-3 p-3 bg-surface-soft/60 hover:bg-surface-soft border border-border-soft/60 rounded-xl cursor-pointer group transition-all duration-150"
                  >
                    <button type="button" className="text-text-muted group-hover:text-primary-800 mt-0.5 transition-colors cursor-pointer shrink-0">
                      {t.status === "completed" ? (
                        <CheckSquare className="w-5 h-5 text-primary-800 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 shrink-0" />
                      )}
                    </button>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className={`text-sm font-bold text-text-dark leading-tight ${t.status === "completed" ? "line-through text-text-muted" : ""}`}>
                        {t.title}
                      </span>
                      <span className="text-[10px] font-semibold text-text-muted">
                        Category: {t.category} • Crop Block: <b>{t.cropName}</b>
                      </span>
                    </div>
                    <Badge variant={t.category === "Pest Control" ? "danger" : t.category === "Irrigation" ? "info" : "primary"}>
                      {t.category}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* C. CROP HEALTH SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {crops.map((crop) => {
              const currentIdx = crop.timeline.findIndex((t) => t.stage === crop.currentStage);
              const progressPercent = Math.round((currentIdx / (crop.timeline.length - 1)) * 100);
              return (
                <Card key={crop.id} hoverable onClick={() => navigate("/crop-management")} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-text-dark">{crop.name}</h4>
                      <p className="text-xs text-text-muted font-medium">{crop.variety}</p>
                    </div>
                    <Badge variant={crop.healthStatus === "Good" ? "success" : "warning"}>
                      Health: {crop.healthStatus}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                      <span>Lifecycle: {crop.currentStage}</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-soft border border-border-soft/60 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-800" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                  
                  {crop.pestWarning && (
                    <div className="bg-rose-50 text-rose-800 border border-rose-100 rounded-lg p-2 flex items-center gap-1.5 text-[10px] font-bold mt-1">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Pest Warning! Scan leaf.
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width on Desktop) */}
        <div className="space-y-6">
          
          {/* A. LIVE WEATHER WIDGET */}
          {weather && (
            <div className="space-y-3.5">
              <WeatherCard weather={weather} />
              
              {/* Weather Alert warning */}
              {weather.alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  type="warning"
                  title={alert.title}
                  description={alert.description}
                  action={
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-200/50 px-2.5 py-1 rounded border border-amber-200/80">
                      Advisory: Delay Irrigation
                    </span>
                  }
                />
              ))}
            </div>
          )}

          {/* B. SOIL NPK SUMMARY WIDGET */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-soft pb-3">
              <h4 className="font-extrabold text-base text-text-dark flex items-center gap-2">
                <Sprout className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Soil NPK Status
              </h4>
              <Link to="/soil-advisory" className="text-xs font-bold text-primary-800 hover:underline">
                Advisory
              </Link>
            </div>
            
            <div className="space-y-3">
              {soil && Object.entries(soil.nutrients).map(([key, nutrient]) => {
                const nameMap = { nitrogen: "N - Nitrogen", phosphorus: "P - Phosphorus", potassium: "K - Potassium", organicCarbon: "OC - Carbon" };
                const barWidths = { Low: "w-1/3 bg-rose-500", Medium: "w-2/3 bg-amber-500", High: "w-full bg-emerald-600" };
                return (
                  <div key={key} className="flex flex-col gap-1.5 text-xs font-semibold">
                    <div className="flex justify-between text-text-dark">
                      <span>{nameMap[key]}</span>
                      <span className="text-[10px] uppercase font-bold text-text-muted">{nutrient.value} kg/ha ({nutrient.status})</span>
                    </div>
                    <div className="w-full h-2 bg-surface-soft border border-border-soft/60 rounded-full overflow-hidden relative">
                      <div className={`h-full ${barWidths[nutrient.status]} transition-all duration-300`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* C. APMC MARKET RATES MINI BOARD */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-soft pb-3">
              <h4 className="font-extrabold text-base text-text-dark flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Market Prices (Anand/Gondal)
              </h4>
              <Link to="/market-prices" className="text-xs font-bold text-primary-800 hover:underline">
                Mandi Rates
              </Link>
            </div>

            <div className="divide-y divide-border-soft/60">
              {markets.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-text-dark">{m.crop}</span>
                    <span className="text-[10px] font-semibold text-text-muted">{m.market}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-extrabold text-primary-800">₹{m.avgPrice}/qtl</span>
                    <span className={`text-[10px] font-bold ${m.trend === "up" ? "text-emerald-600" : m.trend === "down" ? "text-red-500" : "text-text-muted"}`}>
                      {m.trend === "up" ? "📈 +₹50" : m.trend === "down" ? "📉 -₹20" : "✦ Stable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* D. GOVERNMENT SCHEMES ALERT CARD */}
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border-soft pb-2.5">
              <h4 className="font-extrabold text-base text-text-dark flex items-center gap-2">
                <Landmark className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Schemes Discovery
              </h4>
              <Link to="/government-schemes" className="text-xs font-bold text-primary-800 hover:underline">
                Apply
              </Link>
            </div>
            
            {schemes.map((sch) => (
              <div key={sch.id} className="p-3 bg-surface-soft/40 border border-border-soft/60 rounded-xl flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-text-dark truncate">{sch.name}</span>
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-muted">
                  <span>Deadline: <b>{sch.deadline}</b></span>
                  <span className="bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {sch.benefitType}
                  </span>
                </div>
              </div>
            ))}
          </Card>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
