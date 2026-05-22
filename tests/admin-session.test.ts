import {
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/admin/session";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const originalPassword = process.env.ADMIN_PASSWORD;
const originalSecret = process.env.ADMIN_SESSION_SECRET;

describe("admin session helpers", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "phase-two-mellon";
    process.env.ADMIN_SESSION_SECRET = "test-secret-for-signed-cookie";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalPassword;
    process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("accepts only the configured MVP admin password", () => {
    expect(verifyAdminPassword("phase-two-mellon")).toBe(true);
    expect(verifyAdminPassword("speak-friend-and-enter")).toBe(false);
  });

  it("creates a signed session token and rejects tampering", async () => {
    const token = await createAdminSessionToken();
    const replacement = token.endsWith("x") ? "y" : "x";
    const tampered = `${token.slice(0, -1)}${replacement}`;

    expect(await verifyAdminSessionToken(token)).toBe(true);
    expect(await verifyAdminSessionToken(tampered)).toBe(false);
  });
});
