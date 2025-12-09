


"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { UsersIcon } from "lucide-react";
import { InfoIcon } from "lucide-react";

const Sidebar = () => {
  return (
    <div
      className={`
        flex flex-col pt-10 pb-20 h-screen justify-between 
      
        dark:text-white
        border border-gray-200 rounded
        transition-colors duration-300
      `}
    >
      <div className="flex flex-col space-y-10 w-28 items-center px-4 text-center text-xl font-semibold ">
        <Link href="/" className="hover:text-gray-600">
      < LayoutDashboardIcon/>
        </Link>
        <Link href="/users" className="hover:text-gray-600">
        <UsersIcon/>
        </Link>
        <Link href="/about" className="hover:text-gray-600">
        <InfoIcon/>
        </Link>
      </div>

      <div className="flex  gap-1  px-4 items-center hover:text-gray-600 hover:cursor-pointer">
        <LogOut className="mx-auto w-full" />
        {/* <p className="text-xl font-semibold">Logout</p> */}
      </div>
    </div>
  );
};

export default Sidebar;
