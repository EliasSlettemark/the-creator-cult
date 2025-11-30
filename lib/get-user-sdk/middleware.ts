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
    console.error("No access token found in middleware. Token object keys:", tokenObj ? Object.keys(tokenObj) : 'no token object');
    return {};
  }
  
  return {
    sdk: new WhopSDK({ TOKEN: token as string }).userOAuth,
  };
};

export default getSdk;