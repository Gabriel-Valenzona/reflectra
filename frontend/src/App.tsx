// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";   // ✅ newly added
import Settings from "./pages/Settings"; // ✅ newly added

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
      </Routes>
    </Router>
  );
}