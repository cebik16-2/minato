import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginModal from "./components/LoginModal"; // ✅ new modal

import { useAuth } from "./context/AuthContext";
import { CircularProgress } from "@mui/material";

const ListingsAdmin = React.lazy(() => import("./pages/admin/ListingsAdmin"));
const UsersAdmin = React.lazy(() => import("./pages/admin/UsersAdmin"));
const ReportsAdmin = React.lazy(() => import("./pages/admin/ReportsAdmin"));
const SettingsAdmin = React.lazy(() => import("./pages/admin/SettingsAdmin"));
const AdminDashboardPage = React.lazy(() => import("./pages/admin/AdminDashboardPage"));
const CreateEditListingPage = React.lazy(() => import("./pages/createlisting/CreateListing"));
const HomePage = React.lazy(() => import("./pages/homepage/HomePage"));
const NotFoundPage = React.lazy(() => import("./pages/notfoundpage/NotFoundPage"));
const Listings = React.lazy(() => import("./pages/listings/Listings"));
const ListingDetails = React.lazy(() => import("./pages/listingdetails/ListingDetails"));
const FeaturedListings = React.lazy(() => import("./pages/featuredlistings/FeaturedListings"));
const Register = React.lazy(() => import("./pages/register/register"));

const App = () => {
  const { isLoginModalOpen } = useAuth();

  return (
    <>
      {isLoginModalOpen && <LoginModal />}
      <Layout>
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
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
};

export default App;
