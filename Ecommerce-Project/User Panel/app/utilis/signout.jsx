"use client";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

export const handleSignOut = () => {
  signOut({ callbackUrl: "/login" });
  toast.success('sigout successfully');
};