export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect everything EXCEPT login, home, NextAuth internals, and static files
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|$).*)",
  ],
};