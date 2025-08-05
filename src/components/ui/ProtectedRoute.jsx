import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, fallback = null }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Chargement...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login-authentication" state={{ from: location }} replace />;
  }

  // If role is required but user doesn't have it, show fallback or redirect
  if (requiredRole && userProfile?.role !== requiredRole) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Accès refusé</h2>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;