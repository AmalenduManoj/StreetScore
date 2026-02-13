"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const matches = [
  {
    id: 1,
    status: "LIVE",
    matchType: "T20 World Cup",
    team1: { name: "India", short: "IND", flag: "🇮🇳", score: "187", wickets: 3, overs: "18.4" },
    team2: { name: "Australia", short: "AUS", flag: "🇦🇺", score: "142", wickets: 6, overs: "15.2" },
    info: "IND need 46 runs in 27 balls",
    crr: "9.28",
    rrr: "10.22",
  },
  {
    id: 2,
    status: "LIVE",
    matchType: "IPL 2025",
    team1: { name: "Mumbai Indians", short: "MI", flag: "🔵", score: "203", wickets: 5, overs: "20.0" },
    team2: { name: "Chennai Super Kings", short: "CSK", flag: "🟡", score: "178", wickets: 8, overs: "19.1" },
    info: "CSK need 26 runs in 5 balls",
    crr: "9.32",
    rrr: "31.20",
  },
  {
    id: 3,
    status: "LIVE",
    matchType: "Test Series",
    team1: { name: "England", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "312", wickets: 7, overs: "88.3" },
    team2: { name: "South Africa", short: "SA", flag: "🇿🇦", score: "245", wickets: 4, overs: "71.0" },
    info: "SA trail by 67 runs",
    crr: "3.45",
    rrr: "—",
  },
];

const recentBalls = ["1", "4", "W", "0", "6", "2"];

function BallBadge({ ball }) {
  const color =
    ball === "W" ? "bg-red-500 text-white" :
    ball === "6" ? "bg-green-500 text-white" :
    ball === "4" ? "bg-blue-500 text-white" :
    ball === "0" ? "bg-zinc-700 text-zinc-400" :
    "bg-zinc-800 text-zinc-300";

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${color}`}
    >
      {ball}
    </motion.span>
  );
}

function MatchCard({ match, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden cursor-pointer transition-colors duration-200"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          <span className="text-xs font-semibold text-green-400 tracking-widest uppercase">Live</span>
        </div>
        <span className="text-xs text-zinc-500 font-medium">{match.matchType}</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-zinc-500 text-sm"
        >
          ▾
        </motion.span>
      </div>

      {/* Scores */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {[match.team1, match.team2].map((team, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{team.flag}</span>
              <div>
                <p className="text-white font-bold text-sm">{team.name}</p>
                <p className="text-zinc-500 text-xs">{team.short}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-extrabold text-xl tracking-tight">
                {team.score}
                <span className="text-zinc-500 text-sm font-medium">/{team.wickets}</span>
              </p>
              <p className="text-zinc-500 text-xs">{team.overs} ov</p>
            </div>
          </div>
        ))}
      </div>

      {/* Match info strip */}
      <div className="px-5 py-2 bg-zinc-800/50 border-t border-zinc-800">
        <p className="text-xs text-zinc-400 font-medium">{match.info}</p>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-zinc-800 flex flex-col gap-4">
              {/* CRR / RRR */}
              <div className="flex gap-4">
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-zinc-500 mb-1">CRR</p>
                  <p className="text-white font-bold text-lg">{match.crr}</p>
                </div>
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-zinc-500 mb-1">RRR</p>
                  <p className="text-white font-bold text-lg">{match.rrr}</p>
                </div>
              </div>

              {/* Recent balls */}
              <div>
                <p className="text-xs text-zinc-500 mb-2 font-medium">This Over</p>
                <div className="flex gap-2">
                  {recentBalls.map((ball, i) => (
                    <BallBadge key={i} ball={ball} />
                  ))}
                </div>
              </div>

              {/* View full scorecard button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition-colors duration-200"
              >
                Full Scorecard →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LiveScore() {
  const [tick, setTick] = useState(0);

  // Simulate live score updates every 8s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              Live <span className="text-green-400">Scores</span>
            </h1>
            <motion.div
              key={tick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 text-xs text-zinc-500"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="inline-block"
              >
                ↻
              </motion.span>
              Updated just now
            </motion.div>
          </div>
          <p className="text-zinc-500 text-sm">{matches.length} matches in progress</p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {matches.map((match, i) => (
            <MatchCard key={match.id} match={match} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}