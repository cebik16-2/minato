import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CreateEditListingPage from "./pages/createlisting/CreateListing";

// Lazy load other pages
const ListingsAdmin = React.lazy(() => import("./pages/admin/ListingsAdmin"));
const UsersAdmin = React.lazy(() => import("./pages/admin/UsersAdmin"));
const ReportsAdmin = React.lazy(() => import("./pages/admin/ReportsAdmin"));
const SettingsAdmin = React.lazy(() => import("./pages/admin/SettingsAdmin"));
const Login = React.lazy(() => import("./pages/login/Login"));
const HomePage = React.lazy(() => import("./pages/homepage/HomePage"));
const NotFoundPage = React.lazy(() => import("./pages/notfoundpage/NotFoundPage"));
const Listings = React.lazy(() => import("./pages/listings/Listings"));
const ListingDetails = React.lazy(() => import("./pages/listingdetails/ListingDetails"));
const FeaturedListings = React.lazy(() => import("./pages/featuredlistings/FeaturedListings"));

const App = () => {
  return (
    <Router>
      <Layout>
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
    </Router>
  );
};

export default App;
