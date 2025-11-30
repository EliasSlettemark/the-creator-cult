import { WhopSDK } from "@whop-sdk/core";
import { NextRequestWithAuth } from "next-auth/middleware";

/**
 * gets the UserService from the WhopSDK from the session
 * @in middleware
 */
const getSdk = (req: NextRequestWithAuth) => {
  // Access token from NextAuth JWT
  // Try multiple possible property paths
  const tokenObj = req.nextauth?.token as any;
  const token = tokenObj?.accessToken || tokenObj?.access_token;
  
  if (!token) {
    console.error("No access token found in middleware.");
    console.error("Token object:", JSON.stringify(tokenObj, null, 2));
    console.error("Request nextauth:", JSON.stringify({
      hasToken: !!req.nextauth?.token,
      tokenKeys: tokenObj ? Object.keys(tokenObj) : [],
      hasSession: !!req.nextauth?.session,
    }, null, 2));
    return {};
  }
  
  console.log("Access token found, length:", token.length);
  
  return {
    sdk: new WhopSDK({ TOKEN: token as string }).userOAuth,
  };
};

export default getSdk;