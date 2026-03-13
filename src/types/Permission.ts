// src/types/Permission.ts
import { UserRole } from "./User";

export interface RoleGroup {
  id: number;
  name: string;
  roles: UserRole[];
  permissions?: RolePermission[];
}

export interface RolePermission {
  id: number;
  groupId: number;
  menuItemId: number;
  granted: boolean;
}

export interface MenuItemFlat {
  id: number;
  label: string;
  href?: string;
  parentId?: number;
}

export interface GroupPermissionsDetail {
  group: RoleGroup;
  menuItems: (MenuItemFlat & { granted: boolean })[];
}

export interface AllPermissionsView {
  groups: {
    id: number;
    name: string;
    roles: UserRole[];
    grantedMenuItemIds: number[];
  }[];
  menuItems: MenuItemFlat[];
}