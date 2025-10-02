import { cache } from "react";
import { cookies } from "next/headers";

/**
 * gets the UserService from the WhopSDK from the session
 * @in Server Components in the app directory
 * @dev wrapped in React.cache so other helpers that rely
 * on it can be properly cached too
 */
const getSdk = cache(async () => {
  return {
    user: {
      id: "demo-user",
      name: "User",
      email: "demo@example.com",
      image: null,
    } as any,
  } as any;
});

export default getSdk;
