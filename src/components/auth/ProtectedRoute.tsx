// src/components/auth/ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Function to check if user is authenticated
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  console.log('Checking auth - Token exists:', !!token); // Debug log
  return !!token;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: Checking authentication...'); // Debug log
    const authenticated = isAuthenticated();
    console.log('ProtectedRoute: Authenticated =', authenticated); // Debug log
    setHasAccess(authenticated);
    setIsChecking(false);
  }, []);

  // Show loading spinner while checking auth status
  if (isChecking) {
    console.log('ProtectedRoute: Still checking...'); // Debug log
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!hasAccess) {
    console.log('ProtectedRoute: No access, redirecting to login...'); // Debug log
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Access granted, rendering children'); // Debug log
  return <>{children}</>;
}
