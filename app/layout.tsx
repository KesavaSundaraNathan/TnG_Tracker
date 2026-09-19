import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "TnG Tracker",
  description: "Track transit card reloads and log every MRT, LRT, KTM and bus journey.",
  appleWebApp: { capable: true, title: "TnG Tracker", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F3F5F9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))]">
            {children}
          </main>
          <BottomNav />
        </WalletProvider>
      </body>
    </html>
  );
}
