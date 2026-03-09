// src/app/layout.tsx
"use client";

import "./globals.css";
import React from "react";
import ReduxProvider from "@/redux/Provider";
import LayoutClient from "./layout-client";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-[var(--app-background)]">
        <ReduxProvider>
          <AuthProvider>
            <LayoutClient>{children}</LayoutClient>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}