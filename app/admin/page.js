"use client";

import { useState, useEffect } from "react";
import { executeMonthlyDraw, calculatePayouts } from "@/lib/draw-engine";
import { verifyWinnerProof } from "@/lib/admin-helpers";

export default function AdminDashboard() {
  const [simulationResults, setSimulationResults] = useState(null);
  const [pendingWinners, setPendingWinners] = useState([]);

  // 1. Draw Management (PRD Section 11)
  const runSimulation = async () => {
    const winningNums = await executeMonthlyDraw("random");
    // Mocking active subscriber count for calculation
    const results = calculatePayouts(10000, {
      JACKPOT: 1,
      MATCH_4: 5,
      MATCH_3: 20,
    });
    setSimulationResults({ winningNums, ...results });
  };

  // 2. Winner Verification (PRD Section 09)
  const handleVerify = async (winnerId, status) => {
    await verifyWinnerProof(winnerId, status); // Approve or Reject
    // Refresh list after action
    fetchPendingWinners();
  };

  return (
    <div className="p-8 text-white">
      <h1 className="font-syne">Admin Control Room</h1>

      {/* Draw Simulation Section */}
      <section className="bg-ink2 mt-8 p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Monthly Draw Engine</h3>
        <button onClick={runSimulation} className="btn-primary">
          Run Draw Simulation
        </button>

        {simulationResults && (
          <div className="mt-4">
            <p>
              Winning Numbers:{" "}
              <strong>{simulationResults.winningNums.join(", ")}</strong>
            </p>
            <p>Potential Rollover: £{simulationResults.rolloverAmount}</p>
          </div>
        )}
      </section>

      {/* Winner Verification List (PRD Section 09) */}
      <section className="bg-ink2 mt-8 p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Pending Verifications</h3>
        <table className="w-full text-left mt-4">
          <thead>
            <tr className="text-muted2 text-xs">
              <th>User</th>
              <th>Tier</th>
              <th>Proof</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingWinners.map((winner) => (
              <tr
                key={winner.id}
                className="border-b border-border"
              >
                <td>{winner.name}</td>
                <td>{winner.tier}</td>
                <td>
                  <a
                    href={winner.proofUrl}
                    target="_blank"
                    className="text-lime"
                  >
                    View Screenshot
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleVerify(winner.id, "PAID")}
                    className="bg-lime border-none rounded px-2 py-1 text-xs mr-1 text-black"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleVerify(winner.id, "REJECTED")}
                    className="bg-coral border-none rounded px-2 py-1 text-xs text-white"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
