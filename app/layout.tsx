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
    <html lang="en" className={`${outfit.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-[var(--background)] text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900 min-h-screen">
        {/* Subtle ambient gradient — barely visible, adds depth */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.06),transparent)]" />

        <div className="flex flex-col md:flex-row min-h-screen relative">
          <Sidebar />
          <main className="flex-1 md:h-screen overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}