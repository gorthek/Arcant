import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "1521523509589704714",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "74yh6dUQGh45TWhVYKjh9zLVRQf1B2Zf",
      authorization: { params: { scope: "identify email guilds" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "arcant_super_secret_key_12345",
  pages: {
    signIn: '/login', // Rediriger vers notre belle page au lieu de celle par défaut
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // account n'est défini qu'à la première connexion
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // Passe le accessToken à la session client
        // @ts-ignore
        session.accessToken = token.accessToken || null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
