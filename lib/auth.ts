import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Admission Number", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.identifier },
                            { admissionNumber: credentials.identifier },
                        ],
                    },
                });



                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    role: user.role,
                    email: user.email,
                    name: (user as any).name,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.name = (user as any).name;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.sub!,
                    role: token.role as string,
                    name: token.name as string,
                };
            }
            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
};