"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, FolderOpen } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
      active
        ? "bg-blue-100 text-blue-700 shadow-sm"
        : "text-gray-700 hover:bg-white/70"
    }`;

  return (
    <div className="w-[250px] min-h-screen bg-[#edf2fb] border-r border-gray-200 p-6 flex flex-col">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/logo.png"
          alt="SmartAccess Logo"
          width={90}
          height={90}
          className="rounded-full mb-3 object-cover"
        />
        <h1 className="text-3xl font-bold text-gray-800">SmartAccess</h1>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/" className={navItemClass(pathname === "/")}>
          <FileText size={20} />
          Generate Report
        </Link>

        <Link
          href="/reports"
          className={navItemClass(
            pathname === "/reports" || pathname.startsWith("/reports/")
          )}
        >
          <FolderOpen size={20} />
          My Reports
        </Link>
      </div>
    </div>
  );
}