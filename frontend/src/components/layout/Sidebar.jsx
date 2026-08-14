import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, Badge } from "../common";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Cpu,
  Scan,
  MessageSquare,
  Sprout,
  CloudSun,
  IndianRupee,
  CalendarDays,
  Landmark,
  Bell,
  User,
  Settings,
  LogOut,
  Globe
} from "lucide-react";

export const Sidebar = ({ children }) => {
  const { farmer, language, setLanguage, notifications, logoutUser, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const menuItems = [
    {
      group: "Core",
      items: [
        { path: "/dashboard", name: t("dashboard"), icon: LayoutDashboard },
        { path: "/smart-krishi", name: t("smartKrishi"), icon: Cpu },
        { path: "/pest-scanner", name: t("pestScanner"), icon: Scan },
        { path: "/ai-guru", name: t("aiGuru"), icon: MessageSquare }
      ]
    },
    {
      group: "Farm Intelligence",
      items: [
        { path: "/soil-advisory", name: t("soilAdvisory"), icon: Sprout },
        { path: "/weather", name: t("weather"), icon: CloudSun },
        { path: "/market-prices", name: t("marketPrices"), icon: IndianRupee },
        { path: "/crop-management", name: t("cropManagement"), icon: CalendarDays }
      ]
    },
    {
      group: "Government",
      items: [
        { path: "/government-schemes", name: t("governmentSchemes"), icon: Landmark }
      ]
    },
    {
      group: "System",
      items: [
        { path: "/notifications", name: t("notifications"), icon: Bell, badge: unreadNotificationsCount },
        { path: "/profile", name: t("profile"), icon: User },
        { path: "/settings", name: t("settings"), icon: Settings }
      ]
    }
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const currentPath = location.pathname;

  const NavLink = ({ item, onClick }) => {
    const Icon = item.icon;
    const isActive = currentPath === item.path;
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all relative group cursor-pointer ${
          isActive
            ? "bg-primary-800 text-white shadow-xs"
            : "text-text-muted hover:bg-surface-soft hover:text-text-dark"
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-accent-300" : "text-text-muted group-hover:text-text-dark"}`} />
        
        {(!isCollapsed || isMobileOpen) && (
          <span className="truncate flex-1">{item.name}</span>
        )}
        
        {item.badge > 0 && (!isCollapsed || isMobileOpen) && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
            {item.badge}
          </span>
        )}
        
        {/* Tooltip for collapsed desktop state */}
        {isCollapsed && !isMobileOpen && (
          <div className="absolute left-14 bg-primary-950 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-md border border-primary-850">
            {item.name}
            {item.badge > 0 && <span className="ml-2 bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">{item.badge}</span>}
          </div>
        )}
      </Link>
    );
  };

  const toggleLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLangMenu(false);
  };

  const getLanguageLabel = () => {
    if (language === "en") return "English";
    if (language === "gu") return "ગુજરાતી";
    if (language === "hi") return "हिन्दी";
    return "English";
  };

  return (
    <div className="min-h-screen bg-bg-warm flex flex-col md:flex-row relative">
      {/* 1. MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden h-16 bg-white border-b border-border-soft flex items-center justify-between px-4 sticky top-0 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-text-muted hover:bg-surface-soft cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <Link to="/dashboard" className="text-xl font-black tracking-tight text-primary-900 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-accent-500 inline-block animate-pulse" />
          KRISHISEVA
        </Link>
        
        <Link to="/notifications" className="p-2 rounded-lg text-text-muted hover:bg-surface-soft relative cursor-pointer">
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          )}
        </Link>
      </header>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white shadow-2xl border-r border-border-soft animate-in slide-in-from-left duration-250 z-10">
            <div className="h-16 border-b border-border-soft flex items-center justify-between px-4 bg-bg-warm">
              <span className="text-lg font-black tracking-tight text-primary-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-500" />
                KRISHISEVA
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-md text-text-muted hover:bg-surface-soft cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
              {menuItems.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-3">
                    {group.group}
                  </span>
                  {group.items.map((item) => (
                    <NavLink key={item.path} item={item} onClick={() => setIsMobileOpen(false)} />
                  ))}
                </div>
              ))}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border-soft bg-bg-warm space-y-3">
              {farmer && (
                <div className="flex items-center gap-3">
                  <Avatar name={farmer.fullName} className="w-9 h-9" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-text-dark truncate leading-tight">{farmer.fullName}</span>
                    <span className="text-[10px] font-semibold text-text-muted truncate">{farmer.village}, {farmer.district}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-border-soft h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-border-soft flex items-center justify-between px-4 shrink-0 bg-bg-warm/50">
          {!isCollapsed && (
            <Link to="/dashboard" className="text-xl font-black tracking-tight text-primary-900 flex items-center gap-2 select-none">
              <span className="w-3.5 h-3.5 rounded-full bg-accent-500" />
              KRISHISEVA
            </Link>
          )}
          {isCollapsed && (
            <Link to="/dashboard" className="mx-auto text-xl font-black text-primary-900 select-none">
              KS
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-soft hover:text-text-dark cursor-pointer ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4.5 h-4.5" /> : <ChevronLeft className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          {menuItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-3 block select-none mb-1.5">
                  {group.group}
                </span>
              )}
              {group.items.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-soft bg-bg-warm/50 shrink-0 space-y-3">
          {farmer && !isCollapsed && (
            <div className="flex items-center gap-3">
              <Avatar name={farmer.fullName} className="w-9 h-9" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-text-dark truncate leading-tight">{farmer.fullName}</span>
                <span className="text-[10px] font-semibold text-text-muted truncate">
                  {farmer.village}, {farmer.district}
                </span>
              </div>
            </div>
          )}
          
          {isCollapsed && farmer && (
            <div className="flex justify-center">
              <Link to="/profile">
                <Avatar name={farmer.fullName} className="w-9 h-9 hover:border-primary-600 transition-colors" />
              </Link>
            </div>
          )}

          {!isCollapsed ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
              {t("logout")}
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer group relative"
            >
              <LogOut className="w-4.5 h-4.5" />
              <div className="absolute left-14 bg-red-950 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-md border border-red-900">
                {t("logout")}
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* 4. MAIN BODY CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* DESKTOP TOP HEADER */}
        <header className="hidden md:flex h-16 border-b border-border-soft bg-white items-center justify-between px-8 sticky top-0 z-20 select-none">
          {/* Active Context Indicators */}
          <div className="flex items-center gap-4 text-xs font-semibold text-text-muted">
            {farmer && (
              <div className="flex items-center gap-1.5 bg-surface-soft px-3 py-1.5 rounded-lg border border-border-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>
                  {t("location")}: <b>{farmer.village}, {farmer.taluka}, {farmer.district}</b>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-surface-soft px-3 py-1.5 rounded-lg border border-border-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
              <span>
                Language: <b>{getLanguageLabel()}</b>
              </span>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            {/* Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 p-2 rounded-lg text-text-muted hover:bg-surface-soft cursor-pointer hover:text-text-dark"
                title="Select Language"
              >
                <Globe className="w-4.5 h-4.5" />
                <span className="text-xs font-semibold uppercase">{language}</span>
              </button>
              
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowLangMenu(false)} />
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-border-soft rounded-lg shadow-lg z-40 py-1 text-sm">
                    <button
                      onClick={() => toggleLanguage("en")}
                      className={`w-full text-left px-3.5 py-2 hover:bg-surface-soft cursor-pointer font-medium ${language === "en" ? "text-primary-800 font-bold" : "text-text-dark"}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => toggleLanguage("gu")}
                      className={`w-full text-left px-3.5 py-2 hover:bg-surface-soft cursor-pointer font-medium ${language === "gu" ? "text-primary-800 font-bold" : "text-text-dark"}`}
                    >
                      ગુજરાતી
                    </button>
                    <button
                      onClick={() => toggleLanguage("hi")}
                      className={`w-full text-left px-3.5 py-2 hover:bg-surface-soft cursor-pointer font-medium ${language === "hi" ? "text-primary-800 font-bold" : "text-text-dark"}`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notification Badge Bell */}
            <Link
              to="/notifications"
              className="p-2 rounded-lg text-text-muted hover:bg-surface-soft hover:text-text-dark relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </Link>

            <div className="w-px h-5 bg-border-soft" />

            {/* Mini User Profile card */}
            {farmer && (
              <Link to="/profile" className="flex items-center gap-2 group cursor-pointer">
                <Avatar name={farmer.fullName} className="w-8.5 h-8.5 group-hover:border-primary-600 transition-colors" />
                <span className="text-sm font-bold text-text-dark group-hover:text-primary-800 transition-colors">
                  {farmer.fullName}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Page Content Slot */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-bg-warm/40">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* 5. MOBILE BOTTOM NAVIGATION TAB BAR */}
        <nav className="md:hidden h-14 bg-white border-t border-border-soft flex items-center justify-around sticky bottom-0 z-45 shrink-0 select-none shadow-lg">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center w-16 h-full text-[10px] font-bold ${
              currentPath === "/dashboard" ? "text-primary-800 font-black" : "text-text-muted"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            Home
          </Link>
          
          <Link
            to="/smart-krishi"
            className={`flex flex-col items-center justify-center w-16 h-full text-[10px] font-bold ${
              currentPath === "/smart-krishi" ? "text-primary-800 font-black" : "text-text-muted"
            }`}
          >
            <Cpu className="w-5 h-5 mb-0.5" />
            Smart Krishi
          </Link>
          
          <Link
            to="/pest-scanner"
            className={`flex flex-col items-center justify-center w-16 h-full text-[10px] font-bold ${
              currentPath === "/pest-scanner" ? "text-primary-800 font-black" : "text-text-muted"
            }`}
          >
            <Scan className="w-5 h-5 mb-0.5" />
            Scanner
          </Link>

          <Link
            to="/ai-guru"
            className={`flex flex-col items-center justify-center w-16 h-full text-[10px] font-bold ${
              currentPath === "/ai-guru" ? "text-primary-800 font-black" : "text-text-muted"
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            Guru AI
          </Link>

          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex flex-col items-center justify-center w-16 h-full text-[10px] font-bold text-text-muted cursor-pointer"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            Menu
          </button>
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
