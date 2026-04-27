import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MainLayout from "../components/MainLayout";
import Support from "../pages/Support";
import Profile from "../pages/Profile";
import Saved from "../pages/Saved";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Discover />} />
          <Route path="/apartments" element={<Neighborhoods />} />
          <Route path="/apartments/:id" element={<ApartmentDetails />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<Reservations />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
