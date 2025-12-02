import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  return (
   <div className="flex flex-col gap-auto pt-10 pb-20  bg-blue-100 h-full justify-between">

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