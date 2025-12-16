


// @/app/layout-client.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/Theme-provider";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  const sidebarPosition = useSelector((state: RootState) => {
    console.log("Selector - Full state:", state);
    return state?.ui?.sidebarPosition || "left";
  });
  
  const showFooter = useSelector((state: RootState) => {
    return state?.ui?.showFooter ?? true;
  });

  useEffect(() => {
    setIsMounted(true);
    console.log("LayoutClient mounted");
  }, []);

  useEffect(() => {
    console.log("=== LAYOUT STATE CHANGED ===");
    console.log("isMounted:", isMounted);
    console.log("sidebarPosition:", sidebarPosition);
    console.log("showFooter:", showFooter);
  }, [sidebarPosition, showFooter, isMounted]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`flex h-screen ${isMounted && sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-8 py-6 overflow-auto">
            {children}
          </main>

          {/* Footer */}
          {isMounted && showFooter && <Footer />}
        </div>
      </div>
    </ThemeProvider>
  );
}