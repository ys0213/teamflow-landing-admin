import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view this page.</p>
      </div>
    );
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id?user._id:user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating password.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${user._id?user._id:user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account deleted.");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/signup");
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className=" max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">My Page</h2>

        <div className="mb-4">
          <p className="font-semibold">Email: {user.email}</p>
        </div>

        <div className="mb-4">
          <p className="font-semibold">User Name: {user.name || "N/A"}</p>
        </div>

        <form onSubmit={handlePasswordChange} className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <input
            type="password"
            className="w-full mb-2 p-2 border rounded"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>

        <button
          onClick={handleDeleteAccount}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default MyPage;
