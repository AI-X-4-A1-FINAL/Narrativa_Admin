import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/AdminSider";
import Header from "./components/AdminHeader";
import Footer from "./components/AdminFooter";

import StatisticsPage from "./pages/StatisticsPage";
import UserManagementPage from "./pages/UserManagementPage";
import NoticeManagementPage from "./pages/NoticeManagementPage";

const Root: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route 
                path="/" 
                element={<StatisticsPage />} 
              />
              <Route path="/user-management" element={<UserManagementPage />} />
              <Route path="/notice-management" element={<NoticeManagementPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default Root;
