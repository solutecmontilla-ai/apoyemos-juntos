import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const usuario = req.auth?.user;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!usuario || usuario.rol !== "admin") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/cuenta")) {
    if (!usuario) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/cuenta/:path*"],
};
