export type UserRole = 0 | 1 | 9 | "user" | "admin";

export interface UserProps {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  phone: string;
  access_token: string;
  avatar?: string;
}
