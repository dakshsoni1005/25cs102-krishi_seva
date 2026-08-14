import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";

// Import Views
import Landing from "./views/Landing";
import Login from "./views/Login";
import Register from "./views/Register";
import Dashboard from "./views/Dashboard";
import SmartKrishi from "./views/SmartKrishi";
import PestScanner from "./views/PestScanner";
import AIGuru from "./views/AIGuru";
import SoilAdvisory from "./views/SoilAdvisory";
import Weather from "./views/Weather";
import MarketPrices from "./views/MarketPrices";
import CropManagement from "./views/CropManagement";
import GovernmentSchemes from "./views/GovernmentSchemes";
import Profile from "./views/Profile";
import Notifications from "./views/Notifications";
import Settings from "./views/Settings";
import { Button } from "./components/common";
import { AlertCircle } from "lucide-react";

// ==========================================
// 404 NOT FOUND PAGE
// ==========================================
const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-warm flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md flex flex-col items-center gap-4 bg-white border border-border-soft p-8 rounded-2xl shadow-sm">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-text-dark m-0 leading-none">404 - Page Not Found</h1>
        <p className="text-sm text-text-muted font-medium mt-2 leading-relaxed">
          The agricultural coordinates or route you are looking for does not exist in the KrishiSeva ecosystem.
        </p>
        <Link to="/" className="w-full mt-4">
          <Button variant="primary" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Authenticated) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/smart-krishi"
            element={
              <ProtectedLayout>
                <SmartKrishi />
              </ProtectedLayout>
            }
          />
          <Route
            path="/pest-scanner"
            element={
              <ProtectedLayout>
                <PestScanner />
              </ProtectedLayout>
            }
          />
          <Route
            path="/ai-guru"
            element={
              <ProtectedLayout>
                <AIGuru />
              </ProtectedLayout>
            }
          />
          <Route
            path="/soil-advisory"
            element={
              <ProtectedLayout>
                <SoilAdvisory />
              </ProtectedLayout>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedLayout>
                <Weather />
              </ProtectedLayout>
            }
          />
          <Route
            path="/market-prices"
            element={
              <ProtectedLayout>
                <MarketPrices />
              </ProtectedLayout>
            }
          />
          <Route
            path="/crop-management"
            element={
              <ProtectedLayout>
                <CropManagement />
              </ProtectedLayout>
            }
          />
          <Route
            path="/government-schemes"
            element={
              <ProtectedLayout>
                <GovernmentSchemes />
              </ProtectedLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedLayout>
                <Notifications />
              </ProtectedLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <Settings />
              </ProtectedLayout>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
