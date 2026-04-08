import "server-only";

function normalizeBaseUrl(value?: string) {
  return value?.replace(/\/$/, "");
}

export function getCommerceBaseUrl() {
  const value =
    process.env.WORDPRESS_URL ||
    process.env.WC_WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  const baseUrl = normalizeBaseUrl(value);

  if (!baseUrl) {
    throw new Error("Missing WordPress base URL for commerce requests");
  }

  return baseUrl;
}

export function getWooCredentials() {
  const consumerKey =
    process.env.WC_CONSUMER_KEY ||
    process.env.NEXT_PUBLIC_WC_CONSUMER_KEY ||
    process.env.NEXT_PUBLIC_CONSUMER_KEY;
  const consumerSecret =
    process.env.WC_CONSUMER_SECRET ||
    process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET ||
    process.env.NEXT_PUBLIC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing WooCommerce credentials for server proxy");
  }

  return { consumerKey, consumerSecret };
}

export function getLuxApiBaseUrl() {
  const value =
    process.env.LUX_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  const baseUrl = normalizeBaseUrl(value);

  if (!baseUrl) {
    throw new Error("Missing LUX API base URL");
  }

  return baseUrl;
}

export function getWooBasicAuthHeader() {
  const { consumerKey, consumerSecret } = getWooCredentials();
  return `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`;
}
