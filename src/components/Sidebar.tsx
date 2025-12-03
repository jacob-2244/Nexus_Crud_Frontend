
"use client"
import Link from "next/link";
import { LogOut } from "lucide-react";
import { toggleTheme,setTheme } from "@/redux/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { UseDispatch, } from "react-redux";


const Sidebar = () => {
  // const dispatch = useDispatch()


    const theme = useSelector((state: RootState) => state.theme.mode);

  // Load saved theme on mount
  // useEffect(() => {
  //   const saved = localStorage.getItem("theme") as "light" | "dark";
  //   if (saved) dispatch(setTheme(saved));
  // }, [dispatch]);

  // useEffect(()=>{
  //   localStorage.setItem("theme",theme)
  // },[theme])

  return (
   <div className={`flex flex-col gap-auto pt-10 pb-20   h-full justify-between
   ${theme === "dark" ? "bg-black text-white" : "bg-blue-100 text-black"}
   border  border-gray-200 rounded
   `}>

    <div className="flex flex-col space-y-10 w-40 px-4 text-xl font-semibold ">
      <Link href="/" className="hover:text-gray-600 ">Dashboard</Link>
      <Link href="/users" className="hover:text-gray-600">Users</Link>
      <Link href="/about" className="hover:text-gray-600">About</Link>
    </div>

    <div className="flex gap-1 px-4 items-center hover:text-gray-600 hover:cursor-pointer ">
        <LogOut/>
        <p className="text-xl font-semibold ">Logout</p>
    </div>

    </div>
  );
};

export default Sidebar