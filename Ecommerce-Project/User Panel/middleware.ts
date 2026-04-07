import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/api/user" ||
          pathname === "/signup"
        ) {
          return true;
        }
        if (pathname.startsWith("/dashboard") || pathname === "/") {
          // check token
          // verify
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!_next/static_next|api/checkout||image|favico.item|public/).*)"],
};
