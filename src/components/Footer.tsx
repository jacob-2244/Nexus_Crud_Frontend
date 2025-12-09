"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <footer
      className={`

        py-10 px-6 mt-auto shadow-inner border-t border-gray-300 transition-colors duration-300
      `}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">NexusCRUD</h2>
          <p className="text-sm md:text-base">
            Building seamless CRUD applications with modern technologies. Our goal is to make your workflow smoother and efficient.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors duration-200">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors duration-200">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors duration-200">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors duration-200">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500 transition-colors duration-200"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors duration-200"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors duration-200"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors duration-200"><Instagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm md:text-base">
        &copy; {new Date().getFullYear()} NexusCRUD. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
