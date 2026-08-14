import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, Button, PageHeader, Toast } from "../components/common";
import { Bell, CloudSun, Calendar, AlertTriangle, TrendingUp, Landmark, Cpu, Trash2, CheckCheck } from "lucide-react";

export const Notifications = () => {
  const { notifications, t, markNotificationRead, markAllNotificationsRead } = useApp();

  const [activeCategory, setActiveCategory] = useState("all");
  const [toast, setToast] = useState(null);

  const categories = [
    { id: "all", label: "All Alerts" },
    { id: "Weather", label: "Weather", icon: CloudSun },
    { id: "Crop", label: "Crop", icon: Calendar },
    { id: "Pest", label: "Pests & Diseases", icon: AlertTriangle },
    { id: "Market", label: "Market Prices", icon: TrendingUp },
    { id: "Government", label: "Schemes", icon: Landmark },
    { id: "AI Recommendation", label: "AI Advice", icon: Cpu }
  ];

  const getNotifIcon = (category) => {
    const styles = "w-4.5 h-4.5 shrink-0";
    if (category === "Weather") return <CloudSun className={`${styles} text-blue-600`} />;
    if (category === "Crop") return <Calendar className={`${styles} text-emerald-600`} />;
    if (category === "Pest") return <AlertTriangle className={`${styles} text-rose-600`} />;
    if (category === "Market") return <TrendingUp className={`${styles} text-amber-600`} />;
    if (category === "Government") return <Landmark className={`${styles} text-purple-600`} />;
    return <Cpu className={`${styles} text-primary-800`} />;
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setToast({ type: "success", message: "All notifications marked as read." });
  };

  const handleMarkItemRead = async (id, title) => {
    await markNotificationRead(id);
    setToast({ type: "success", message: `Marked "${title}" as read.` });
  };

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === "all" || n.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("notifications")}
        subtitle="Ecosystem notification log. View micro-climate weather hazard notices, disease spreads, and market price watchlists."
        action={
          unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead} icon={CheckCheck}>
              Mark All as Read
            </Button>
          )
        }
      />

      {/* 1. CATEGORY FILTERS */}
      <div className="flex bg-white border border-border-soft p-2.5 rounded-xl overflow-x-auto scrollbar-none gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = notifications.filter(
            (n) => !n.read && (cat.id === "all" || n.category.toLowerCase() === cat.id.toLowerCase())
          ).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-primary-800 text-white"
                  : "bg-surface-soft text-text-muted hover:bg-primary-50 hover:text-primary-800"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
              {cat.label}
              {count > 0 && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                  activeCategory === cat.id ? "bg-white text-primary-800" : "bg-rose-500 text-white"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. ALERTS LIST */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-8 text-center text-xs text-text-muted font-semibold bg-white border border-border-soft">
          No notifications logged in this category.
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 border transition-all relative ${
                notif.read ? "bg-white border-border-soft/60 opacity-80" : "bg-primary-50/10 border-primary-100 shadow-2xs"
              }`}
            >
              {/* Pulsing blue unread circle */}
              {!notif.read && (
                <div className="absolute top-4.5 right-4 w-2.5 h-2.5 bg-primary-800 rounded-full animate-pulse" />
              )}

              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-surface-soft rounded-lg shrink-0">
                  {getNotifIcon(notif.category)}
                </div>
                
                <div className="flex-1 flex flex-col gap-1.5 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-text-dark">{notif.title}</span>
                    <Badge variant={notif.category === "Pest" ? "danger" : notif.category === "Weather" ? "info" : "primary"}>
                      {notif.category}
                    </Badge>
                  </div>
                  
                  <p className="text-text-muted leading-relaxed font-medium">
                    {notif.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-soft/40 text-[10px] font-semibold text-text-muted">
                    <span>
                      {new Date(notif.timestamp).toLocaleDateString()} at {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkItemRead(notif.id, notif.title)}
                        className="text-primary-800 font-extrabold hover:underline cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
export default Notifications;
