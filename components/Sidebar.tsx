"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, FolderOpen } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
      active
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 translate-x-1"
        : "text-slate-600 hover:bg-white/80 hover:text-indigo-600 hover:translate-x-1"
    }`;

  return (
    <div className="w-[280px] min-h-screen glass border-r border-slate-200/50 p-6 flex flex-col relative z-10">
      <div className="flex flex-col items-center mb-12 mt-6 space-y-4">
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
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            AI Audit Tool
          </p>
          <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-3"></div>
        </div>
      </div>
    </div>
  );
}