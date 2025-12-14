import type { NextAuthOptions } from "next-auth";

console.log("Auth Config Debug:");
console.log("Client ID exists:", !!process.env.NEXT_PUBLIC_WHOP_CLIENT_ID);
console.log("Client ID length:", process.env.NEXT_PUBLIC_WHOP_CLIENT_ID?.length || 0);
console.log("Client Secret exists:", !!process.env.WHOP_CLIENT_SECRET);
console.log("Client Secret length:", process.env.WHOP_CLIENT_SECRET?.length || 0);
console.log("Client ID first 10 chars:", process.env.NEXT_PUBLIC_WHOP_CLIENT_ID?.substring(0, 10) || "NOT SET");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "NOT SET");
console.log("Expected redirect URI:", `${process.env.NEXTAUTH_URL || "https://www.thecreatorcult.io"}/api/auth/callback/whop`);
export const authOptions: NextAuthOptions = {
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
      // Ensure redirect URI matches exactly
      checks: ["state"],
      allowDangerousEmailAccountLinking: true,
      profile(profile: {
        id: string;
        username: string;
        email: string;
        profile_pic_url: string;
      }) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.profile_pic_url,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
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