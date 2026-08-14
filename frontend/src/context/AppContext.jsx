import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { notificationService } from "../services/notificationService";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [farmer, setFarmer] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState("Hadgud Block A"); // Mock selected farm
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [language, setLanguage] = useState("en"); // en, hi, gu
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple translation dictionary for major UI elements to support i18n architectural readiness
  const translations = {
    en: {
      dashboard: "Dashboard",
      smartKrishi: "Smart Krishi",
      pestScanner: "AI Pest Scanner",
      aiGuru: "Krishi AI Guru",
      soilAdvisory: "Soil Advisory",
      weather: "Weather",
      marketPrices: "Market Prices",
      cropManagement: "Crop Management",
      governmentSchemes: "Government Schemes",
      notifications: "Notifications",
      settings: "Settings",
      profile: "Farmer Profile",
      logout: "Log Out",
      welcome: "Good Morning",
      location: "Location",
      quickActions: "Quick Actions",
      overview: "Overview",
      saveChanges: "Save Changes",
      language: "Language",
      home: "Home",
      about: "About",
      features: "Features"
    },
    gu: {
      dashboard: "ડેશબોર્ડ",
      smartKrishi: "સ્માર્ટ કૃષિ",
      pestScanner: "એઆઈ પેસ્ટ સ્કેનર",
      aiGuru: "કૃષિ એઆઈ ગુરુ",
      soilAdvisory: "જમીન સલાહકાર",
      weather: "હવામાન",
      marketPrices: "બજાર ભાવો",
      cropManagement: "પાક વ્યવસ્થાપન",
      governmentSchemes: "સરકારી યોજનાઓ",
      notifications: "સૂચનાઓ",
      settings: "સેટિંગ્સ",
      profile: "ખેડૂત પ્રોફાઇલ",
      logout: "લોગ આઉટ",
      welcome: "શુભ સવાર",
      location: "સ્થળ",
      quickActions: "ઝડપી ક્રિયાઓ",
      overview: "ઝાંખી",
      saveChanges: "ફેરફારો સાચવો",
      language: "ભાષા",
      home: "મુખ્ય પૃષ્ઠ",
      about: "અમારા વિશે",
      features: "વિશેષતાઓ"
    },
    hi: {
      dashboard: "डैशबोर्ड",
      smartKrishi: "स्मार्ट कृषि",
      pestScanner: "एआई कीट स्कैनर",
      aiGuru: "कृषि एआई गुरु",
      soilAdvisory: "मृदा सलाहकार",
      weather: "मौसम",
      marketPrices: "मंडी भाव",
      cropManagement: "फसल प्रबंधन",
      governmentSchemes: "सरकारी योजनाएं",
      notifications: "सूचनाएं",
      settings: "सेटिंग्स",
      profile: "किसान प्रोफाइल",
      logout: "लॉग आउट",
      welcome: "सुप्रभात",
      location: "स्थान",
      quickActions: "त्वरित कार्रवाई",
      overview: "अवलोकन",
      saveChanges: "बदलाव सहेजें",
      language: "भाषा",
      home: "मुख्य पृष्ठ",
      about: "हमारे बारे में",
      features: "विशेषताएं"
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  // Fetch initial profile and notifications if authenticated
  useEffect(() => {
    const initData = async () => {
      try {
        if (isAuthenticated) {
          const profile = await authService.getCurrentFarmer();
          setFarmer(profile);
          setLanguage(profile.language || "en");
          
          const notifs = await notificationService.getNotifications();
          setNotifications(notifs);
        }
      } catch (err) {
        console.error("Failed to load initial farmer data", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [isAuthenticated]);

  const loginUser = async (mobileNumber, password) => {
    setLoading(true);
    try {
      const res = await authService.login(mobileNumber, password);
      setFarmer(res.farmer);
      setLanguage(res.farmer.language || "en");
      setIsAuthenticated(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (farmerData) => {
    setLoading(true);
    try {
      const res = await authService.register(farmerData);
      setFarmer(res.farmer);
      setLanguage(res.farmer.language || "en");
      setIsAuthenticated(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setFarmer(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateFarmerProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setFarmer(updated);
    if (profileData.language) {
      setLanguage(profileData.language);
    }
    return updated;
  };

  const refreshNotifications = async () => {
    const list = await notificationService.getNotifications();
    setNotifications(list);
  };

  const markNotificationRead = async (id) => {
    const list = await notificationService.markAsRead(id);
    setNotifications(list);
  };

  const markAllNotificationsRead = async () => {
    const list = await notificationService.markAllAsRead();
    setNotifications(list);
  };

  const addLocalNotification = async (title, description, category, priority = "medium") => {
    const list = await notificationService.addNotification({ title, description, category, priority });
    setNotifications(list);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        farmer,
        selectedFarm,
        setSelectedFarm,
        selectedCropId,
        setSelectedCropId,
        language,
        setLanguage,
        notifications,
        t,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        updateFarmerProfile,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        addLocalNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
