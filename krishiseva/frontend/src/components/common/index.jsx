import React, { useState, useEffect } from "react";
import { Search, X, AlertTriangle, CheckCircle, Info, CloudSun, Calendar, Landmark, User, Settings, ArrowRight, ArrowLeft } from "lucide-react";

// ==========================================
// 1. BUTTON
// ==========================================
export const Button = ({
  children,
  variant = "primary", // primary, secondary, outline, ghost, danger
  size = "md", // sm, md, lg
  className = "",
  disabled = false,
  onClick,
  type = "button",
  icon: Icon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]";
  
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 focus:ring-emerald-600 shadow-xs hover:shadow-sm",
    secondary: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 active:bg-emerald-200 focus:ring-emerald-300 border border-emerald-200",
    outline: "border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-400 shadow-2xs",
    ghost: "text-slate-700 bg-transparent hover:bg-slate-100/80 active:bg-slate-200 focus:ring-slate-400",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-xs"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs font-bold gap-2",
    lg: "px-5 py-2.5 text-sm font-bold gap-2.5"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

// ==========================================
// 2. CARD
// ==========================================
export const Card = ({
  children,
  className = "",
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 transition-all duration-200 ${
        hoverable ? "hover:shadow-md hover:border-emerald-300/80 cursor-pointer hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 3. BADGE
// ==========================================
export const Badge = ({
  children,
  variant = "info", // info, success, warning, danger, primary
  className = ""
}) => {
  const variants = {
    primary: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    info: "bg-sky-50 text-sky-800 border border-sky-200/80",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    warning: "bg-amber-50 text-amber-900 border border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border border-rose-200/80"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// 4. MODAL
// ==========================================
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = ""
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" onClick={onClose} />
      
      {/* Container */}
      <div className={`relative bg-white rounded-xl shadow-xl max-w-lg w-full z-10 overflow-hidden border border-border-soft animate-in fade-in zoom-in-95 duration-200 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft bg-bg-warm">
          <h3 className="font-semibold text-lg text-text-dark">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-soft hover:text-text-dark transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border-soft bg-bg-warm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. DRAWER
// ==========================================
export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right", // left, right
  className = ""
}) => {
  if (!isOpen) return null;

  const posStyles = {
    right: "right-0 top-0 bottom-0 w-80 max-w-full animate-in slide-in-from-right duration-250",
    left: "left-0 top-0 bottom-0 w-80 max-w-full animate-in slide-in-from-left duration-250"
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      
      {/* Content */}
      <div className={`absolute bg-white shadow-2xl z-10 flex flex-col h-full border-l border-border-soft ${posStyles[position]} ${className}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft bg-bg-warm">
          <h3 className="font-semibold text-lg text-text-dark">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-soft cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. INPUT
// ==========================================
export const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 text-sm border bg-white rounded-lg transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-border-soft focus:border-primary-500 focus:ring-primary-100"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};

// ==========================================
// 7. SELECT
// ==========================================
export const Select = ({
  label,
  id,
  options = [], // [{value, label}]
  value,
  onChange,
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 text-sm border bg-white rounded-lg transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-border-soft focus:border-primary-500 focus:ring-primary-100"
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};

// ==========================================
// 8. SEARCH INPUT
// ==========================================
export const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
  onClear,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-8 py-2 text-sm border border-border-soft bg-white rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-dark cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// 9. TABS
// ==========================================
export const Tabs = ({
  tabs = [], // [{id, label}]
  activeTab,
  onChange,
  className = ""
}) => {
  return (
    <div className={`border-b border-border-soft flex gap-6 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3 text-sm font-semibold tracking-wide border-b-2 cursor-pointer transition-all ${
              isActive
                ? "border-primary-800 text-primary-800"
                : "border-transparent text-text-muted hover:text-text-dark"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 10. DROPDOWN
// ==========================================
export const Dropdown = ({
  trigger,
  items = [], // [{label, onClick, icon: Icon}]
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener("click", close);
    }
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 bg-white border border-border-soft rounded-lg shadow-lg z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${className}`}>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className="w-full text-left px-4 py-2 text-sm text-text-dark hover:bg-surface-soft flex items-center gap-2 cursor-pointer"
            >
              {item.icon && <item.icon className="w-4 h-4 text-text-muted" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 11. DATA TABLE
// ==========================================
export const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto w-full border border-border-soft rounded-xl bg-white shadow-xs">
    <table className={`min-w-full divide-y divide-border-soft text-left text-sm ${className}`}>
      {children}
    </table>
  </div>
);

export const DataTable = ({
  columns = [], // [{header, accessor, render}]
  data = [],
  emptyMessage = "No data available",
  className = ""
}) => {
  return (
    <Table className={className}>
      <thead className="bg-bg-warm font-semibold text-text-muted">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="px-5 py-3 text-xs uppercase tracking-wider">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border-soft bg-white text-text-dark">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-5 py-10 text-center text-text-muted">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-primary-50/20 transition-colors">
              {columns.map((col, colIdx) => {
                const content = col.render
                  ? col.render(row, rowIdx)
                  : row[col.accessor];
                return (
                  <td key={colIdx} className="px-5 py-4 whitespace-nowrap">
                    {content}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

// ==========================================
// 12. STAT CARD
// ==========================================
export const StatCard = ({
  title,
  value,
  unit = "",
  change = null, // e.g. {value: "+5%", type: "positive/negative/neutral"}
  icon: Icon,
  className = ""
}) => {
  const changeColors = {
    positive: "text-emerald-600 bg-emerald-50 border border-emerald-100",
    negative: "text-red-600 bg-red-50 border border-red-100",
    neutral: "text-text-muted bg-surface-soft border border-border-soft"
  };

  return (
    <Card className={`flex items-start justify-between ${className}`}>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-text-dark">{value}</span>
          {unit && <span className="text-sm font-medium text-text-muted ml-0.5">{unit}</span>}
        </div>
        {change && (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold mt-1.5 w-fit ${changeColors[change.type]}`}>
            {change.value}
          </span>
        )}
      </div>
      {Icon && (
        <div className="p-2.5 rounded-lg bg-primary-50 text-primary-800 border border-primary-100">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </Card>
  );
};

// ==========================================
// 13. CHART CARD
// ==========================================
export const ChartCard = ({
  title,
  subtitle,
  children,
  className = ""
}) => {
  return (
    <Card className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col">
        <h4 className="font-bold text-base text-text-dark">{title}</h4>
        {subtitle && <p className="text-xs text-text-muted font-medium">{subtitle}</p>}
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        {children}
      </div>
    </Card>
  );
};

// ==========================================
// 14. ALERT CARD
// ==========================================
export const AlertCard = ({
  title,
  description,
  type = "info", // info, warning, danger, success
  action,
  className = ""
}) => {
  const styles = {
    info: "border-l-4 border-blue-500 bg-blue-50/50 text-blue-900",
    warning: "border-l-4 border-amber-500 bg-amber-50/50 text-amber-900",
    danger: "border-l-4 border-rose-500 bg-rose-50/50 text-rose-900",
    success: "border-l-4 border-emerald-500 bg-emerald-50/50 text-emerald-900"
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    danger: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
  };

  return (
    <div className={`p-4 rounded-xl border border-border-soft flex gap-3 items-start shadow-xs ${styles[type]} ${className}`}>
      {icons[type]}
      <div className="flex-1 flex flex-col gap-1">
        <h4 className="font-semibold text-sm leading-snug">{title}</h4>
        {description && <p className="text-xs opacity-90 leading-relaxed font-medium">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
};

// ==========================================
// 15. RECOMMENDATION CARD
// ==========================================
export const RecommendationCard = ({
  recommendation, // {priority, category, title, explanation, reason, action, benefit, timestamp}
  onActionClick,
  className = ""
}) => {
  const isHigh = recommendation.priority === "HIGH";
  
  return (
    <Card className={`border-l-4 ${isHigh ? "border-l-rose-500" : "border-l-primary-600"} flex flex-col gap-3.5 relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <Badge variant={recommendation.category === "Irrigation" ? "info" : recommendation.category === "Pest Control" ? "danger" : recommendation.category === "Fertilizer" ? "warning" : "primary"}>
          {recommendation.category}
        </Badge>
        <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${isHigh ? "bg-red-500 text-white animate-pulse" : "bg-primary-100 text-primary-800"}`}>
          {recommendation.priority}
        </span>
      </div>
      
      <div>
        <h4 className="font-bold text-base text-text-dark leading-snug">{recommendation.title}</h4>
        <p className="text-xs text-text-muted mt-1.5 leading-relaxed font-medium">{recommendation.explanation}</p>
      </div>

      <div className="bg-surface-soft/60 rounded-lg p-3 flex flex-col gap-1.5 border border-border-soft/60 text-xs">
        <div className="leading-relaxed">
          <span className="font-bold text-text-dark uppercase tracking-wider text-[10px]">Reason: </span>
          <span className="text-text-muted font-medium">{recommendation.reason}</span>
        </div>
        <div className="leading-relaxed">
          <span className="font-bold text-text-dark uppercase tracking-wider text-[10px]">Benefit: </span>
          <span className="text-primary-800 font-semibold">{recommendation.benefit}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border-soft pt-3.5 mt-1">
        <span className="text-[10px] font-semibold text-text-muted">
          {new Date(recommendation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(recommendation.timestamp).toLocaleDateString()}
        </span>
        <Button size="sm" onClick={() => onActionClick && onActionClick(recommendation)}>
          Take Action
        </Button>
      </div>
    </Card>
  );
};

// ==========================================
// 16. WEATHER CARD
// ==========================================
export const WeatherCard = ({
  weather, // {current: {temp, humidity, rainProbability, condition, feelsLike}}
  className = ""
}) => {
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-950 text-white flex items-center justify-between border-0 p-6 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-accent-300" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-200">Live Weather Advisory</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-4xl font-extrabold tracking-tight">{weather.current.temp}°C</span>
          <span className="text-xs font-semibold text-primary-200">Feels like {weather.current.feelsLike}°C</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-primary-100 mt-1.5">
          <span>Humid: <b>{weather.current.humidity}%</b></span>
          <span>Rain Prob: <b>{weather.current.rainProbability}%</b></span>
          <span>Wind: <b>{weather.current.windSpeed} km/h {weather.current.windDir}</b></span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-lg font-bold text-accent-300">{weather.current.condition}</span>
        <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-primary-800 text-accent-300 border border-primary-700">
          Hadgud Village
        </span>
      </div>
    </Card>
  );
};

// ==========================================
// 17. CROP CARD
// ==========================================
export const CropCard = ({
  crop, // {name, variety, area, sowingDate, currentStage, expectedHarvest, healthStatus, pestWarning}
  onClick,
  className = ""
}) => {
  const currentIdx = crop.timeline.findIndex((t) => t.stage === crop.currentStage);
  const progressPercent = Math.round((currentIdx / (crop.timeline.length - 1)) * 100);

  const statusColors = {
    Good: "success",
    Alert: "warning",
    Critical: "danger"
  };

  return (
    <Card hoverable className={`flex flex-col gap-4 ${className}`} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h4 className="font-bold text-lg text-text-dark">{crop.name}</h4>
          <span className="text-xs text-text-muted font-semibold">{crop.variety} • {crop.area} Acres</span>
        </div>
        <Badge variant={statusColors[crop.healthStatus]}>
          Health: {crop.healthStatus}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-muted">Lifecycle Stage: <span className="text-primary-800 font-bold">{crop.currentStage}</span></span>
          <span className="text-text-muted">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-surface-soft border border-border-soft rounded-full overflow-hidden">
          <div className="h-full bg-primary-800 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs border-t border-border-soft pt-3.5 mt-1 font-medium text-text-muted">
        <span>Sowed: {crop.sowingDate}</span>
        <span>Harvest: {crop.expectedHarvest}</span>
      </div>
      
      {crop.pestWarning && (
        <div className="bg-red-50 text-red-800 border border-red-100 rounded-lg p-2.5 flex items-center gap-2 text-xs font-semibold animate-pulse mt-0.5">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-600" />
          Active Pest Warning: Scanner Scan Recommended!
        </div>
      )}
    </Card>
  );
};

// ==========================================
// 18. SCHEME CARD
// ==========================================
export const SchemeCard = ({
  scheme, // {name, department, eligibility, benefits, applicationStatus, deadline, benefitType}
  onCheckClick,
  className = ""
}) => {
  const statusColors = {
    Approved: "success",
    Pending: "warning",
    Eligible: "primary",
    Applied: "info"
  };

  return (
    <Card className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-primary-800 uppercase tracking-wider">{scheme.benefitType}</span>
          <h4 className="font-bold text-base text-text-dark leading-snug">{scheme.name}</h4>
          <span className="text-xs text-text-muted font-medium">{scheme.department}</span>
        </div>
        <Badge variant={statusColors[scheme.applicationStatus] || "info"}>
          {scheme.applicationStatus}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <span className="font-semibold text-text-dark">Benefits:</span>
        <p className="text-text-muted leading-relaxed font-medium bg-surface-soft/40 border border-border-soft/40 p-2.5 rounded-lg">
          {scheme.benefits}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border-soft pt-3.5 mt-1">
        <span className="text-xs text-text-muted font-semibold">Deadline: <span className="text-text-dark font-bold">{scheme.deadline}</span></span>
        {scheme.applicationStatus === "Eligible" && (
          <Button size="sm" onClick={() => onCheckClick && onCheckClick(scheme)}>
            Check Eligibility
          </Button>
        )}
      </div>
    </Card>
  );
};

// ==========================================
// 19. LOADING SKELETON
// ==========================================
export const LoadingSkeleton = ({ rows = 3, className = "" }) => {
  return (
    <div className={`flex flex-col gap-3 w-full p-4 border border-border-soft rounded-xl bg-white ${className}`}>
      <div className="h-6 bg-surface-soft rounded-md animate-shimmer w-1/3" />
      <div className="h-4 bg-surface-soft rounded-md animate-shimmer w-full mt-2" />
      <div className="h-4 bg-surface-soft rounded-md animate-shimmer w-5/6" />
      <div className="h-4 bg-surface-soft rounded-md animate-shimmer w-2/3" />
    </div>
  );
};

// ==========================================
// 20. EMPTY STATE
// ==========================================
export const EmptyState = ({
  title = "No items found",
  description = "There are no records matching your request at this time.",
  actionLabel,
  onAction,
  icon: Icon,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-soft rounded-xl bg-white/50 max-w-md mx-auto my-4 ${className}`}>
      {Icon ? (
        <div className="p-4 bg-surface-soft text-text-muted rounded-full mb-4">
          <Icon className="w-8 h-8" />
        </div>
      ) : (
        <div className="p-4 bg-surface-soft text-text-muted rounded-full mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
      )}
      <h3 className="font-bold text-lg text-text-dark">{title}</h3>
      <p className="text-sm text-text-muted font-medium mt-2 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// ==========================================
// 21. ERROR STATE
// ==========================================
export const ErrorState = ({
  title = "Service Temporarily Unavailable",
  message = "Unable to load information from the server.",
  onRetry,
  retryLabel = "Retry Connection",
  className = ""
}) => {
  return (
    <div className={`p-6 border border-red-200 rounded-xl bg-red-50 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto my-6 ${className}`}>
      <AlertTriangle className="w-8 h-8 text-red-500" />
      <div className="flex flex-col gap-1">
        <h4 className="font-bold text-red-900 text-base">{title}</h4>
        <p className="text-xs text-red-700 font-medium leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

// ==========================================
// 22. TOAST
// ==========================================
export const Toast = ({
  message,
  type = "success", // success, error, warning
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: "bg-emerald-800 text-white shadow-emerald-900/10",
    error: "bg-red-800 text-white shadow-red-900/10",
    warning: "bg-amber-800 text-white shadow-amber-900/10"
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 shrink-0 text-accent-300" />,
    error: <AlertTriangle className="w-5 h-5 shrink-0 text-red-200" />,
    warning: <AlertTriangle className="w-5 h-5 shrink-0 text-amber-200" />
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-200 ${bgColors[type]}`}>
      {icons[type]}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="p-0.5 rounded hover:bg-white/20 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ==========================================
// 23. AVATAR
// ==========================================
export const Avatar = ({ name = "Farmer", className = "" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`w-10 h-10 rounded-full bg-primary-800 text-white border border-primary-700 flex items-center justify-center font-bold text-sm tracking-wide ${className}`}>
      {initials}
    </div>
  );
};

// ==========================================
// 24. BREADCRUMB
// ==========================================
export const Breadcrumb = ({
  items = [], // [{label, onClick}]
  className = ""
}) => {
  return (
    <nav className={`flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider ${className}`}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-border-soft font-bold">/</span>}
          {item.onClick ? (
            <button onClick={item.onClick} className="hover:text-text-dark transition-colors cursor-pointer">
              {item.label}
            </button>
          ) : (
            <span className="text-text-dark font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ==========================================
// 25. PAGE HEADER
// ==========================================
export const PageHeader = ({
  title,
  subtitle,
  action, // React element e.g. <Button>Action</Button>
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-soft pb-5 mb-6 ${className}`}>
      <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-dark m-0 leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-text-muted mt-1.5 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};



