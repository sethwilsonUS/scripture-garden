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
