import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        //alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      alert("Error logging in.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-screen-md mx-auto" style={{ maxWidth: '768px' }} >
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login to FlowHub</h2>
                <label className="block mb-2 font-semibold" htmlFor="email">
                Email
                </label>
                <input
                id="email"
                type="email"
                className="w-full mb-4 p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <label className="block mb-2 font-semibold" htmlFor="password">
                Password
                </label>
                <input
                id="password"
                type="password"
                className="w-full mb-6 p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                Log In
                </button>
                <p className="mt-4 text-sm text-center">
                    Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
                </p>
            </form>
      </div>
    </div>
  );
};

export default Login;
