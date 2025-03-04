// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const protectedRoutes = ["/dashboard", "/profile", "/settings"];
//   const publicRoutes = ["/", "/login", "/signup"];

//   // Ensure `getToken()` resolves before middleware logic
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const { pathname } = req.nextUrl;

//   // Redirect unauthenticated users from protected routes to login
//   if (!token && protectedRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Redirect authenticated users away from login/signup pages
//   if (token && publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// // 🔹 Configure middleware to match all routes
// export const config = {
//   matcher: ["/((?!api|_next/static|favicon.ico).*)"], // Exclude Next.js static files
// };

// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - auth (Auth routes)
//      */
//     "/((?!api|auth|_next|static|public|favicon.ico|signup|login).*)",
//   ],
// };