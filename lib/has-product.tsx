import type { UserOAuthService } from "@whop-sdk/core/node/services/UserOAuthService";

/**
 * helper to check if a user owns a certain product,
 * @returns the membership of the matched product.
 */
const findProduct = async (
  sdk: UserOAuthService,
  allowedProducts: string | string[]
) => {
  if (typeof allowedProducts === "string") allowedProducts = [allowedProducts];
  const memberships = (await sdk.listUsersMemberships({ valid: true })).data;
  return (
    memberships?.find(
      (membership) =>
        membership.product && allowedProducts.includes(membership.product)
    ) || null
  );
};

export default findProduct;
