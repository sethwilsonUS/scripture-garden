import { expect, test } from "@playwright/test";

test("protects the workbench and allows MVP admin login/logout", async ({
  page,
}) => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is required.");

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Editor login" })).toBeVisible();

  await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Enter workbench" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Ruth editorial garden" }),
  ).toBeVisible();
  await expect(
    page.getByRole("table", {
      name: "Relationships with public status and approval controls",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("creates an inline text link through the workbench", async ({ page }) => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is required.");

  const uniqueSlug = `e2e-inline-${Date.now()}`;

  await page.goto("/admin/login");
  await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Enter workbench" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  const nodeRegion = page.getByRole("region", { name: "Create node or stub" });
  await nodeRegion.getByLabel("Display name").fill("E2E Inline Link");
  await nodeRegion.getByLabel("Slug").fill(uniqueSlug);
  await nodeRegion.locator('select[name="nodeType"]').selectOption("theme_motif");
  await nodeRegion.locator('select[name="status"]').selectOption("draft");
  await nodeRegion
    .getByLabel("Public summary")
    .fill("Temporary private node for inline link smoke testing.");
  await nodeRegion.getByRole("button", { name: "Save node" }).click();

  const textLinkRegion = page.getByRole("region", {
    name: "Create inline text link",
  });
  await textLinkRegion.getByLabel("Node slug").fill(uniqueSlug);
  await textLinkRegion.getByLabel("Passage slug").fill("ruth-1");
  await textLinkRegion.getByLabel("Verse key").fill("ruth.1.1");
  await textLinkRegion.getByLabel("Linked text").fill("In");
  await textLinkRegion.getByLabel("Occurrence number").fill("1");
  await textLinkRegion.locator('select[name="anchorKind"]').selectOption("mention");
  await textLinkRegion.getByLabel("Display label").fill("Opening word");
  await textLinkRegion.getByLabel("Context label").fill("Private smoke node");
  await textLinkRegion.getByRole("button", { name: "Save inline link" }).click();

  await expect(page.getByText("create_node_text_link").first()).toBeVisible();
});
