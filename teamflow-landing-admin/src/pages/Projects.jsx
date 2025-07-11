import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { token } = useAuth();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  /* ── 내 팀 목록 ───────────────────────────────────────── */
  useEffect(() => {
    if (!token) return;

    const loadTeams = async () => {
      try {
        const r = await fetch("/api/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(msg || r.statusText);
        }
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error("Invalid teams response");
        setTeams(data);
      } catch (e) {
        setError(e.message);
        setTeams([]);           // 안전하게 비워두기
      }
    };

    loadTeams();
  }, [token]);

  /* ── 해당 팀 프로젝트 목록 ─────────────────────────────── */
  useEffect(() => {
    if (!token || !selectedTeam) return;
    setLoading(true);
    fetch(`/api/projects/team/${selectedTeam}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, [token, selectedTeam]);

  /* ── 프로젝트 생성 ───────────────────────────────────── */
  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, team: selectedTeam }),
    });
    const proj = await res.json();
    if (res.ok) {
      setProjects((prev) => [...prev, proj]);
      setForm({ name: "", description: "" });
    } else {
      alert(proj.message);
    }
  };

  /* ── 프로젝트 삭제 ───────────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setProjects((p) => p.filter((x) => x._id !== id));
    else alert("Delete failed");
  };

  /* ── 상태 변경(t→d→done) ─────────────────────────────── */
  const handleStatus = async (id, newStatus) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? updated : p))
      );
    } else {
      alert(updated.message);
    }
  };

  /* ── UI ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-screen-md mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* 팀 선택 */}
        <select
          className="border rounded p-2 mb-6 w-full"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Select a team…</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* 프로젝트 생성 */}
        {selectedTeam && (
          <form onSubmit={handleCreate} className="flex flex-col gap-3 mb-8">
            <input
              className="border p-2 rounded"
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="border p-2 rounded"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Create Project
            </button>
          </form>
        )}

        {/* 프로젝트 리스트 */}
        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((p) => (
              <li
                key={p._id}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <p className="font-medium">{p.name}</p>

                  <select
                    className="text-sm border rounded mt-1"
                    value={p.status}
                    onChange={(e) => handleStatus(p._id, e.target.value)}
                  >
                    <option value="todo">todo</option>
                    <option value="doing">doing</option>
                    <option value="done">done</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}

            {selectedTeam && !loading && projects.length === 0 && (
              <li className="text-gray-500 text-center">
                No projects for this team.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
