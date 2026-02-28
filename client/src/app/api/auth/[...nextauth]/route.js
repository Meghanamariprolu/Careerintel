import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    const res = await fetch("http://localhost:5000/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });

                    const user = await res.json();

                    if (!res.ok) {
                        throw new Error(user.message || "Failed to login");
                    }

                    if (user && user.token) {
                        return user; // Return user object matching what backend gives + token
                    }

                    return null;
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
                token.accessToken = user.token; // From our backend Express JWT
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.name = token.name;
            session.user.email = token.email;
            session.accessToken = token.accessToken;
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET || "super_secret_jwt_key_for_development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
