"use client"
import { useState } from "react";
import Link from "next/link";
// import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white px-4 py-2 flex justify-between items-center overflow-hidden position-fixed h-16">
      <div className="text-2xl font-bold">
        <Link href="/">NexusCRUD</Link>
      </div>

      <div className="w-12 h-12 rounded-full relative">
        <Image className="absolute rounded-full" src="/assets/profile.jpeg" alt="" fill />

      </div>
{/* 
  
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-gray-200">Dashboard</Link>
        <Link href="/users" className="hover:text-gray-200">Users</Link>
        <Link href="/about" className="hover:text-gray-200">About</Link>
      </div>

  
      <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </div>

      
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-center py-4 md:hidden space-y-4">
          <Link href="/" className="hover:text-gray-200" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link href="/users" className="hover:text-gray-200" onClick={() => setIsOpen(false)}>Users</Link>
          <Link href="/about" className="hover:text-gray-200" onClick={() => setIsOpen(false)}>About</Link>
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
