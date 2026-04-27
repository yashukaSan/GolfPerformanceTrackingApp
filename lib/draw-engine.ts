/**
 * GreenDrop Draw Engine
 * Handles random/algorithmic generation and winner matching
 */

// 1. Generate Draw Numbers (PRD Section 06)
// Options: 'random' or 'algorithmic' (weighted by user frequency)
export async function executeMonthlyDraw(mode: string = "random", allUserScores: number[] = []) {
  let winningNumbers: number[] = [];

  if (mode === "random") {
    // Standard lottery-style: 5 unique numbers between 1-45
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
  } else {
    // Algorithmic: Weighted by most/least frequent user scores
    const frequencyMap: Record<number, number> = {};
    allUserScores.forEach(
      (s) => (frequencyMap[s] = (frequencyMap[s] || 0) + 1),
    );
    // Sort numbers by frequency and pick a mix to ensure fairness/challenge
    winningNumbers = Object.keys(frequencyMap)
      .map(k => parseInt(k))
      .sort((a, b) => frequencyMap[b] - frequencyMap[a])
      .slice(0, 5);
  }
  return winningNumbers.sort((a, b) => a - b);
}

// 2. Match Checker (PRD Section 06)
export function checkUserMatch(userScores: number[], winningNumbers: number[]) {
  // Find how many of the user's last 5 scores match the winning set
  const matches = userScores.filter((score) =>
    winningNumbers.includes(score),
  ).length;

  if (matches === 5) return "JACKPOT";
  if (matches === 4) return "MATCH_4";
  if (matches === 3) return "MATCH_3";
  return "NO_WIN";
}

// 3. Prize Pool Calculator (PRD Section 07)
export function calculatePayouts(totalPool: number, winners: { JACKPOT: number; MATCH_4: number; MATCH_3: number }) {
  // Pool Share: 5-Match (40%), 4-Match (35%), 3-Match (25%)
  const shares = {
    JACKPOT: totalPool * 0.4,
    MATCH_4: totalPool * 0.35,
    MATCH_3: totalPool * 0.25,
  };

  const results = {
    jackpotPerPerson:
      winners.JACKPOT > 0 ? shares.JACKPOT / winners.JACKPOT : 0,
    match4PerPerson: winners.MATCH_4 > 0 ? shares.MATCH_4 / winners.MATCH_4 : 0,
    match3PerPerson: winners.MATCH_3 > 0 ? shares.MATCH_3 / winners.MATCH_3 : 0,
    rolloverAmount: winners.JACKPOT === 0 ? shares.JACKPOT : 0, // Section 07 Rollover logic
  };

  return results;
}
