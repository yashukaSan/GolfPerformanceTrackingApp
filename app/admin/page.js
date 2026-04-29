"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { executeMonthlyDraw, calculatePayouts } from "@/lib/draw-engine";
import { verifyWinnerProof, getPendingWinners, getDrawStats } from "@/lib/admin-helpers";

// ✅ FIX: Added list of allowed admin emails (or check a DB role field)
const ADMIN_EMAILS = ["admin@greendrop.com"]; // Replace with real admin emails or use a DB role column

export default function AdminDashboard() {
  const router = useRouter();
  const [simulationResults, setSimulationResults] = useState(null);
  const [pendingWinners, setPendingWinners] = useState([]);
  const [stats, setStats] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawLoading, setDrawLoading] = useState(false);

  // ✅ FIX: Auth guard — was completely missing before
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      // Check if user is an admin (by email list or DB role)
      const userEmail = session.user.email || "";
      if (!ADMIN_EMAILS.includes(userEmail)) {
        // Redirect non-admins away
        router.replace("/dashboard");
        return;
      }

      setIsAdmin(true);
      setAuthChecked(true);
      await fetchPendingWinners();
      await fetchStats();
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  // ✅ FIX: fetchPendingWinners was called but never defined in original code
  const fetchPendingWinners = async () => {
    const winners = await getPendingWinners();
    setPendingWinners(winners);
  };

  const fetchStats = async () => {
    const data = await getDrawStats();
    setStats(data);
  };

  // 1. Draw Management (PRD Section 11)
  const runSimulation = async () => {
    setDrawLoading(true);
    try {
      const winningNums = await executeMonthlyDraw("random");
      const results = calculatePayouts(10000, {
        JACKPOT: 1,
        MATCH_4: 5,
        MATCH_3: 20,
      });
      setSimulationResults({ winningNums, ...results });
    } finally {
      setDrawLoading(false);
    }
  };

  // 2. Winner Verification (PRD Section 09)
  const handleVerify = async (winnerId, status) => {
    await verifyWinnerProof(winnerId, status); // Approve or Reject
    await fetchPendingWinners(); // ✅ FIX: was called but never defined in original
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-white">
        <div className="animate-pulse font-syne text-xl">Loading Control Room...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <header className="mb-10">
        <h1 className="font-syne text-4xl font-extrabold text-lime">Admin Control Room</h1>
        <p className="text-muted2 text-sm mt-1">GreenDrop Platform Management — PRD Section 11</p>
      </header>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-ink2 border border-border p-4 rounded-xl">
            <p className="text-xs text-muted2 uppercase tracking-widest mb-1">Total Users</p>
            <p className="font-syne text-2xl font-bold">{stats.totalUsers?.[0]?.count ?? "—"}</p>
          </div>
          <div className="bg-ink2 border border-border p-4 rounded-xl">
            <p className="text-xs text-muted2 uppercase tracking-widest mb-1">Current Prize Pool</p>
            <p className="font-syne text-2xl font-bold">
              £{stats.currentPool?.amount?.toLocaleString() ?? "—"}
            </p>
          </div>
        </div>
      )}

      {/* Draw Simulation Section */}
      <section className="bg-ink2 mt-4 p-6 rounded-2xl border border-border">
        <h3 className="text-lg font-syne font-semibold mb-1">Monthly Draw Engine</h3>
        <p className="text-muted2 text-xs mb-4">Simulate the monthly prize draw to test the algorithm.</p>
        <button
          onClick={runSimulation}
          disabled={drawLoading}
          className="btn-primary disabled:opacity-50"
        >
          {drawLoading ? "Running..." : "Run Draw Simulation"}
        </button>

        {simulationResults && (
          <div className="mt-6 p-4 bg-lime/5 border border-lime/30 rounded-xl space-y-2 text-sm">
            <p>
              <span className="text-muted2">Winning Numbers:</span>{" "}
              <strong className="text-lime">{simulationResults.winningNums.join(", ")}</strong>
            </p>
            <p>
              <span className="text-muted2">Jackpot Payout (per winner):</span>{" "}
              <strong>£{simulationResults.jackpotPerPerson.toFixed(2)}</strong>
            </p>
            <p>
              <span className="text-muted2">Rollover Amount:</span>{" "}
              <strong>£{simulationResults.rolloverAmount.toFixed(2)}</strong>
            </p>
          </div>
        )}
      </section>

      {/* Winner Verification List (PRD Section 09) */}
      <section className="bg-ink2 mt-8 p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-syne font-semibold">Pending Verifications</h3>
            <p className="text-muted2 text-xs">Review winner proof screenshots and approve or reject.</p>
          </div>
          <button
            onClick={fetchPendingWinners}
            className="text-xs text-muted2 border border-border px-3 py-1.5 rounded-lg hover:text-white transition-all"
          >
            Refresh
          </button>
        </div>

        {pendingWinners.length === 0 ? (
          <div className="text-center py-10 text-muted2 text-sm">
            No pending verifications at this time.
          </div>
        ) : (
          <table className="w-full text-left mt-2">
            <thead>
              <tr className="text-muted2 text-xs border-b border-border">
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4">Tier</th>
                <th className="pb-3 pr-4">Proof</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingWinners.map((winner) => (
                <tr key={winner.id} className="border-b border-border/50 text-sm">
                  <td className="py-3 pr-4 text-white">{winner.name}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-lime/10 text-lime rounded text-xs font-bold">
                      {winner.tier}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {winner.proofUrl ? (
                      <a
                        href={winner.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime text-xs underline"
                      >
                        View Screenshot
                      </a>
                    ) : (
                      <span className="text-muted2 text-xs">No proof</span>
                    )}
                  </td>
                  <td className="py-3 flex gap-2">
                    <button
                      onClick={() => handleVerify(winner.id, "PAID")}
                      className="bg-lime text-black rounded px-3 py-1 text-xs font-bold hover:bg-lime/80 transition-all"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleVerify(winner.id, "REJECTED")}
                      className="bg-coral/20 border border-coral text-coral rounded px-3 py-1 text-xs font-bold hover:bg-coral/30 transition-all"
                    >
                      ✕ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
