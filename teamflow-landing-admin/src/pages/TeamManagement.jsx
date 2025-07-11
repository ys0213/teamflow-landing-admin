import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import User from "../../../backend/models/User";

export default function TeamManagement() {
  const { token } = useAuth();              // token is now always in context
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ───────────────── fetch teams on mount ───────────────── */
  useEffect(() => {
    if (!token) return;
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTeams(data);
        else setError(data.message || "Failed to load teams");
      } catch (e) {
        setError("Server error");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [token]);

  /* ───────────────── create team ───────────────── */
  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newTeamName.trim() }),
    });
    const team = await res.json();
    if (res.ok) {
      setTeams((prev) => [...prev, team]);
      setNewTeamName("");
    } else {
      alert(team.message || "Could not create team");
    }
  };

  /* ───────────────── delete team ───────────────── */
  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    const res = await fetch(`/api/teams/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTeams((prev) => prev.filter((t) => t._id !== id));
    else alert("Failed to delete");
  };

  /* ───────────────── invite member ───────────────── */
  const handleInviteMember = async (teamId) => {
    const email = prompt("Enter member email to invite:");
    if (!email) return;

    const res = await fetch(`/api/teams/${teamId}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Member added!");
      // optional: reload teams to reflect new member list
    } else {
      alert(data.message || "Invite failed");
    }
  };

  /* ───────────────── UI ───────────────── */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-md mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Team Management</h2>

        {loading && <p className="text-center text-gray-500">Loading…</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <form onSubmit={handleAddTeam} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter new team name"
            className="flex-1 p-2 border rounded"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>

        <ul className="space-y-4">
          {teams.map((team) => (
            <li
              key={team._id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <span>{team.name}</span>

              <div className="flex gap-4">
                <button
                  onClick={() => handleInviteMember(team._id)}
                  className="text-blue-600 hover:underline"
                >
                  Invite
                </button>
                <button
                  onClick={() => handleDeleteTeam(team._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {!loading && teams.length === 0 && (
            <li className="text-gray-500 text-center">No teams yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
