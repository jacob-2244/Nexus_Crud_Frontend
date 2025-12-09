"use client";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import LayoutClient from "./layout-client";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className="flex flex-col min-h-screen bg-[var(--app-background)]">
        <ReduxProvider>
          <LayoutClient>{children}</LayoutClient>
        </ReduxProvider>
      </body>
    </html>
  );
}