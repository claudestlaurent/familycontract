import { useState } from "react";
import logo from "./assets/logo_contract.png";
// test comment



// Which 2 players play each round (cycle through 6 pairs so everyone plays evenly)
const PAIRS = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];

const SCENARIOS_KID = [
  { intro: (a, b) => `${a} and ${b} found a ball at recess.`, question: "What do you do?", cooperate: "Share and take turns", defect: "Keep it for yourself" },
  { intro: (a, b) => `${a} and ${b} are sharing the tablet.`, question: "What do you do?", cooperate: "Set a timer and take turns", defect: "Play as long as you can" },
  { intro: (a, b) => `${a} and ${b} are choosing teams.`, question: "What do you do?", cooperate: "Pick fairly so teams are even", defect: "Put your friends on your team first" },
  { intro: (a, b) => `${a} and ${b} have snacks to share.`, question: "What do you do?", cooperate: "Share fairly", defect: "Take the most or hide some" },
  { intro: (a, b) => `${a} and ${b} have one umbrella in the rain.`, question: "What do you do?", cooperate: "Share and walk together", defect: "Keep it and run ahead" },
  { intro: (a, b) => `${a} and ${b} found extra art supplies.`, question: "What do you do?", cooperate: "Split them so you both can use some", defect: "Grab the best and keep them" },
  { intro: (a, b) => `${a} and ${b} get to pick the movie.`, question: "What do you do?", cooperate: "Take turns or vote together", defect: "Pick only what you want" },
  { intro: (a, b) => `${a} and ${b} are dividing the pizza.`, question: "What do you do?", cooperate: "Give equal slices", defect: "Take the biggest slices" },
  { intro: (a, b) => `${a} and ${b} discovered a secret spot.`, question: "What do you do?", cooperate: "Show each other and play there together", defect: "Keep it secret or take it over" },
  { intro: (a, b) => `${a} and ${b} were given two dessert tickets.`, question: "What do you do?", cooperate: "Use one each", defect: "Use both or save both" },
  { intro: (a, b) => `${a} and ${b} control the music in the car.`, question: "What do you do?", cooperate: "Take turns adding songs", defect: "Play only your playlist" },
  { intro: (a, b) => `${a} and ${b} have the last juice box.`, question: "What do you do?", cooperate: "Split it or take a few sips each", defect: "Drink it all yourself" },
];

const SCENARIOS_TEEN = [
  { intro: (a, b) => `${a} and ${b} found a ball at recess.`, question: "What do you do?", cooperate: "Share and take turns", defect: "Keep it for yourself" },
  { intro: (a, b) => `${a} and ${b} are sharing a charger.`, question: "What do you do?", cooperate: "Take turns or share the outlet", defect: "Use it until yours is full" },
  { intro: (a, b) => `${a} and ${b} are picking who gets the window seat.`, question: "What do you do?", cooperate: "Flip for it or take turns", defect: "Claim it first" },
  { intro: (a, b) => `${a} and ${b} split a bill at the café.`, question: "What do you do?", cooperate: "Split it fairly", defect: "Pay less or skip your share" },
  { intro: (a, b) => `${a} and ${b} have one umbrella in the rain.`, question: "What do you do?", cooperate: "Share and walk together", defect: "Keep it and go ahead" },
  { intro: (a, b) => `${a} and ${b} found extra concert tickets.`, question: "What do you do?", cooperate: "Offer one to a friend", defect: "Sell them or keep both" },
  { intro: (a, b) => `${a} and ${b} get to choose the movie.`, question: "What do you do?", cooperate: "Take turns or agree on one", defect: "Pick only what you want" },
  { intro: (a, b) => `${a} and ${b} are dividing the last slice of pizza.`, question: "What do you do?", cooperate: "Split it or share", defect: "Take the whole slice" },
  { intro: (a, b) => `${a} and ${b} found a good study spot.`, question: "What do you do?", cooperate: "Study there together", defect: "Take it and don't tell" },
  { intro: (a, b) => `${a} and ${b} were given two dessert tickets.`, question: "What do you do?", cooperate: "Use one each", defect: "Use both or save both" },
  { intro: (a, b) => `${a} and ${b} control the music in the car.`, question: "What do you do?", cooperate: "Take turns adding songs", defect: "Play only your playlist" },
  { intro: (a, b) => `${a} and ${b} have the last drink.`, question: "What do you do?", cooperate: "Split it or share", defect: "Drink it all yourself" },
];

const SCENARIOS_ADULT = [
  { intro: (a, b) => `${a} and ${b} are splitting the cost of a gift.`, question: "What do you do?", cooperate: "Split it fairly", defect: "Let the other pay more" },
  { intro: (a, b) => `${a} and ${b} share a workspace or home office.`, question: "What do you do?", cooperate: "Take turns and respect space", defect: "Claim the best spot or time" },
  { intro: (a, b) => `${a} and ${b} are choosing who drives.`, question: "What do you do?", cooperate: "Take turns or share the trip", defect: "Always let the other drive" },
  { intro: (a, b) => `${a} and ${b} split the bill at dinner.`, question: "What do you do?", cooperate: "Split fairly or take turns", defect: "Underpay or skip your share" },
  { intro: (a, b) => `${a} and ${b} have one umbrella in the rain.`, question: "What do you do?", cooperate: "Share and walk together", defect: "Keep it and go ahead" },
  { intro: (a, b) => `${a} and ${b} found extra tickets to an event.`, question: "What do you do?", cooperate: "Offer one to the other or a friend", defect: "Sell them or use both" },
  { intro: (a, b) => `${a} and ${b} get to pick the movie or show.`, question: "What do you do?", cooperate: "Take turns or agree on one", defect: "Pick only what you want" },
  { intro: (a, b) => `${a} and ${b} are dividing the last piece of food.`, question: "What do you do?", cooperate: "Split it or share", defect: "Take it for yourself" },
  { intro: (a, b) => `${a} and ${b} need to cover a shift or chore.`, question: "What do you do?", cooperate: "Take turns or split it", defect: "Leave it to the other" },
  { intro: (a, b) => `${a} and ${b} were given two vouchers.`, question: "What do you do?", cooperate: "Use one each", defect: "Use both or keep both" },
  { intro: (a, b) => `${a} and ${b} control the music or TV.`, question: "What do you do?", cooperate: "Take turns choosing", defect: "Choose only what you want" },
  { intro: (a, b) => `${a} and ${b} have the last coffee or snack.`, question: "What do you do?", cooperate: "Split it or offer to share", defect: "Take it for yourself" },
];

const SCENARIOS_BY_AGE = { kid: SCENARIOS_KID, teen: SCENARIOS_TEEN, adult: SCENARIOS_ADULT };

function ageToCategory(age) {
  const n = parseInt(age, 10);
  if (Number.isNaN(n) || n < 0) return "kid";
  if (n <= 12) return "kid";
  if (n <= 17) return "teen";
  return "adult";
}

export default function App() {
  const [setupDone, setSetupDone] = useState(false);
  const [nameInputs, setNameInputs] = useState(["", "", "", ""]);
  const [youngestAge, setYoungestAge] = useState("");
  const [roundsPerPair, setRoundsPerPair] = useState(3);
  const [players, setPlayers] = useState([]);
  const [ageCategory, setAgeCategory] = useState("kid");
  const [maxRounds, setMaxRounds] = useState(18);

  const [points, setPoints] = useState([]);
  const [round, setRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [roundSummary, setRoundSummary] = useState("");
  const [roundScores, setRoundScores] = useState([]);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [scenario, setScenarioState] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [choseThisRound, setChoseThisRound] = useState(false);
  const [coopCount, setCoopCount] = useState([0, 0, 0, 0]);
  const [defectCount, setDefectCount] = useState([0, 0, 0, 0]);

  const getPair = (r) => PAIRS[(r - 1) % PAIRS.length];
  const getScenarios = () => SCENARIOS_BY_AGE[ageCategory] || SCENARIOS_KID;

  const getStrategyDescription = (coop, defect, score, allScores) => {
    const total = coop + defect;
    if (total === 0) return "No rounds played.";
    const rate = coop / total;
    const maxScore = Math.max(...allScores);
    const minScore = Math.min(...allScores);
    const didWell = score === maxScore;
    const didPoorly = score === minScore && maxScore > minScore;

    // Cooperated a lot (≥80%)
    if (rate >= 0.8) {
      if (didWell) return "Steady cooperator—trusted others and reaped the rewards.";
      if (didPoorly) return "Cooperated often but was exploited—others didn’t reciprocate.";
      return "Steady cooperator—built trust; results were mixed.";
    }
    // Mostly cooperative (60–80%)
    if (rate >= 0.6) {
      if (didWell) return "Mostly cooperative—built trust and it paid off.";
      if (didPoorly) return "Mostly cooperative but often lost out when others defected.";
      return "Mostly cooperative—balanced trust with caution.";
    }
    // Balanced (40–60%)
    if (rate >= 0.4) {
      if (didWell) return "Balanced approach paid off—mixed cooperation with strategic defection.";
      if (didPoorly) return "Mixed approach—often lost out when others defected.";
      return "Balanced—mixed cooperation with strategic defection.";
    }
    // Mostly competitive (20–40%)
    if (rate >= 0.2) {
      if (didWell) return "Mostly competitive—defected often and came out ahead.";
      if (didPoorly) return "Mostly competitive—defection led to mutual losses.";
      return "Mostly competitive—often defected to get ahead.";
    }
    // Steady defector (<20%)
    if (didWell) return "Steady defector—played for short-term gains and came out ahead.";
    if (didPoorly) return "Steady defector—everyone lost out in the end.";
    return "Steady defector—played for short-term gains.";
  };

  const buildScenario = (template, nameA, nameB, roundNum) => {
    const intro = typeof template.intro === "function" ? template.intro(nameA, nameB) : template.intro;
    return {
      intro: `Round ${roundNum}: ${intro}`,
      question: template.question,
      cooperate: template.cooperate,
      defect: template.defect,
    };
  };

  const startGame = () => {
    if (nameInputs.some(n => n.trim() === "")) return;
    const rounds = Math.max(1, Math.min(3, parseInt(roundsPerPair, 10) || 3));
    const total = 6 * rounds;
    setRoundsPerPair(rounds);
    setMaxRounds(total);
    setAgeCategory(ageToCategory(youngestAge));
    setPlayers(nameInputs);
    setPoints([0, 0, 0, 0]);
    setCoopCount([0, 0, 0, 0]);
    setDefectCount([0, 0, 0, 0]);
    const [i, j] = getPair(1);
    setCurrentPlayerIndex(i);
    const scenarios = SCENARIOS_BY_AGE[ageToCategory(youngestAge)] || SCENARIOS_KID;
    const template = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenarioState(buildScenario(template, nameInputs[i], nameInputs[j], 1));
    setSetupDone(true);
  };

  const handleDecision = (type) => {
    setChoseThisRound(true);
    const updated = [...decisions, { player: currentPlayerIndex, type }];
    setDecisions(updated);

    if (updated.length === 2) {
      scoreRound(updated);
    } else {
      const [i, j] = getPair(round);
      setCurrentPlayerIndex(i === currentPlayerIndex ? j : i);
      setChoseThisRound(false);
    }
  };

  const scoreRound = (all) => {
    const prevPoints = [...points];
    const newPoints = [...points];
    const [i, j] = getPair(round);
    const di = all.find(d => d.player === i);
    const dj = all.find(d => d.player === j);

    // Classical Prisoner's Dilemma: R=3, T=5, P=1, S=0  (T > R > P > S, 2R > T+S)
    const R = 4, T = 5, P = 1, S = 0;
    const si = di.type === "nice" ? (dj.type === "nice" ? R : S) : (dj.type === "nice" ? T : P);
    const sj = dj.type === "nice" ? (di.type === "nice" ? R : S) : (di.type === "nice" ? T : P);
    newPoints[i] += si;
    newPoints[j] += sj;

    const explanation = [
      `${players[i]} ${di.type === "nice" ? "cooperated" : "defected"} (${si >= 0 ? "+" : ""}${si})`,
      `${players[j]} ${dj.type === "nice" ? "cooperated" : "defected"} (${sj >= 0 ? "+" : ""}${sj})`,
    ];

    const deltas = newPoints.map((p, idx) => p - prevPoints[idx]);
    setRoundScores(deltas);
    setPoints(newPoints);
    setCoopCount(c => c.map((v, idx) => v + (idx === i && di.type === "nice" ? 1 : 0) + (idx === j && dj.type === "nice" ? 1 : 0)));
    setDefectCount(d => d.map((v, idx) => v + (idx === i && di.type === "selfish" ? 1 : 0) + (idx === j && dj.type === "selfish" ? 1 : 0)));
    setRoundSummary(explanation.join(" | "));
    setWaitingForNext(true);
  };

  const goToNextRound = () => {
    const maxScore = Math.max(...points);
    const tiedCount = points.filter(p => p === maxScore).length;
    const hasUniqueWinner = tiedCount === 1;

    if (round >= maxRounds && hasUniqueWinner) {
      setGameOver(true);
      return;
    }

    const nextRound = round + 1;
    const [i, j] = getPair(nextRound);
    const scenarios = getScenarios();
    const template = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenarioState(buildScenario(template, players[i], players[j], nextRound));
    setRound(nextRound);
    setCurrentPlayerIndex(i);
    setDecisions([]);
    setRoundSummary("");
    setRoundScores([]);
    setWaitingForNext(false);
    setChoseThisRound(false);
  };

  // ---------- SETUP SCREEN ----------

  if (!setupDone) {
    const roundsValue = Math.max(1, Math.min(3, parseInt(roundsPerPair, 10) || 3));
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-100/80 space-y-6 w-full max-w-md">
          <div className="text-center space-y-1">
          

          <img src={logo} alt="Logo" className="h-80 drop-shadow-xl mx-auto" />
            <p className="text-slate-500 text-sm">
              Cooperate for bigger rewards—
              but defecting pays if the other doesn't
            </p>
          </div>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-2xl" aria-hidden>👥</span>
              <h2 className="font-semibold">Players</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nameInputs.map((n, i) => (
                <input
                  key={i}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
                  placeholder={`Player ${i + 1}`}
                  value={n}
                  onChange={e => {
                    const copy = [...nameInputs];
                    copy[i] = e.target.value;
                    setNameInputs(copy);
                  }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-2xl" aria-hidden>🎂</span>
              <h2 className="font-semibold">Youngest player&apos;s age</h2>
            </div>
            <input
              type="number"
              min={0}
              max={120}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
              placeholder="e.g. 8"
              value={youngestAge}
              onChange={e => setYoungestAge(e.target.value)}
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-2xl" aria-hidden>🔄</span>
              <h2 className="font-semibold">Rounds per pair</h2>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRoundsPerPair(n)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition ${
                    roundsValue === n
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {n} {n === 1 ? "round" : "rounds"}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Total: {6 * roundsValue} rounds
            </p>
          </section>

          <button
            onClick={startGame}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 transition cursor-pointer select-none"
          >
            Start game
          </button>
        </div>
      </div>
    );
  }

  const resetGame = () => {
    setSetupDone(false);
    setNameInputs(["", "", "", ""]);
    setYoungestAge("");
    setRoundsPerPair(3);
    setPlayers([]);
    setAgeCategory("kid");
    setMaxRounds(18);
    setPoints([]);
    setRound(1);
    setCurrentPlayerIndex(0);
    setDecisions([]);
    setRoundSummary("");
    setRoundScores([]);
    setWaitingForNext(false);
    setScenarioState(null);
    setGameOver(false);
    setChoseThisRound(false);
    setCoopCount([0, 0, 0, 0]);
    setDefectCount([0, 0, 0, 0]);
  };

  // ---------- GAME OVER ----------
  if (gameOver) {
    const maxScore = Math.max(...points);
    const winnerIndices = players.map((_, i) => i).filter(i => points[i] === maxScore);
    const winners = winnerIndices.map(i => players[i]);
    const sorted = [...players].map((p, i) => ({ name: p, score: points[i], index: i })).sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full space-y-4">
          <h1 className="text-3xl font-bold text-indigo-600">Game Over</h1>
          <p className="text-xl font-medium text-slate-700">
            {winners.length === 1 ? "Winner" : "Winners"}: {winners.join(", ")}
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Final scores &amp; strategy</p>
            {sorted.map(({ name, score, index }) => (
              <div key={index} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                <div className="flex justify-between items-baseline">
                  <span className={points[index] === maxScore ? "font-semibold text-indigo-600" : "font-medium text-slate-800"}>
                    {name}
                  </span>
                  <span className="text-slate-600">{score}</span>
                </div>
                <p className="text-slate-600 text-sm mt-1 italic">
                  {getStrategyDescription(coopCount[index], defectCount[index], score, points)}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 transition cursor-pointer select-none"
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  const [pairA, pairB] = getPair(round);
  const inPair = (idx) => idx === pairA || idx === pairB;
  const currentPlayer = players[currentPlayerIndex];
  const canChoose = !choseThisRound && !waitingForNext;
  const decidedCount = decisions.length;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl space-y-4">

        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Round {round} / {maxRounds}
          {round > maxRounds && <span className="block text-lg font-medium text-amber-600 mt-1">Tiebreaker</span>}
        </h1>

        <p className="text-sm text-slate-600 text-center">
          This round: <strong>{players[pairA]}</strong> vs <strong>{players[pairB]}</strong>
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {players.map((p, i) => (
            <div
              key={i}
              className={`p-2 rounded flex justify-between items-center ${
                inPair(i) ? "bg-indigo-100 font-semibold" : "bg-slate-100 opacity-75"
              } ${i === currentPlayerIndex ? "ring-2 ring-indigo-400 ring-offset-1" : ""}`}
            >
              <span className="flex items-center gap-1.5">
                {decisions.some(d => d.player === i) && (
                  <span className="text-green-600" aria-hidden>✓</span>
                )}
                {p}
                {!inPair(i) && <span className="text-slate-400 text-xs">(sitting out)</span>}
              </span>
              <span>
                {points[i]}
                {roundScores[i] !== undefined && roundScores[i] !== 0 && (
                  <span className={roundScores[i] > 0 ? "text-green-600" : "text-red-600"}>
                    {" "}({roundScores[i] > 0 ? "+" : ""}{roundScores[i]})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {waitingForNext ? (
          <div className="text-center py-2 text-slate-600">
            Round complete. Read the results, then continue.
          </div>
        ) : (
          <>
            <p className="font-medium">{scenario.intro}</p>

            <p className="text-indigo-700 font-medium">
              {scenario.question}
            </p>

            <p className="text-sm text-slate-500">
              {decidedCount === 2
                ? "Both have chosen."
                : `${currentPlayer}'s turn${choseThisRound ? " (waiting…)" : " — choose below"}`}
            </p>

            <div className="space-y-2">
              <button
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500 transition text-left px-4 cursor-pointer select-none"
                onClick={() => handleDecision("nice")}
                disabled={!canChoose}
              >
                {scenario.cooperate}
              </button>

              <button
                className="w-full bg-red-500 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500 transition text-left px-4 cursor-pointer select-none"
                onClick={() => handleDecision("selfish")}
                disabled={!canChoose}
              >
                {scenario.defect}
              </button>
            </div>
          </>
        )}

        {roundSummary && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm space-y-2">
            <p className="font-semibold text-slate-700">Round results</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              {roundSummary.split(" | ").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {waitingForNext && (() => {
          const maxScore = Math.max(...points);
          const tiedCount = points.filter(p => p === maxScore).length;
          const isTiebreaker = round >= maxRounds && tiedCount > 1;
          return (
            <button
              onClick={goToNextRound}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 transition cursor-pointer select-none"
            >
              {isTiebreaker ? "Tiebreaker round →" : round >= maxRounds ? "See final results →" : "Next round →"}
            </button>
          );
        })()}
      </div>
    </div>
  );
}