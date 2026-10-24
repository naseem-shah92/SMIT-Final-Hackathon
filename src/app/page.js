"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { 
  Rocket, 
  Sparkles, 
  Code2, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Trophy 
} from "lucide-react";

export default function Home() {
  const [count, setCount] = useState(0);

  const showAlert = () => {
    Swal.fire({
      title: "Hackathon Ready! 🚀",
      text: "Next.js + Tailwind + SweetAlert2 + Lucide Icons are properly configured and working!",
      icon: "success",
      background: "#111827",
      color: "#f3f4f6",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Let's Build!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12">
      {/* Top Navigation */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-8 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">SMIT Hackathon</h1>
            <p className="text-xs text-indigo-400 font-medium">Final Web Dev Project</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
            System Live
          </span>
          <a
            href="https://github.com/naseem-shah92/SMIT-Final-Hackathon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-sm font-medium text-slate-200 border border-slate-700 transition-all duration-200"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl w-full mx-auto my-auto py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-medium shadow-sm">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Saylani Mass IT Training (SMIT) • Final Hackathon 2026</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Build Faster. Win Bigger. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Next.js + Tailwind Stack
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Your project environment is completely scaffolded with modern full-stack capabilities, professional UI components, responsive layout, and GitHub versioning.
        </p>

        {/* Interactive Action Widget */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-sm mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Interactive Test Widget
            </span>
            <span className="text-xs text-indigo-400 font-mono">Count: {count}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Counter +1
            </button>
            <button
              onClick={showAlert}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Test Alert
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-2">Next.js 15 App Router</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-stack ready with server components, client interactivity, and instant API route handling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-2">Tailwind CSS + Lucide</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean responsive styling out-of-the-box with beautiful modern icon sets for high judges scoring.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-2">Vercel 1-Click Deploy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Push to GitHub and connect to Vercel for instant live URL submission without configuration hassle.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>Built with ❤️ for SMIT Final Hackathon by Muhammad Aaban Shah</p>
        <p className="font-mono text-slate-400">Repository: smit-final-hackathon</p>
      </footer>
    </div>
  );
}
