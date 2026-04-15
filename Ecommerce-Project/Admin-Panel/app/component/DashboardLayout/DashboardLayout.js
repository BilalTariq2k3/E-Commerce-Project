"use client";

import dynamic from "next/dynamic";
import Sidebar from "../Slidebar/Slidebar";

const Header = dynamic(() => import("../Header/Header"), { ssr: false });
const AdminChatWidget = dynamic(() => import("../chat/AdminChatWidget"), {
  ssr: false,
});

export default function DashboardLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="wrapper">
        <Header />
        <div className="dashboard-content">{children}</div>
        <AdminChatWidget />
      </div>
    </div>
  );
}
