import { DefaultSession } from "next-auth";
import { AuthUser } from "./auth";

declare module "next-auth" {
  interface Session {
    user: AuthUser & DefaultSession["user"];
  }

  interface User extends AuthUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends AuthUser {}
} 