import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login")
  ) {
    return NextResponse.next();
  }

  // Protect all /admin and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api/")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
