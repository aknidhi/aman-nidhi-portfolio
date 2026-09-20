import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
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
          /*
           * Update request cookies first.
           */
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value
              );
            }
          );

          /*
           * Recreate the response using the
           * updated request cookies.
           */
          supabaseResponse =
            NextResponse.next({
              request,
            });

          /*
           * Copy Supabase auth cookies onto
           * the response.
           */
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              supabaseResponse.cookies.set(
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
   * The login page must remain publicly
   * accessible.
   */
  if (pathname === "/admin/login") {
    return supabaseResponse;
  }


  /*
   * Only protect /admin routes.
   */
  if (!pathname.startsWith("/admin")) {
    return supabaseResponse;
  }


  /*
   * Check the authenticated user's claims.
   *
   * getClaims() is used instead of getSession()
   * for server-side authorization.
   */
  const {
    data,
    error,
  } = await supabase.auth.getClaims();

  const claims = data?.claims;


  /*
   * No valid authentication.
   */
  if (error || !claims) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      "/admin/login";

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    /*
     * Create the redirect response.
     */
    const redirectResponse =
      NextResponse.redirect(
        loginUrl
      );

    /*
     * IMPORTANT:
     *
     * Supabase may have refreshed or changed
     * authentication cookies while getClaims()
     * was running.
     *
     * Those cookies must also be copied to
     * the redirect response.
     */
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => {
        redirectResponse.cookies.set(
          cookie
        );
      });


    /*
     * Preserve cache-related headers.
     */
    for (const header of [
      "cache-control",
      "expires",
      "pragma",
    ]) {
      const value =
        supabaseResponse.headers.get(
          header
        );

      if (value) {
        redirectResponse.headers.set(
          header,
          value
        );
      }
    }

    return redirectResponse;
  }


  /*
   * User is authenticated.
   */
  return supabaseResponse;
}