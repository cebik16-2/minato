import React, { Suspense, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"; // ✅ No need for Router
import Layout from "./components/Layout.jsx";
import useUsers from "./hooks/useUsers.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import CreateEditListingPage from "./pages/createlisting/CreateListing.jsx";

// Lazy load pages
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { users } = useUsers();
  const navigate = useNavigate(); // ✅ This is now inside a Router context

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username, password) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setIsLoggedIn(true);
      navigate("/"); // ✅ Will now work correctly
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    navigate("/login"); // ✅ Will now work correctly
  };

  return (
    <Layout isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/listings" element={<ListingsAdmin />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/reports" element={<ReportsAdmin />} />
          <Route path="/admin/settings" element={<SettingsAdmin />} />

          {/* Listings */}
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/create-listing" element={<CreateEditListingPage />} />

          {/* Featured Listings */}
          <Route path="/featuredlistings" element={<FeaturedListings listings={[]} />} />

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
