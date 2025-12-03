"use client"
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Footer = () => {
  const theme= useSelector((state:RootState)=> state.theme.mode)
  return (
    <footer className={`${theme==="dark"? "bg-black text-white": "bg-gray-100 text-black"}  py-6 px-6 mt-auto h-16`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} NexusCRUD. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-200">Privacy</a>
          <a href="#" className="hover:text-gray-200">Terms</a>
          <a href="#" className="hover:text-gray-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
