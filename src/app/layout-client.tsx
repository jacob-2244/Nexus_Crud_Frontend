// src/app/layout-client.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/Theme-provider";
import { isAuthPath, isPathAllowed } from "@/lib/routeGuard";
import { useMenu } from "@/hooks/useMenu";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const sidebarPosition = useSelector((state: RootState) => state.ui.sidebarPosition);
  const showFooter = useSelector((state: RootState) => state.ui.showFooter);

  // Always fetch live menu from backend — reflects permission changes immediately
  const { menu: menuItems, loading: menuLoading } = useMenu();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPath(pathname)) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Redirect authenticated users away from login/register
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAuthPath(pathname)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Role-based routing: redirect if user's role cannot access this path
  useEffect(() => {
    if (
      !isLoading &&
      !menuLoading &&
      isAuthenticated &&
      !isAuthPath(pathname) &&
      menuItems.length > 0
    ) {
      if (!isPathAllowed(pathname, menuItems)) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, menuLoading, isAuthenticated, pathname, menuItems, router]);

  if (isLoading || (!isAuthenticated && !isAuthPath(pathname))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthPath(pathname)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className="min-h-screen">{children}</main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`flex h-screen ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
        <Sidebar isExpanded={sidebarExpanded} setIsExpanded={setSidebarExpanded} />
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <Navbar />
          <main className="flex-1 px-4 md:px-8 py-6 overflow-auto min-h-0">{children}</main>
          {showFooter && <Footer />}
        </div>
      </div>
    </ThemeProvider>
  );
}