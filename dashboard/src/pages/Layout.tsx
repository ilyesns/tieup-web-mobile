import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";
import { useAuth } from "../hooks/auth_context";
import ProtectedRoute from "../ProtectedRoute";

// Page components
import { Dashboard } from "./Dashboard";
import { Customers } from "./Customers";
import { Services } from "./Services";
import { Orders } from "./Orders";
import { Offers } from "./Offers";
import { Withdraw } from "./Withdraw";
import { Profile } from "./Profile";
import { Login } from "./Login";
import { Unauthorized } from "./Unauthorized";

export const Layout = () => {
  const { isLoggedIn } = useAuth(); // Check if the user is logged in

  return (
    <BrowserRouter>
      <div className="flex bg-slate-100 justify-center">
        {/* Conditionally render the sidebar */}
        {isLoggedIn && <SideBar />}
        <div className={isLoggedIn ? "w-4/5 flex-1" : "w-full"}>
          {/* The NavBar can also be conditionally rendered if needed */}
          {isLoggedIn && <NavBar />}

          <Routes>
            {/* Protected Routes */}
            <Route
              path="/"
              element={<ProtectedRoute Element={<Dashboard />} />}
            />
            <Route
              path="/customers"
              element={<ProtectedRoute Element={<Customers />} />}
            />
            <Route
              path="/services"
              element={<ProtectedRoute Element={<Services />} />}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute Element={<Orders />} />}
            />
            <Route
              path="/offers"
              element={<ProtectedRoute Element={<Offers />} />}
            />
            <Route
              path="/withdraw"
              element={<ProtectedRoute Element={<Withdraw />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute Element={<Profile />} />}
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default Redirects */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
/**
 * 
export const Layout = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-row bg-slate-100 ">
        <SideBar />
        <div className="w-4/5 flex-1">
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

 */
