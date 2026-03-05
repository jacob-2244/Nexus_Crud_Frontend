

// // @/app/layout-client.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter, usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
// import Footer from "@/components/Footer";
// import { ThemeProvider } from "@/components/Theme-provider";

// export default function LayoutClient({ children }: { children: React.ReactNode }) {
//   const [isMounted, setIsMounted] = useState(false);
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const sidebarPosition = useSelector((state: RootState) => {
//     console.log("Selector - Full state:", state);
//     return state?.ui?.sidebarPosition || "left";
//   });

//   const showFooter = useSelector((state: RootState) => {
//     return state?.ui?.showFooter ?? true;
//   });

//   useEffect(() => {
//     setIsMounted(true);
//     console.log("LayoutClient mounted");
//   }, []);

//   useEffect(() => {
//     console.log("=== LAYOUT STATE CHANGED ===");
//     console.log("isMounted:", isMounted);
//     console.log("sidebarPosition:", sidebarPosition);
//     console.log("showFooter:", showFooter);
//   }, [sidebarPosition, showFooter, isMounted]);

//   // Authentication check
//   useEffect(() => {
//     // Allow access to login page
//     if (pathname === '/login') {
//       return;
//     }

//     // Don't redirect while loading
//     if (isLoading) {
//       return;
//     }

//     // Redirect to login if not authenticated
//     if (!isAuthenticated) {
//       router.push('/login');
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);

//   // Show loading or redirect while checking authentication
//   if (isLoading || (!isAuthenticated && pathname !== '/login')) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       <div className={`flex h-screen ${isMounted && sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <div className="flex flex-col flex-1 overflow-hidden">
//           {/* Navbar */}
//           <Navbar />

//           {/* Main Content */}
//           <main className="flex-1 px-4 md:px-8 py-6 overflow-auto">
//             {children}
//           </main>

//           {/* Footer */}
//           {/* {isMounted && showFooter && <Footer />} */}
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/Theme-provider";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.startsWith("/auth")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || (!isAuthenticated && !pathname.startsWith("/auth"))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen">
        <Sidebar isExpanded={sidebarExpanded} setIsExpanded={setSidebarExpanded} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 px-4 md:px-8 py-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}