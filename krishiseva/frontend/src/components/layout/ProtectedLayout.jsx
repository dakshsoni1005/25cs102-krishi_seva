import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Sidebar from "./Sidebar";

export const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-warm flex flex-col items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Animated Spinner Ring */}
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
          <h2 className="text-lg font-bold text-text-dark animate-pulse">Loading KrishiSeva Ecosystem...</h2>
          <p className="text-xs text-text-muted font-medium">Setting up secure farm intelligence data feeds</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Sidebar>{children}</Sidebar>;
};

export default ProtectedLayout;
