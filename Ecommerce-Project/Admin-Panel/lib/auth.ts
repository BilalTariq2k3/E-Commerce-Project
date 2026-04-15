import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from"./mongodb";
import Admin from '../models/admin';
import bcryptjs from "bcryptjs";

// Trim so stray whitespace/newlines in .env cannot break JWT encrypt/decrypt
const authSecret = process.env.NEXTAUTH_SECRET?.trim();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectDB();

        const user = await Admin.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Email not found");
        }

        const isValid = await bcryptjs.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 400000,
  },

  secret:
    authSecret ||
    (process.env.NODE_ENV === "development"
      ? "dev-fallback-secret-change-this"
      : undefined),
};
