import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value
              );
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const pathname =
    request.nextUrl.pathname;

  /*
   * Login page must always be accessible.
   */
  if (pathname === "/admin/login") {
    return response;
  }

  /*
   * Public pages do not need auth checks.
   */
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  /*
   * Ask Supabase for the authenticated user's
   * verified claims.
   */
  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims();

  /*
   * If claims are valid, allow the request.
   */
  if (!claimsError && claimsData?.claims) {
    return response;
  }

  /*
   * No valid admin session.
   * Redirect to login.
   */
  const loginUrl =
    request.nextUrl.clone();

  loginUrl.pathname =
    "/admin/login";

  loginUrl.searchParams.set(
    "redirect",
    pathname
  );

  const redirectResponse =
    NextResponse.redirect(loginUrl);

  /*
   * Preserve any cookies that Supabase
   * refreshed while checking the session.
   */
  response.cookies
    .getAll()
    .forEach((cookie) => {
      redirectResponse.cookies.set(
        cookie.name,
        cookie.value,
        cookie
      );
    });

  return redirectResponse;
}