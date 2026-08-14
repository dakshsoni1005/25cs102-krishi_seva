import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Card,
  PageHeader,
  SearchInput,
  Select,
  DataTable,
  Toast,
  ErrorState
} from "../components/common";
import { Star, TrendingUp, Info } from "lucide-react";
import { marketService } from "../services/marketService";

export const MarketPrices = () => {
  const { t, addLocalNotification } = useApp();

  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  const [trendData, setTrendData] = useState([]);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortBy, setSortBy] = useState("crop");

  const cropOptions = [
    { value: "", label: "All Crops" },
    { value: "Cotton", label: "Cotton (કપાસ)" },
    { value: "Groundnut", label: "Groundnut (મગફળી)" },
    { value: "Wheat", label: "Wheat (ઘઉં)" },
    { value: "Castor", label: "Castor (દિવેલા)" },
    { value: "Bajra", label: "Bajra (બાજરી)" },
    { value: "Paddy", label: "Paddy (ડાંગર)" },
    { value: "Mustard", label: "Mustard (રાઈ)" },
    { value: "Sesame", label: "Sesame (તલ)" }
  ];

  const gujaratDistricts = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
    "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
    "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ];

  const districtOptions = [
    { value: "", label: "All Districts" },
    ...gujaratDistricts.map((d) => ({ value: d, label: d }))
  ];

  const sortOptions = [
    { value: "crop", label: "Sort by Crop Name" },
    { value: "price_desc", label: "Highest Avg Price" },
    { value: "price_asc", label: "Lowest Avg Price" }
  ];

  const loadPrices = async () => {
    try {
      setLoading(true);
      setError(false);
      const filters = {
        search: searchTerm,
        crop: cropFilter,
        district: districtFilter,
        sortBy
      };
      const data = await marketService.getMarketPrices(filters);
      setMarkets(data);

      const watch = await marketService.getWatchlist();
      setWatchlist(watch);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, [searchTerm, cropFilter, districtFilter, sortBy]);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const trends = await marketService.getPriceTrends(selectedCrop);
        setTrendData(trends);
      } catch (err) {
        setTrendData([]);
      }
    };
    loadTrends();
  }, [selectedCrop]);

  const handleToggleWatchlist = async (id, cropName, marketName) => {
    try {
      const updated = await marketService.toggleWatchlist(id);
      setWatchlist(updated);
      
      const isAdded = updated.includes(id);
      setToast({
        type: "success",
        message: isAdded
          ? `Added ${cropName} (${marketName}) to watchlist.`
          : `Removed ${cropName} (${marketName}) from watchlist.`
      });
      
      addLocalNotification(
        "Watchlist Updated",
        `${cropName} in ${marketName} ${isAdded ? "added to" : "removed from"} price watchlist.`,
        "Market",
        "info"
      );
    } catch (err) {
      setToast({ type: "error", message: "Failed to update watchlist." });
    }
  };

  const chartHeight = 120;
  const chartWidth = 320;
  const maxPriceVal = trendData.length > 0 ? Math.max(...trendData.map((d) => d.price)) : 8000;
  const minPriceVal = trendData.length > 0 ? Math.min(...trendData.map((d) => d.price)) : 1000;
  const priceRange = maxPriceVal - minPriceVal || 1;
  const points = trendData
    .map((d, i) => {
      const x = (i / (trendData.length - 1 || 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((d.price - minPriceVal) / priceRange) * (chartHeight - 30) - 15;
      return `${x},${y}`;
    })
    .join(" ");

  const tableColumns = [
    {
      header: "Watch",
      accessor: "id",
      render: (row) => {
        const isWatched = watchlist.includes(row.id);
        return (
          <button
            onClick={() => handleToggleWatchlist(row.id, row.crop, row.market)}
            className="p-1 text-text-muted hover:text-amber-500 transition-colors cursor-pointer"
          >
            <Star className={`w-5.5 h-5.5 ${isWatched ? "fill-amber-400 text-amber-500" : "text-text-muted"}`} />
          </button>
        );
      }
    },
    { header: "Crop Name", accessor: "crop" },
    { header: "APMC Market", accessor: "market" },
    { header: "Location", accessor: "location" },
    {
      header: "Price range",
      accessor: "minPrice",
      render: (row) => (
        <span className="font-semibold text-text-muted">
          ₹{row.minPrice} - ₹{row.maxPrice}
        </span>
      )
    },
    {
      header: "Average Price",
      accessor: "avgPrice",
      render: (row) => (
        <span className="font-extrabold text-primary-800">
          ₹{row.avgPrice} / {row.unit || "quintal"}
        </span>
      )
    },
    {
      header: "Trend",
      accessor: "trend",
      render: (row) => {
        const colors = { up: "text-emerald-600 bg-emerald-50", down: "text-red-600 bg-red-50", flat: "text-text-muted bg-surface-soft" };
        const label = { up: "📈 Up", down: "📉 Down", flat: "✦ Stable" };
        return (
          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${colors[row.trend] || colors.flat}`}>
            {label[row.trend] || label.flat}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("marketPrices")}
        subtitle="Live APMC market intelligence. Track minimum, maximum, and average rates across Gujarat centers to plan sales timing."
      />

      {/* 1. FILTER CONTROLS */}
      <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-border-soft p-5">
        <SearchInput
          placeholder="Search crop or APMC market..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
        />

        <Select
          id="cropFilter"
          options={cropOptions}
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
        />

        <Select
          id="districtFilter"
          options={districtOptions}
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        />

        <Select
          id="sortBySelect"
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </Card>

      {/* 2. MAIN LAYOUT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: APMC DATATABLE (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <Card className="p-10"><div className="h-48 bg-surface-soft animate-shimmer rounded-lg" /></Card>
          ) : error ? (
            <ErrorState
              title="Live Market Data Unavailable"
              message="Unable to load APMC market price feeds from the database endpoint."
              onRetry={loadPrices}
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={markets}
              emptyMessage="No APMC market rates found matching current filters."
            />
          )}
        </div>

        {/* RIGHT COLUMN: PRICE TREND GRAPH */}
        <div className="space-y-6">
          
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-soft pb-3">
              <h4 className="font-extrabold text-base text-text-dark flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                Historical Price Trend
              </h4>
              
              <Select
                id="chartCropSelect"
                options={cropOptions.filter((o) => o.value !== "")}
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-28 text-xs h-8 border-border-soft focus:ring-0 focus:border-border-soft"
              />
            </div>

            {trendData.length > 0 ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-full h-[150px] bg-surface-soft/40 border border-border-soft/60 rounded-xl p-3 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-text-muted flex justify-between uppercase">
                    <span>High: ₹{maxPriceVal}</span>
                    <span>Low: ₹{minPriceVal}</span>
                  </div>
                  
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28 overflow-visible">
                    <line x1="20" y1="20" x2={chartWidth-20} y2="20" stroke="#e4e2d7" strokeWidth="1" strokeDasharray="3" />
                    <line x1="20" y1="60" x2={chartWidth-20} y2="60" stroke="#e4e2d7" strokeWidth="1" strokeDasharray="3" />
                    <line x1="20" y1="100" x2={chartWidth-20} y2="100" stroke="#e4e2d7" strokeWidth="1" strokeDasharray="3" />
                    
                    <polyline
                      fill="none"
                      stroke="#1b4332"
                      strokeWidth="2.5"
                      points={points}
                    />
                    
                    {trendData.map((d, i) => {
                      const x = (i / (trendData.length - 1 || 1)) * (chartWidth - 40) + 20;
                      const y = chartHeight - ((d.price - minPriceVal) / priceRange) * (chartHeight - 30) - 15;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="3.5"
                          className="fill-accent-500 stroke-primary-800 stroke-2"
                        />
                      );
                    })}
                  </svg>

                  <div className="flex justify-between px-3.5 text-[9px] font-extrabold text-text-muted uppercase">
                    {trendData.map((d, i) => <span key={i}>{d.month}</span>)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-text-muted font-medium text-center p-4">
                No historical market price trend data available.
              </div>
            )}
          </Card>

          <div className="flex items-start gap-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-xl p-4 text-xs leading-relaxed font-semibold">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <b>APMC Market Feed:</b> Displays price reports logged in the APMC database.
            </div>
          </div>

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
export default MarketPrices;
