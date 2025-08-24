import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  debug: true, // Enable NextAuth debug logging
  providers: [
    {
      id: "whop",
      name: "Whop",
      type: "oauth" as const,
      authorization: "https://whop.com/oauth",
      token: "https://api.whop.com/api/v5/oauth/token",
      userinfo: "https://api.whop.com/api/v5/me",
      clientId: process.env.NEXT_PUBLIC_WHOP_CLIENT_ID,
      clientSecret: process.env.WHOP_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile: {
        id: string;
        username: string;
        email: string;
        profile_pic_url: string;
      }) {
        console.log("🔍 [NEXTAUTH] Processing Whop profile:", profile);
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.profile_pic_url,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("🔍 [NEXTAUTH] Redirect callback:", { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("🔍 [NEXTAUTH] Session callback:", { 
        hasSession: !!session, 
        hasUser: !!user, 
        hasToken: !!token,
        tokenId: token.id,
        tokenAccessToken: !!token.accessToken
      });
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("🔍 [NEXTAUTH] JWT callback:", { 
        hasToken: !!token, 
        hasUser: !!user, 
        hasAccount: !!account,
        isNewUser
      });
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
