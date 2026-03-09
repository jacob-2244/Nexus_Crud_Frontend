// src/hooks/useMenu.ts
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export interface MenuItem {
  label: string;
  href?: string;
  roles?: string[];
  icon?: any;
  children?: MenuItem[]; // make children optional to prevent undefined.length
}

export function useMenu() {
  const { menu } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMenuItems(menu ?? []); // always an array
    setLoading(false);
  }, [menu]);

  return { menu: menuItems, loading };
}