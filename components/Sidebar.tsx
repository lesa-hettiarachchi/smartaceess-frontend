"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, FolderOpen, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
      active
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 md:translate-x-1"
        : "text-slate-600 hover:bg-white/80 hover:text-indigo-600 md:hover:translate-x-1"
    }`;

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden glass backdrop-blur-3xl border-b border-white/50 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SmartAccess Logo"
            width={40}
            height={40}
            className="rounded-full object-cover border-[2px] border-white shadow-sm -translate-y-0.5"
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-800 mt-1">
            Smart<span className="text-indigo-600">Access</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/60 text-slate-600 hover:text-indigo-600 hover:bg-white shadow-sm border border-white/50 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        w-[280px] min-h-screen glass border-r border-slate-200/50 p-6 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Mobile Logo inside sidebar */}
        <div className="md:hidden flex items-center gap-3 mb-8 mt-2 px-2">
            <Image
              src="/logo.png"
              alt="SmartAccess Logo"
              width={40}
              height={40}
              className="rounded-full object-cover border-2 border-white shadow-sm -translate-y-0.5"
            />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-1">
              Smart<span className="text-indigo-600">Access</span>
            </h2>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:flex flex-col items-center mb-12 mt-6 space-y-4">
          <div className="relative group">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Image
              src="/logo.png"
              alt="SmartAccess Logo"
              width={85}
              height={85}
              className="relative rounded-full object-cover border-[3px] border-white shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Smart<span className="text-indigo-600">Access</span>
          </h1>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Link href="/" className={navItemClass(pathname === "/")}>
            <FileText size={20} className={pathname === "/" ? "text-white" : "text-indigo-400"} />
            Generate Report
          </Link>

          <Link
            href="/reports"
            className={navItemClass(
              pathname === "/reports" || pathname.startsWith("/reports/")
            )}
          >
            <FolderOpen size={20} className={pathname.startsWith("/reports/") || pathname === "/reports" ? "text-white" : "text-indigo-400"} />
            My Reports
          </Link>
        </div>

        <div className="mt-auto pb-4">
          <div className="glass-card rounded-2xl p-4 text-center border-t border-slate-200/50 md:border-transparent">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              AI Audit Tool
            </p>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-3"></div>
          </div>
        </div>
      </div>
    </>
  );
}