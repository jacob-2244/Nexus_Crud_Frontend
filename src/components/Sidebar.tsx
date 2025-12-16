// src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { LogOut, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { UsersIcon } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      href: "/",
      icon: LayoutDashboardIcon,
      label: "Dashboard",
      options: [
        { label: "Option 1", href: "/option" },
        { label: "Option 2", href: "/option" },
      ],
    },
    {
      href: "/users",
      icon: UsersIcon,
      label: "Users",
      options: [
        { label: "Option 1", href: "/option" },
        { label: "Option 2", href: "/option" },
      ],
    },
    {
      href: "/about",
      icon: InfoIcon,
      label: "About",
      options: [
        { label: "Option 1", href: "/option" },
        { label: "Option 2", href: "/option" },
      ],
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div
      className={`flex flex-col pt-4 pb-20 h-full dark:text-white border border-gray-200 rounded transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end px-4 mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:text-black hover:bg-gray-100 dark:hover:text-black dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openDropdown === item.label;

          return (
            <div key={item.label} className="space-y-1">
              {/* Main Menu Item */}
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-1"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>

                {/* Dropdown Toggle */}
                {isExpanded && (
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="p-2 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Dropdown Options */}
              {isExpanded && isOpen && (
                <div className="ml-8 space-y-1 animate-slideDown">
                  {/* {item.options.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      className="block px-3 py-2 text-sm  dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {option.label}
                    </Link>
                  ))} */}
                  {item.options.map((option, index) => (
                    <Link
                      key={`${option.label}-${index}`}
                      href={option.href}
                      className="block px-3 py-2 text-sm dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Logout Button */}
      <div className="px-3">
        <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 rounded-lg hover:cursor-pointer transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && (
            <span className="text-sm font-medium whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
