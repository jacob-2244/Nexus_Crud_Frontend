"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { toggleTheme, setTheme } from "@/redux/slices/themeSlice";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark";
    if (saved) dispatch(setTheme(saved));
  }, [dispatch]);

  // Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav
      className={` ${theme==="dark"? "bg-black text-white": "bg-gray-100 text-black"}px-4 py-2 flex justify-between items-center overflow-hidden position-fixed h-16 `}
    >
      <div className="text-2xl font-bold">
        <Link href="/">NexusCRUD</Link>
      </div>

      <div className="flex gap-30">
        <button
          className="p-4 rounded-lg hover:cursor-pointer"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>

        <div className="w-12 h-12 rounded-full relative">
          <Image
            className="absolute rounded-full"
            src="/assets/profile.jpeg"
            alt=""
            fill
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
