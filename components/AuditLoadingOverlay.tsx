"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Cpu, ShieldCheck, FileText, Sparkles } from "lucide-react";

// ── Stages ────────────────────────────────────────────────────────────────────
const STAGES = [
  {
    Icon: Upload,
    label: "Uploading image",
    detail: "Preparing your image for analysis",
    gradient: "from-blue-500 to-indigo-500",
    ring: "bg-blue-400",
    duration: 900,
    target: 10,
  },
  {
    Icon: Cpu,
    label: "AI detection running",
    detail: "Scanning for accessibility features",
    gradient: "from-violet-500 to-purple-500",
    ring: "bg-violet-400",
    duration: 5000,
    target: 48,
  },
  {
    Icon: ShieldCheck,
    label: "Mapping DSAPT clauses",
    detail: "Cross-referencing disability standards",
    gradient: "from-indigo-500 to-blue-600",
    ring: "bg-indigo-400",
    duration: 3500,
    target: 72,
  },
  {
    Icon: FileText,
    label: "Building audit report",
    detail: "Structuring your accessibility findings",
    gradient: "from-blue-500 to-cyan-500",
    ring: "bg-blue-400",
    duration: 2500,
    target: 89,
  },
  {
    Icon: Sparkles,
    label: "Almost there",
    detail: "Generating PDF and finalising",
    gradient: "from-emerald-500 to-teal-500",
    ring: "bg-emerald-400",
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
        const step = Math.max(0.2, (target - prev) * 0.035);
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
      style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(8px)" }}
    >
      {/* Card */}
      <div className="glass-card rounded-[32px] p-8 md:p-12 w-[340px] md:w-[420px] flex flex-col items-center text-center shadow-2xl">

        {/* ── Animated icon ────────────────────────────────────────────────── */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">

          {/* Outer slow ping */}
          <div
            className={`absolute inset-0 rounded-full ${stage.ring} opacity-20 animate-ping`}
            style={{ animationDuration: "2.2s" }}
          />
          {/* Mid ping — offset */}
          <div
            className={`absolute inset-3 rounded-full ${stage.ring} opacity-15 animate-ping`}
            style={{ animationDuration: "2.2s", animationDelay: "0.55s" }}
          />

          {/* Rotating gradient ring */}
          <div
            className="absolute inset-1 rounded-full animate-spin"
            style={{
              animationDuration: "3s",
              background: `conic-gradient(transparent 60%, rgba(99,102,241,0.6) 100%)`,
            }}
          />

          {/* Icon circle */}
          <div
            className={`relative w-[68px] h-[68px] rounded-full bg-gradient-to-br ${stage.gradient} flex items-center justify-center shadow-xl transition-all duration-700`}
          >
            <Icon className="text-white drop-shadow" size={28} />
          </div>
        </div>

        {/* ── Stage text ───────────────────────────────────────────────────── */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 transition-all duration-500">
          {stage.label}
          <span className="text-indigo-500">{dots}</span>
        </h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed transition-all duration-500">
          {stage.detail}
        </p>

        {/* ── Step pip indicators ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-7">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ease-out ${
                i === stageIdx
                  ? "w-6 h-2.5 bg-indigo-500"
                  : i < stageIdx
                  ? "w-2.5 h-2.5 bg-indigo-300"
                  : "w-2.5 h-2.5 bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)",
            }}
          />
        </div>

        <p className="text-xs text-slate-400 mt-2.5 font-semibold tracking-wide">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
}
