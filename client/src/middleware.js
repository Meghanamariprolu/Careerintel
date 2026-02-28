import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

// Protect all routes inside /dashboard and /admin
export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
