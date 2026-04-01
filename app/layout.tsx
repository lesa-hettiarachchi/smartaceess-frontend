import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "SmartAccess",
  description: "Accessibility AI Audit Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans`}>
      <body className="bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-purple-50/20 to-slate-50 min-h-screen">
        <div className="flex flex-col md:flex-row min-h-screen relative">
          <Sidebar />
          <main className="flex-1 md:h-screen overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}