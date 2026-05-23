"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getConvexAdminSecret,
  verifyAdminPassword,
} from "@/lib/admin/session";

function requiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value.trim();
}

export async function loginAction(formData: FormData) {
  const password = requiredString(formData, "password");

  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, await createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

export async function createNodeAction(formData: FormData) {
  await fetchMutation(api.admin.createNode, {
    adminSecret: getConvexAdminSecret(),
    slug: requiredString(formData, "slug"),
    nodeType: requiredString(formData, "nodeType") as never,
    displayName: requiredString(formData, "displayName"),
    summary: requiredString(formData, "summary"),
    boundaryNote: (formData.get("boundaryNote") as string | null)?.trim() || undefined,
    externalReference:
      (formData.get("externalReference") as string | null)?.trim() || undefined,
    status: requiredString(formData, "status") as never,
    isPublic: formData.get("isPublic") === "on",
  });

  revalidatePath("/admin");
}

export async function createAnchorAction(formData: FormData) {
  await fetchMutation(api.admin.createAnchor, {
    adminSecret: getConvexAdminSecret(),
    nodeSlug: requiredString(formData, "nodeSlug"),
    passageSlug: requiredString(formData, "passageSlug"),
    anchorKind: requiredString(formData, "anchorKind") as never,
    displayLabel: requiredString(formData, "displayLabel"),
    readerSurface: requiredString(formData, "readerSurface") as never,
  });

  revalidatePath("/admin");
}

export async function createNodeTextLinkAction(formData: FormData) {
  const occurrenceValue = requiredString(formData, "occurrenceNumber");

  await fetchMutation(api.admin.createNodeTextLink, {
    adminSecret: getConvexAdminSecret(),
    nodeSlug: requiredString(formData, "nodeSlug"),
    passageSlug: requiredString(formData, "passageSlug"),
    verseKey: requiredString(formData, "verseKey"),
    linkedText: requiredString(formData, "linkedText"),
    occurrenceNumber: Number(occurrenceValue),
    anchorKind: requiredString(formData, "anchorKind") as never,
    displayLabel: requiredString(formData, "displayLabel"),
    contextLabel: (formData.get("contextLabel") as string | null)?.trim() || undefined,
  });

  revalidatePath("/admin");
}

export async function createRelationshipAction(formData: FormData) {
  await fetchMutation(api.admin.createRelationship, {
    adminSecret: getConvexAdminSecret(),
    sourceNodeSlug: requiredString(formData, "sourceNodeSlug"),
    targetNodeSlug: requiredString(formData, "targetNodeSlug"),
    relationshipTypeKey: requiredString(formData, "relationshipTypeKey") as never,
    evidenceClass: requiredString(formData, "evidenceClass") as never,
    publicLabel: requiredString(formData, "publicLabel"),
    rationale: requiredString(formData, "rationale"),
    sourcePassageSlug:
      (formData.get("sourcePassageSlug") as string | null)?.trim() || undefined,
  });

  revalidatePath("/admin");
}

export async function decideRelationshipAction(formData: FormData) {
  await fetchMutation(api.admin.decideRelationship, {
    adminSecret: getConvexAdminSecret(),
    relationshipId: requiredString(formData, "relationshipId") as never,
    decision: requiredString(formData, "decision") as never,
    rationale: requiredString(formData, "rationale"),
  });

  revalidatePath("/admin");
}

export async function reviewSuggestionAction(formData: FormData) {
  await fetchMutation(api.admin.reviewSuggestion, {
    adminSecret: getConvexAdminSecret(),
    suggestionId: requiredString(formData, "suggestionId") as never,
    reviewStatus: requiredString(formData, "reviewStatus") as never,
  });

  revalidatePath("/admin");
}
