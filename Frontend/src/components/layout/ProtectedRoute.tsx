import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
