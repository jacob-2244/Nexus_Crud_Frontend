
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}


export interface UserCreateInput {
  name: string;
  email: string;
  role?: UserRole;
}


export interface UserUpdateInput {
  id: number;
  name?: string;
  email?: string;
  role?: UserRole;
}
