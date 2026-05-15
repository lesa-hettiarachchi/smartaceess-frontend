"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, FolderOpen, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navItems = [
    { href: "/", label: "Generate Report", Icon: FileText, isActive: pathname === "/" },
    {
      href: "/reports",
      label: "My Reports",
      Icon: FolderOpen,
      isActive: pathname === "/reports" || pathname.startsWith("/reports/"),
    },
  ];

  return (
    <>
      {/* ── Mobile Top Bar ─────────────────────────────────────────────────── */}
      <div className="md:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="SmartAccess Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h1 className="text-lg font-bold tracking-tight text-slate-800">
            Smart<span className="text-indigo-600">Access</span>
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors active:scale-95"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Overlay ─────────────────────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ── Sidebar Panel ──────────────────────────────────────────────────── */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px]
          md:relative md:w-[240px] md:translate-x-0 md:shrink-0
          transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col min-h-screen
          bg-white/70 backdrop-blur-2xl border-r border-black/[0.06]
        `}
      >
        {/* ── Mobile Close Header ──────────────────────────────────────────── */}
        <div className="md:hidden flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="SmartAccess Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-base font-bold text-slate-800 tracking-tight">
              Smart<span className="text-indigo-600">Access</span>
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Desktop Logo ─────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col items-center pt-8 pb-10 px-5">
          <Image
            src="/logo.svg"
            alt="SmartAccess Logo"
            width={96}
            height={96}
            className="object-contain"
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Smart<span className="text-indigo-600">Access</span>
          </h1>
          <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
            AI Audit Platform
          </p>
        </div>

        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <nav className="flex flex-col gap-1 px-4 mt-2 md:mt-0">
          {navItems.map(({ href, label, Icon, isActive }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[15px]
                transition-all duration-200
                ${isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-[0.98]"
                }
              `}
            >
              <Icon
                size={19}
                className={isActive ? "text-white/90" : "text-slate-400"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="mt-auto px-5 pb-6 pt-4">
          <div className="rounded-xl bg-slate-50/80 border border-black/[0.04] p-4 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
              SmartAccess
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="h-[3px] w-8 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-350 mt-2 text-slate-400">
              v1.0 — AI Audit Tool
            </p>
          </div>
        </div>
      </div>
    </>
  );
}