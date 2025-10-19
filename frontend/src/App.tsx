import { useState } from "react";
import "./App.css";
import mainImage from "./imgs/mainimage.gif";

export default function App() {
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverCreate, setHoverCreate] = useState(false);

  return (
    <div className="App">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        {/* App Title */}
        <h1 className="title">Reflectra</h1>

        {/* LOGIN SECTION */}
        <div
          className="login-container"
          onMouseEnter={() => setHoverLogin(true)}
          onMouseLeave={() => setHoverLogin(false)}
        >
          <button className="login-button">Login</button>

          {/* Login Modal — positioned above */}
          <div className={`modal above-login ${hoverLogin ? "show" : ""}`}>
            <div className="modal-content">
              <h3>Login</h3>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="modal-btn">Login</button>
            </div>
          </div>
        </div>

        {/* CREATE ACCOUNT SECTION */}
        <div
          className="link-container"
          onMouseEnter={() => setHoverCreate(true)}
          onMouseLeave={() => setHoverCreate(false)}
        >
          <button className="link-button">Create an Account</button>

          {/* Create Account Modal — positioned below */}
          <div className={`modal below-link ${hoverCreate ? "show" : ""}`}>
            <div className="modal-content">
              <h3>Create Account</h3>
              <input type="text" placeholder="Username" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="modal-btn">Submit</button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <p></p>
      </div>
    </div>
  );
}
