import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Title */}
      <div
        className="text-2xl font-bold text-blue-600"
        style={{ marginLeft: "10px", marginRight: "32px" }}
      >
        FlowHub
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "24px" }}>
        <Link to="/home" className="px-4 hover:text-blue-600 transition">
          Home
        </Link>
        <Link to="/dashboard" className="px-4 hover:text-blue-600 transition">
          Dashboard
        </Link>
        <Link to="/teams" className="px-4 hover:text-blue-600 transition">
          Teams
        </Link>
        <Link to="/projects" className="px-4 hover:text-blue-600 transition">
          Projects
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="px-4 hover:text-blue-600 transition">
              Login
            </Link>
            <Link to="/signup" className="px-4 hover:text-blue-600 transition">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/mypage" className="px-4 hover:text-blue-600 transition">
              My Page
            </Link>
            <Link
              onClick={handleLogout}
              className="px-4 text-red-600 hover:underline"
            >
              Logout
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
