// ===========================================
// File: src/App.tsx
// Description: Main routing configuration for Reflectra
// ===========================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Find from "./pages/Find"; // ✅ added import

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Landing page */}
        <Route path="/" element={<Home />} />

        {/* ✅ Authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Protected routes after login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/find" element={<Find />} /> {/* ✅ Added Find route */}
      </Routes>
    </Router>
  );
}