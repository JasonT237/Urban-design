import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Discover from "../pages/Discover";
import Neighborhoods from "../pages/Neighborhoods";
import ApartmentDetails from "../pages/ApartmentDetails";
import Booking from "../pages/Booking";
import Payment from "../pages/Payment";
import Success from "../pages/Success";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Reservations from "../pages/Reservations";
import ReservationDetails from "../pages/ReservationDetails";
import MainLayout from "../components/MainLayout";
import Support from "../pages/Support";
import Profile from "../pages/Profile";
import Saved from "../pages/Saved";
import { getStoredAuthToken, getStoredUserRole } from "../hooks/useAuthToken";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = getStoredAuthToken();
  const role = getStoredUserRole();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/apartments" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const token = getStoredAuthToken();

  if (token) {
    return <Navigate to="/apartments" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Discover />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/apartments" element={<Neighborhoods />} />
          <Route path="/apartments/:id" element={<ApartmentDetails />} />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/:id"
            element={
              <ProtectedRoute>
                <ReservationDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/support" element={<Support />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
