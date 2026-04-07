"use client";

import Header from "../Header/Header";
import Sidebar from "../Slidebar/Slidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="wrapper">
        <Header />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
