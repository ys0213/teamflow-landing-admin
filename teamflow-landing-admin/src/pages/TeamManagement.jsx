import { useState } from "react";

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const newTeam = {
      id: Date.now(),
      name: newTeamName.trim(),
    };
    setTeams([...teams, newTeam]);
    setNewTeamName("");
  };

  const handleDeleteTeam = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-md mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Team Management</h2>

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
              key={team.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <span>{team.name}</span>
              <button
                onClick={() => handleDeleteTeam(team.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
          {teams.length === 0 && (
            <li className="text-gray-500 text-center">No teams added yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
