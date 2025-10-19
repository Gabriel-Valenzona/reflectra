import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import mainImage from "./assets/imgs/mainimage.gif";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


export default function App() {
  return (
    <Router>
      <div className="App">
        <div
          className="hero-section"
          style={{ backgroundImage: `url(${mainImage})` }}
        >
          {/* App Title */}
          <h1 className="title">Reflectra</h1>

          {/* Buttons to navigate */}
          <div className="button-container">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="link-button">
              Create an Account
            </Link>
          </div>
        </div>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}
