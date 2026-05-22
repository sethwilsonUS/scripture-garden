export const ADMIN_COOKIE_NAME = "sg_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return secret;
}

function base64UrlEncode(value: string | ArrayBuffer) {
  const bytes =
    typeof value === "string"
      ? new TextEncoder().encode(value)
      : new Uint8Array(value);

  return Buffer.from(bytes)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );

  return base64UrlEncode(signature);
}

export async function createAdminSessionToken() {
  const issuedAt = Date.now();
  const payload = base64UrlEncode(
    JSON.stringify({
      subject: "admin:mvp",
      issuedAt,
      expiresAt: issuedAt + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    }),
  );
  const signature = await signPayload(payload);

  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expected = await signPayload(payload);

  if (signature !== expected) {
    return false;
  }

  const parsed = JSON.parse(base64UrlDecode(payload)) as {
    expiresAt?: number;
  };

  return typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
}

export function getConvexAdminSecret() {
  const secret = process.env.CONVEX_ADMIN_SECRET;

  if (!secret) {
    throw new Error("CONVEX_ADMIN_SECRET is not configured.");
  }

  return secret;
}

export function verifyAdminPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  return candidate.length > 0 && candidate === expected;
}
