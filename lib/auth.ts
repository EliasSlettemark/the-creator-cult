import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  debug: true, // Enable NextAuth debug logging
  providers: [
    {
      id: "whop",
      name: "Whop",
      type: "oauth" as const,
      authorization: {
        url: "https://whop.com/oauth",
        params: {
          scope: "openid profile email",
          response_type: "code",
        }
      },
      token: "https://api.whop.com/api/v5/oauth/token",
      userinfo: "https://api.whop.com/api/v5/me",
      clientId: process.env.NEXT_PUBLIC_WHOP_CLIENT_ID,
      clientSecret: process.env.WHOP_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile: any) {
        console.log("🔍 [NEXTAUTH] Raw Whop profile:", profile);
        
        // Ensure we have the required fields
        const userProfile = {
          id: profile.id || profile.sub || profile.user_id,
          name: profile.username || profile.name || profile.display_name,
          email: profile.email,
          image: profile.profile_pic_url || profile.avatar_url || profile.picture,
        };
        
        console.log("🔍 [NEXTAUTH] Processed user profile:", userProfile);
        return userProfile;
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
      
      // If redirecting to root, redirect to dashboard instead
      if (url === baseUrl || url === `${baseUrl}/`) {
        console.log("🔄 [NEXTAUTH] Redirecting root to dashboard");
        return `${baseUrl}/dashboard`;
      }
      
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
        tokenAccessToken: !!token.accessToken,
        sessionUser: session.user
      });
      
      // Ensure user ID is set from token
      if (token.id) {
        session.user.id = token.id as string;
      }
      
      // Set access token for Whop SDK
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
      }
      
      console.log("🔍 [NEXTAUTH] Final session:", {
        userId: session.user.id,
        hasAccessToken: !!(session as any).accessToken
      });
      
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("🔍 [NEXTAUTH] JWT callback:", { 
        hasToken: !!token, 
        hasUser: !!user, 
        hasAccount: !!account,
        hasProfile: !!profile,
        isNewUser,
        tokenId: token.id,
        tokenAccessToken: !!token.accessToken
      });
      
      // Set user ID from user object or profile
      if (user) {
        token.id = user.id;
        console.log("🔍 [NEXTAUTH] Set token ID from user:", user.id);
      } else if (profile) {
        const profileAny = profile as any;
        token.id = profileAny.id || profileAny.sub || profileAny.user_id;
        console.log("🔍 [NEXTAUTH] Set token ID from profile:", token.id);
      }
      
      // Set access token from account
      if (account) {
        token.accessToken = account.access_token;
        console.log("🔍 [NEXTAUTH] Set access token from account");
      }
      
      console.log("🔍 [NEXTAUTH] Final token:", {
        id: token.id,
        hasAccessToken: !!token.accessToken
      });
      
      return token;
    },
  },
};
