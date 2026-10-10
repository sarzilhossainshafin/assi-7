
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sign in and sign up pages must remain public.
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup";

  // Check the user's actual Better Auth session.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect unauthenticated visitors to sign in.
  if (!session && !isAuthPage) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackURL", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // Logged-in users don't need to revisit auth pages.
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
