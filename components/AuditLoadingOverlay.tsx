"use client";

import { useEffect, useState } from "react";
import { Upload, Cpu, ShieldCheck, FileText, Sparkles } from "lucide-react";

// ── Stages ────────────────────────────────────────────────────────────────────
const STAGES = [
  {
    Icon: Upload,
    label: "Uploading image",
    detail: "Preparing your image for analysis",
    color: "bg-indigo-600",
    duration: 900,
    target: 10,
  },
  {
    Icon: Cpu,
    label: "AI detection running",
    detail: "Scanning for accessibility features",
    color: "bg-violet-600",
    duration: 5000,
    target: 48,
  },
  {
    Icon: ShieldCheck,
    label: "Mapping DSAPT clauses",
    detail: "Cross-referencing disability standards",
    color: "bg-indigo-600",
    duration: 3500,
    target: 72,
  },
  {
    Icon: FileText,
    label: "Building audit report",
    detail: "Structuring your accessibility findings",
    color: "bg-blue-600",
    duration: 2500,
    target: 89,
  },
  {
    Icon: Sparkles,
    label: "Almost there",
    detail: "Generating PDF and finalising",
    color: "bg-emerald-600",
    duration: 99999, // stays until API responds
    target: 97,
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AuditLoadingOverlay() {
  const [stageIdx, setStageIdx]   = useState(0);
  const [progress, setProgress]   = useState(0);
  const [dots, setDots]           = useState(".");
  const [fadeIn, setFadeIn]       = useState(false);

  // Trigger mount fade-in
  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Advance stages on a timer
  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.slice(0, -1).forEach((stage, i) => {
      elapsed += stage.duration;
      const t = setTimeout(() => setStageIdx(i + 1), elapsed);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Smooth progress toward current stage target
  useEffect(() => {
    const target = STAGES[stageIdx].target;
    const id = setInterval(() => {
      setProgress(prev => {
        if (prev >= target) return prev;
        const step = Math.max(0.15, (target - prev) * 0.03);
        return Math.min(prev + step, target);
      });
    }, 50);
    return () => clearInterval(id);
  }, [stageIdx]);

  // Animated ellipsis
  useEffect(() => {
    const id = setInterval(() =>
      setDots(d => (d.length >= 3 ? "." : d + ".")), 480);
    return () => clearInterval(id);
  }, []);

  const stage = STAGES[stageIdx];
  const { Icon } = stage;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(8, 12, 28, 0.6)", backdropFilter: "blur(12px)" }}
    >
      {/* Card */}
      <div className="glass-card rounded-2xl md:rounded-3xl p-7 md:p-10 w-[320px] md:w-[400px] flex flex-col items-center text-center shadow-xl mx-4">

        {/* ── Animated icon ────────────────────────────────────────────────── */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 mb-7 flex items-center justify-center">

          {/* Rotating ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              animationDuration: "3s",
              background: `conic-gradient(transparent 60%, rgba(99,102,241,0.5) 100%)`,
            }}
          />

          {/* Pulse */}
          <div
            className="absolute inset-2 rounded-full bg-indigo-400 opacity-15 animate-ping"
            style={{ animationDuration: "2.2s" }}
          />

          {/* Icon circle */}
          <div
            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl ${stage.color} flex items-center justify-center shadow-lg transition-all duration-700`}
          >
            <Icon className="text-white drop-shadow" size={24} />
          </div>
        </div>

        {/* ── Stage text ───────────────────────────────────────────────────── */}
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1 transition-all duration-500">
          {stage.label}
          <span className="text-indigo-500">{dots}</span>
        </h3>
        <p className="text-sm text-slate-400 mb-7 leading-relaxed transition-all duration-500">
          {stage.detail}
        </p>

        {/* ── Step pip indicators ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 mb-6">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ease-out ${
                i === stageIdx
                  ? "w-5 h-2 bg-indigo-500"
                  : i < stageIdx
                  ? "w-2 h-2 bg-indigo-300"
                  : "w-2 h-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out bg-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 mt-2 font-semibold tracking-wide tabular-nums">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
}
