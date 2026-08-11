import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user session from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Support local mock role cookie for local development & immediate demoing
  const mockRole = request.cookies.get("fishlink_mock_role")?.value as
    | "buyer"
    | "supplier"
    | undefined;

  let role: "buyer" | "supplier" | "admin" | undefined = mockRole;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role) {
      role = profile.role;
    }
  }

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/daftar-buyer") ||
    pathname.startsWith("/daftar-supplier");

  const isSupplierRoute = pathname.startsWith("/supplier");
  const isBuyerRoute =
    pathname.startsWith("/beranda") ||
    pathname.startsWith("/katalog") ||
    pathname.startsWith("/custom-order") ||
    pathname.startsWith("/keranjang") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/pesanan") ||
    pathname.startsWith("/lacak") ||
    pathname.startsWith("/notifikasi") ||
    pathname.startsWith("/langganan");

  // Protected route checks
  if (isSupplierRoute) {
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role === "buyer") {
      return NextResponse.redirect(new URL("/beranda", request.url));
    }
  }

  if (isBuyerRoute) {
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role === "supplier") {
      return NextResponse.redirect(new URL("/supplier/beranda", request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && role) {
    if (role === "supplier") {
      return NextResponse.redirect(new URL("/supplier/beranda", request.url));
    } else {
      return NextResponse.redirect(new URL("/beranda", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
