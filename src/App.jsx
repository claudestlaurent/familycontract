import { useState } from "react";

// 4 players → 6 pairs; each pair plays 3 times → 18 rounds
const MAX_ROUNDS = 18;

// Which 2 players play each round (cycle through 6 pairs so everyone plays evenly)
const PAIRS = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];

const SCENARIOS = [
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

export default function App() {
  const [setupDone, setSetupDone] = useState(false);
  const [nameInputs, setNameInputs] = useState(["", "", "", ""]);
  const [players, setPlayers] = useState([]);

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

  const getPair = (r) => PAIRS[(r - 1) % PAIRS.length];

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
    setPlayers(nameInputs);
    setPoints([0, 0, 0, 0]);
    const [i, j] = getPair(1);
    setCurrentPlayerIndex(i);
    const template = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
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
    const R = 3, T = 5, P = 1, S = 0;
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
    setRoundSummary(explanation.join(" | "));
    setWaitingForNext(true);
  };

  const goToNextRound = () => {
    if (round >= MAX_ROUNDS) {
      setGameOver(true);
      return;
    }
    const nextRound = round + 1;
    const [i, j] = getPair(nextRound);
    const template = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
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
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-4 w-80">
          <h1 className="text-2xl font-bold text-center">
            Family Contract
          </h1>
          <p className="text-sm text-slate-500 text-center">
            Cooperate for bigger rewards—but defecting pays if others don&apos;t. Can you trust each other?
          </p>

          {nameInputs.map((n, i) => (
            <input
              key={i}
              className="w-full border rounded p-2"
              placeholder={`Player ${i + 1} name`}
              value={n}
              onChange={e => {
                const copy = [...nameInputs];
                copy[i] = e.target.value;
                setNameInputs(copy);
              }}
            />
          ))}

          <button
            onClick={startGame}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 transition cursor-pointer select-none"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const resetGame = () => {
    setSetupDone(false);
    setNameInputs(["", "", "", ""]);
    setPlayers([]);
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
  };

  // ---------- GAME OVER ----------
  if (gameOver) {
    const maxScore = Math.max(...points);
    const winners = players.filter((_, i) => points[i] === maxScore);
    const sorted = [...players].map((p, i) => ({ name: p, score: points[i] })).sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full space-y-4">
          <h1 className="text-3xl font-bold text-indigo-600">Game Over</h1>
          <p className="text-xl font-medium text-slate-700">
            {winners.length === 1 ? "Winner" : "Winners"}: {winners.join(", ")}
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Final scores</p>
            {sorted.map(({ name, score }, i) => (
              <div key={i} className="flex justify-between">
                <span className={points[players.indexOf(name)] === maxScore ? "font-semibold text-indigo-600" : ""}>
                  {name}
                </span>
                <span>{score}</span>
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
          Round {round} / {MAX_ROUNDS}
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

        {waitingForNext && (
          <button
            onClick={goToNextRound}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800 transition cursor-pointer select-none"
          >
            {round >= MAX_ROUNDS ? "See final results →" : "Next round →"}
          </button>
        )}
      </div>
    </div>
  );
}