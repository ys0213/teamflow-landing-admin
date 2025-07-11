import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* 마케팅 섹션 */
import Feature from "../components/FeatureSection";
import CTA from "../components/CTASection";
import Pricing from "../components/PricingSection";

/* ---------- 1) 로그인 전 뷰 ---------- */
const MarketingView = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
      <Feature />
      <CTA />
      <Pricing />
    </main>
  </div>
);

/* ---------- 2) 로그인 후 실제 대시보드 ---------- */
const UserDashboard = ({ token, user }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* 팀 목록 */
  useEffect(() => {
    fetch("/api/teams", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setTeams(data);
        if (data.length) setSelectedTeam(data[0]._id);
      })
      .catch(() => setError("Failed to load teams"));
  }, [token]);

  /* 프로젝트 목록 */
  useEffect(() => {
    if (!selectedTeam) return;
    setLoading(true);
    fetch(`/api/projects/team/${selectedTeam}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, [token, selectedTeam]);

  /* 통계 */
  const counts = projects.reduce(
    (acc, p) => ({ ...acc, [p.status]: acc[p.status] + 1 }),
    { todo: 0, doing: 0, done: 0 }
  );
  const upcoming = projects
    .filter((p) => p.status !== "done")
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
        <p className="text-center mb-6 text-gray-600">
          Logged in as <span className="font-semibold">{user.email}</span>
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* 팀 선택 */}
        {teams.length > 0 && (
          <select
            className="border p-2 rounded mb-8 w-full md:w-64"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* 상태 카드 */}
            <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-4">Project Status</h3>
              {["todo", "doing", "done"].map((s) => (
                <div key={s} className="flex justify-between mb-2">
                  <span className="capitalize">{s}</span>
                  <span className="font-semibold">{counts[s]}</span>
                </div>
              ))}
            </div>

            {/* 임박 작업 */}
            <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-4">Upcoming / In progress</h3>
              {upcoming.length === 0 ? (
                <p className="text-gray-500">No pending work 🎉</p>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map((p) => (
                    <li
                      key={p._id}
                      className="border p-3 rounded flex justify-between"
                    >
                      <span>{p.name}</span>
                      <span className="text-sm text-gray-500">{p.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 퀵액션 */}
            <div className="bg-white rounded shadow p-6 md:col-span-2">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/projects"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  style={{ marginLeft: "10px"}}
                >
                  New Project
                </Link>
                <Link
                  to="/teams"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  style={{ marginLeft: "10px"}}
                >
                  New Team
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 3) 메인 컴포넌트 ---------- */
export default function Dashboard() {
  const { user, token } = useAuth();
  return !user || !token ? (
    <MarketingView />
  ) : (
    <UserDashboard token={token} user={user} />
  );
}
