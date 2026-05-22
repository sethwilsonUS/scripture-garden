import { expect, test } from "@playwright/test";

test("reads Ruth, opens a detail panel, follows a relationship, and returns", async ({
  page,
}) => {
  await page.goto("/ruth");
  await expect(
    page.getByRole("heading", { name: "Begin in Ruth." }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Start Ruth 1/ }).click();
  await expect(page).toHaveURL(/\/ruth\/1$/);
  await expect(page.getByRole("heading", { name: "Ruth 1" })).toBeVisible();

  await page.locator(".entity-chip").filter({ hasText: "Ruth" }).first().click();
  await expect(page).toHaveURL(/\/ruth\/1\?node=ruth/);
  await expect(page.locator("#reader-detail")).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Ruth", exact: true }),
  ).toBeVisible();

  await page.locator(".relationship-link").first().click();
  await expect(page).toHaveURL(/\/ruth\/1\?node=/);
  await expect(page.locator("#reader-detail")).toBeFocused();

  await page.goBack();
  await expect(page).toHaveURL(/\/ruth\/1\?node=ruth/);
  await expect(
    page.getByRole("heading", { name: "Ruth", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Close Ruth detail" })
    .click();
  await expect(page).toHaveURL(/\/ruth\/1$/);

  await page.getByRole("radio", { name: "hidden" }).check();
  await expect(page.locator(".entity-chip")).toHaveCount(0);
});
