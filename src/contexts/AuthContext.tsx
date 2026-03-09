// // src/contexts/AuthContext.tsx
// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { User, UserRole } from "@/types/User";

// interface AuthContextType {
//   user: User | null;
//   login: (user: User) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
//   hasRole: (role: UserRole) => boolean;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch {
//         localStorage.removeItem("currentUser");
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem("currentUser", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("currentUser");
//   };

//   const isAuthenticated = user !== null;
//   const hasRole = (role: UserRole) => user?.role === role;

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };




// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/User";
import { MenuItem } from "@/hooks/useMenu";

interface AuthContextType {
  user: User | null;
  menu: MenuItem[];
  login: (userData: User, menuData: MenuItem[]) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedMenu = localStorage.getItem("currentMenu");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
    if (storedMenu) {
      try {
        setMenu(JSON.parse(storedMenu));
      } catch {
        localStorage.removeItem("currentMenu");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, menuData: MenuItem[]) => {
    setUser(userData);
    setMenu(menuData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("currentMenu", JSON.stringify(menuData));
  };

  const logout = () => {
    setUser(null);
    setMenu([]);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentMenu");
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, menu, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};