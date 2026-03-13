// src/hooks/useMenu.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface MenuItem {
  label: string;
  href?: string;
  roles?: string[];
  icon?: any;
  children?: MenuItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useMenu() {
  const { user, token } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.role || !token) {
      setMenuItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Fetch menu using the role from the VERIFIED JWT (via AuthContext /auth/me call)
    // Even if someone edits localStorage, user.role here comes from the backend-verified token
    fetch(`${API_URL}/menu/${encodeURIComponent(user.role)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setMenuItems(mapMenu(data));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMenuItems([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [user?.role, token]);

  return { menu: menuItems, loading };
}

// Map backend shape to frontend MenuItem
function mapMenu(items: any[]): MenuItem[] {
  return (items || []).map((item: any) => ({
    label: item.label,
    href: item.href,
    icon: item.icon,
    children: item.children?.length > 0 ? mapMenu(item.children) : undefined,
  }));
}