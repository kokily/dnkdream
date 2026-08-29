import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const VISITOR_COOKIE = "dnk_vid";
const ONE_YEAR = 60 * 60 * 24 * 365;

export const proxy = auth((req) => {
  const existing = req.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId =
    existing && existing.length >= 8 ? existing : crypto.randomUUID();

  const response = NextResponse.next();

  if (!existing || existing.length < 8) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ONE_YEAR,
    });
  }

  return response;
});

export const config = {
  matcher: [
    "/write/:path*",
    "/post/:path*",
    "/",
    "/category/:path*",
    "/tag/:path*",
  ],
};
