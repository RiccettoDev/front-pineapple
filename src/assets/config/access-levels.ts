import { UserRole } from "./index";

export default [
  {
    path: "/home",
    role: [UserRole.user, UserRole.admin],
  },
  {
    path: "/home/second",
    role: [UserRole.user],
  },
  {
    path: "/home/:param",
    role: [UserRole.admin],
  },
];
