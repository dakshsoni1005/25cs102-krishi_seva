import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, PageHeader, WeatherCard, AlertCard, LoadingSkeleton, Toast } from "../components/common";
import { CloudSun, CloudRain, Sun, CloudDrizzle, CloudLightning, Wind, Droplets, Thermometer, Info } from "lucide-react";
import { weatherService } from "../services/weatherService";

export const Weather = () => {
  const { farmer, t, addLocalNotification } = useApp();

  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await weatherService.getWeatherData(
          farmer?.state,
          farmer?.district,
          farmer?.taluka,
          farmer?.village
        );
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [farmer]);

  const getWeatherIcon = (iconName) => {
    const styles = "w-7 h-7 text-primary-800";
    if (iconName === "cloud-sun-rain") return <CloudSun className={styles} />;
    if (iconName === "cloud-rain") return <CloudRain className={styles} />;
    if (iconName === "cloud-lightning") return <CloudLightning className={styles} />;
    if (iconName === "cloud-drizzle") return <CloudDrizzle className={styles} />;
    return <Sun className="w-7 h-7 text-amber-500" />;
  };

  const triggerWeatherSync = () => {
    setToast({ type: "success", message: "Synchronized with Open-Meteo mock servers." });
    addLocalNotification(
      "Weather Synced",
      "Micro-climate weather forecasts updated successfully.",
      "Weather",
      "info"
    );
  };

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("weather")}
        subtitle="Micro-climate agricultural weather forecasting. Monitor rainfall probability and wind patterns affecting spray cycles."
        action={
          <Badge className="bg-primary-100 text-primary-800 border-primary-200 text-xs py-1 px-3">
            Hadgud Block A Station Active
          </Badge>
        }
      />

      {loading ? (
        <div className="space-y-6">
          <LoadingSkeleton />
          <div className="grid grid-cols-7 gap-3"><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /></div>
        </div>
      ) : weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
          
          {/* LEFT & CENTER COLUMN (2/3 width on Desktop) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* A. CURRENT WEATHER LARGE CARD */}
            <WeatherCard weather={weather} />

            {/* B. ACTIVE WEATHER ALERTS */}
            {weather.alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                type="warning"
                title={alert.title}
                description={alert.description}
                action={
                  <div className="flex flex-col gap-2.5 mt-3.5 bg-white/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-950">
                    <span className="font-extrabold uppercase tracking-wider text-[10px]">Urgent Farming Action:</span>
                    <p className="leading-relaxed font-semibold">{alert.action}</p>
                  </div>
                }
              />
            ))}

            {/* C. 7-DAY METEOROLOGICAL FORECAST GRID */}
            <Card className="flex flex-col gap-4">
              <h3 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3.5 flex items-center justify-between">
                <span>7-Day Agricultural Forecast</span>
                <button
                  onClick={triggerWeatherSync}
                  className="text-xs font-bold text-primary-800 hover:underline cursor-pointer"
                >
                  Force Sync Now
                </button>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {weather.forecast.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-soft/60 hover:bg-surface-soft border border-border-soft/60 rounded-xl flex flex-col items-center text-center gap-2 transition-colors"
                  >
                    <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">{f.day}</span>
                    <div className="my-1.5">{getWeatherIcon(f.icon)}</div>
                    <span className="text-sm font-extrabold text-text-dark leading-none">{f.temp}°C</span>
                    <span className="text-[9px] font-semibold text-text-muted">Rain: {f.rainProb}%</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN (1/3 width on Desktop) */}
          <div className="space-y-6">
            
            {/* A. WIND & SPRAY CYCLE ADVISORY */}
            <Card className="flex flex-col gap-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3 flex items-center gap-2">
                <Wind className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Pesticide Spray Windows
              </h4>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-xl font-semibold">
                  <span>Current Wind: {weather.current.windSpeed} km/h</span>
                  <Badge variant="success">Spray window: Open</Badge>
                </div>
                
                <p className="text-text-muted leading-relaxed font-medium">
                  Ideal chemical spraying conditions require wind speeds between <b>5-15 km/h</b>. Current wind speed of {weather.current.windSpeed} km/h is optimal, avoiding spray drift and ensuring proper foliar dispersion.
                </p>
                <div className="bg-surface-soft/40 border border-border-soft/60 p-3 rounded-lg flex flex-col gap-1">
                  <span className="font-bold text-[10px] uppercase">Best Spray Hours today:</span>
                  <span className="text-text-dark font-semibold">06:30 AM to 08:30 AM (High Dew warning)</span>
                </div>
              </div>
            </Card>

            {/* B. MICRO-CLIMATE DETAILS */}
            <Card className="flex flex-col gap-4">
              <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3">
                Micro-climate Parameters
              </h4>
              
              <div className="divide-y divide-border-soft/60">
                <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-muted flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-text-muted" /> Heat Index</span>
                  <span className="text-text-dark font-extrabold">35°C</span>
                </div>

                <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-muted flex items-center gap-1.5"><Droplets className="w-4 h-4 text-text-muted" /> Rel. Humidity</span>
                  <span className="text-text-dark font-extrabold">{weather.current.humidity}%</span>
                </div>

                <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-muted flex items-center gap-1.5"><Sun className="w-4 h-4 text-text-muted" /> UV Exposure</span>
                  <span className="text-text-dark font-extrabold">{weather.current.uvIndex} (Moderate)</span>
                </div>
              </div>
            </Card>

            <div className="flex items-start gap-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-xl p-4 text-xs leading-relaxed font-semibold">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <b>Micro-station note:</b> Real weather API integrations will connect directly to Open-Meteo coordinates mapped via farmer village profile settings.
              </div>
            </div>

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
export default Weather;
