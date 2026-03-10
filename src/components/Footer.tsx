"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="shrink-0 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-gray-800 dark:text-gray-200">FireThorn</span>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Contact
          </a>
          <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Support
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="Facebook">
            <Facebook size={16} />
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="Instagram">
            <Instagram size={16} />
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} FireThorn. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
