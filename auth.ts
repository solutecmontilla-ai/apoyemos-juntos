import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { normalizeCedula } from "@/lib/auth/cedula";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        cedula: { label: "Cédula", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const cedula = credentials?.cedula;
        const password = credentials?.password;
        if (typeof cedula !== "string" || typeof password !== "string") {
          return null;
        }

        const db = getDb();
        const [usuario] = await db
          .select()
          .from(usuarios)
          .where(eq(usuarios.cedula, normalizeCedula(cedula)))
          .limit(1);

        if (!usuario) return null;

        const valido = await verifyPassword(password, usuario.passwordHash);
        if (!valido) return null;

        return {
          id: usuario.id,
          name: usuario.nombreCompleto,
          cedula: usuario.cedula,
          rol: usuario.rol,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = (user as { rol: string }).rol;
        token.cedula = (user as { cedula: string }).cedula;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as "participante" | "admin";
        session.user.cedula = token.cedula as string;
      }
      return session;
    },
  },
});
