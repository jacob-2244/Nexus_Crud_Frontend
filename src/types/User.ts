
export interface User {
  id: number;
  name: string;
  email: string;
}


export interface UserCreateInput {
  name: string;
  email: string;
}


export interface UserUpdateInput {
  id: number;
  name?: string;
  email?: string;
}
