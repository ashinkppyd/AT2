import React, { useContext } from "react";
import {BrowserRouter,Routes,Route,useLocation,Navigate,} from "react-router-dom";

import LoginRegister from "./Autho/LoginRegister";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Shop from "./Shop/Shop";
import Cart from "./pages/Cart";
import Details from "./pages/Details";
import Blog from "./Blog/Blog";
import Checkout from "./pages/CheckOut";
import Profile from "./pages/Profile";

import Dashboard from "./admin/Dashboard";
import UserManagement from "./admin/UserManagement";
import ProductManagement from "./admin/ProductManagement";
import AdNavbar from "./admin/AdNavbar";
import OrderItems from "./admin/allorder";

import ProtectedRoute from "./Autho/ProtectRoute";
import PublicRoute from "./Autho/PublicRoute";
import { AuthProvider, AuthContext } from "./Autho/AuthContext";


import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";

const stripePromise = loadStripe(
  "pk_test_51SyrEfB9Sl9gJgPblJ2h7qhl32JdKWv0j2IQBmHPtPXfqVmF6e8as0RCz7lTXr9oPGxNi9EON8MOZbt8NyZqTu4r00P67zyanJ"
);

function Layout({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;

  const isAdminRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/usermanagement") ||
    location.pathname.startsWith("/productmanagement");

  if (user?.role?.toLowerCase() === "admin" && isAdminRoute) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <AdNavbar />
        {children}
      </div>
    );
  }

  if (isAdminRoute && user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* AUTH */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginRegister />
                </PublicRoute>
              }
            />

            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />

            {/* USER */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/details/:id"
              element={
                <ProtectedRoute>
                  <Details />
                </ProtectedRoute>
              }
            />

            {/* ✅ ONLY THIS PART CHANGED */}
            <Route
              path="/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                </Elements>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <OrderItems />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usermanagement"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/productmanagement"
              element={
                <ProtectedRoute>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
        <ToastContainer autoClose={1000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
