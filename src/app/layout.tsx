"use client";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ThemeManager from "@/components/ThemeManager";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <ReduxProvider >
          <ThemeManager/>
          <Navbar />

          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <main className="flex-1 px-4 md:px-8 py-6 overflow-auto">
              {children}
            </main>
          </div>

          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
