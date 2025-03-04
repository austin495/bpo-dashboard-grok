import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NEXTAUTH_URL) {
  console.warn("[next-auth] NEXTAUTH_URL is not defined in the environment variables.");
}
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("[next-auth] NEXTAUTH_SECRET is not defined in the environment variables.");
}
if (!process.env.DATABASE_URL) {
  console.warn("[next-auth] DATABASE_URL is not defined in the environment variables.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });

// 🔹 Extend NextAuth token type
declare module "next-auth/jwt" {
  interface JWT {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// 🔹 Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: AuthOptions = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { type: 'text' }, password: { type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await pool.connect();

        const result = await client.query('SELECT * FROM users WHERE email = $1', [credentials.email]);

        client.release();

        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: String(user.id), // Ensure ID is a string
          email: user.email,
          name: user.name ?? null, // Ensure name is null if undefined
          image: user.avatar ?? null, // Ensure image is null if undefined
        };
      }
    })
  ],

  callbacks: {
    async session({ session, token }) {
      console.log("Session Callback Triggered");
      session.user = {
        name: token.name ?? null,
        email: token.email ?? null,
        image: token.image ?? null,
      };
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT Callback Triggered");
      if (user) {
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.image = user.image ?? null;
      }
      return token;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };