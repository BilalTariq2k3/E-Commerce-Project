import { NextResponse } from "next/server";

/**
 * Clears NextAuth session cookies when the stored JWT cannot be decrypted
 * (e.g. NEXTAUTH_SECRET changed). Then sends the user to login with a fresh session.
 */
export async function GET(request: Request) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("notice", "session_reset");

  const res = NextResponse.redirect(loginUrl);

  const names = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.session-token",
  ];
  for (const name of names) {
    res.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return res;
}
