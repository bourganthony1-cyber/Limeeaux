import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Landing        from "./pages/Landing";
import Login          from "./pages/Login";
import RideHome       from "./pages/rider/RiderHome";
import RiderTracking  from "./pages/rider/RiderTracking";
import RiderHistory   from "./pages/rider/RiderHistory";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverEarnings  from "./pages/driver/DriverEarnings";
import DriverMap       from "./pages/driver/DriverMap";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminUsers      from "./pages/admin/AdminUsers";
import AdminRides      from "./pages/admin/AdminRides";

function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: "100vh" }}><div className="spinner" /></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function RoleRedirect() {
  const { user, role } = useAuth();
  if (!user)            return <Navigate to="/"        replace />;
  if (role === "driver") return <Navigate to="/driver" replace />;
  if (role === "admin")  return <Navigate to="/admin"  replace />;
  return <Navigate to="/rider" replace />;
}

import { DatabaseProvider } from "./context/DatabaseContext";

export default function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/"      element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Rider */}
            <Route path="/rider" element={<ProtectedRoute allowedRole="rider"><RideHome /></ProtectedRoute>} />
            <Route path="/rider/tracking" element={<ProtectedRoute allowedRole="rider"><RiderTracking /></ProtectedRoute>} />
            <Route path="/rider/history"  element={<ProtectedRoute allowedRole="rider"><RiderHistory /></ProtectedRoute>} />

            {/* Driver */}
            <Route path="/driver" element={<ProtectedRoute allowedRole="driver"><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/earnings" element={<ProtectedRoute allowedRole="driver"><DriverEarnings /></ProtectedRoute>} />
            <Route path="/driver/map"      element={<ProtectedRoute allowedRole="driver"><DriverMap /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin"        element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users"  element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/rides"  element={<ProtectedRoute allowedRole="admin"><AdminRides /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DatabaseProvider>
  );
}
