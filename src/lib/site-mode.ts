// Whether the public storefront is live. Until it is, a deployment only serves the admin
// dashboard: storefront URLs redirect there and nothing is offered to search engines.
// Imported by the proxy, so keep this module free of DB imports.

/** Set STOREFRONT_ENABLED=true to show the store (locally now; in production when it's ready). */
export const storefrontEnabled = () => process.env.STOREFRONT_ENABLED === "true";
