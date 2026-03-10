

// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./Theme-toggle";
import SettingsPanel from "@/components/SettingsPanel";
import { Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return (
    <nav className="w-full bg-yaqoob px-4 py-2 flex justify-between items-center h-16   text-gray-900 shadow-sm border-b border-gray-300 ">
      <div className="text-2xl font-bold">
        {/* <Link href="/" className="hover:opacity-80 transition-opacity">
          NexusCRUD
        </Link> */}
        <Image
          src="/assets/images/logo.png"
          alt="NexusCRUD Logo"
          width={150}
          height={150}
          className="inline-block mr-2"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Settings"
            aria-expanded={open}
          >
            <Settings className="w-5 h-5" />
          </button>
          {open && <SettingsPanel onClose={() => setOpen(false)} />}
        </div>
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full relative ring-2 ring-gray-200 dark:ring-gray-700">
          <Image
            className="rounded-full object-cover"
            src="/assets/profile.jpeg"
            alt="Profile"
            fill
            sizes="40px"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;