import React, { Suspense, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CreateEditListingPage from "./pages/createlisting/CreateListing.jsx";
import { loginUser } from "./services/api.jsx";
import { CircularProgress } from "@mui/material";

const ListingsAdmin = React.lazy(() => import("./pages/admin/ListingsAdmin.jsx"));
const UsersAdmin = React.lazy(() => import("./pages/admin/UsersAdmin.jsx"));
const ReportsAdmin = React.lazy(() => import("./pages/admin/ReportsAdmin.jsx"));
const SettingsAdmin = React.lazy(() => import("./pages/admin/SettingsAdmin.jsx"));
const Login = React.lazy(() => import("./pages/login/Login.jsx"));
const HomePage = React.lazy(() => import("./pages/homepage/HomePage.jsx"));
const NotFoundPage = React.lazy(() => import("./pages/notfoundpage/NotFoundPage.jsx"));
const Listings = React.lazy(() => import("./pages/listings/Listings.jsx"));
const ListingDetails = React.lazy(() => import("./pages/listingdetails/ListingDetails.jsx"));
const FeaturedListings = React.lazy(() => import("./pages/featuredlistings/FeaturedListings.jsx"));
const Register = React.lazy(() => import("./pages/register/register.jsx"));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        setIsLoggedIn(true);
        navigate("/listings"); // Redirect to listings page after login
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <Layout isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout}>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/listings" element={<ListingsAdmin />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/reports" element={<ReportsAdmin />} />
          <Route path="/admin/settings" element={<SettingsAdmin />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/create-listing" element={<CreateEditListingPage />} />
          <Route path="/featuredlistings" element={<FeaturedListings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;