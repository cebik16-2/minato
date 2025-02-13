import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import "../../styles/pages/AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: "Manage Listings",
      description: "View, edit, or delete listings on the platform.",
      buttonText: "View Listings",
      onClick: () => navigate("/admin/listings"),
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts and permissions.",
      buttonText: "View Users",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Reports & Analytics",
      description: "Access detailed insights into platform activity.",
      buttonText: "View Reports",
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "System Settings",
      description: "Configure application settings and alerts.",
      buttonText: "Go to Settings",
      onClick: () => navigate("/admin/settings"),
    },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>
        Welcome to the Admin Dashboard! Manage listings, users, and reports
        easily.
      </p>

      <div className="dashboard-grid">
        {dashboardSections.map((section, index) => (
          <DashboardCard key={index} {...section} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
