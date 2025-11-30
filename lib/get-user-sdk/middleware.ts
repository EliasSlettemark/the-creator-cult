import { WhopSDK } from "@whop-sdk/core";
import { NextRequestWithAuth } from "next-auth/middleware";

/**
 * gets the UserService from the WhopSDK from the session
 * @in middleware
 */
const getSdk = (req: NextRequestWithAuth) => {
  // Access token from NextAuth JWT
  const token = (req.nextauth?.token as any)?.accessToken as string | undefined;
  
  if (!token) {
    console.error("No access token found in middleware. Token object:", req.nextauth?.token);
    return {};
  }
  
  return {
    sdk: new WhopSDK({ TOKEN: token }).userOAuth,
  };
};

export default getSdk;
