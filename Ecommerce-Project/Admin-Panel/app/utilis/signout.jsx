"use client";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

export const handleSignOut = () => {
  signOut({ callbackUrl: "/admin/login" });
  toast.success("logout successfully");
};
