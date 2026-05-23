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

test("makes tapped verse chips visible on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ruth/1");

  await page.locator(".entity-chip").filter({ hasText: "Moab" }).first().click();

  const detail = page.locator("#reader-detail");
  await expect(page).toHaveURL(/\/ruth\/1\?node=moab/);
  await expect(detail).toBeFocused();
  await expect(detail).toBeInViewport({ ratio: 0.5 });
  await expect(
    page.getByRole("heading", { name: "Moab", exact: true }),
  ).toBeVisible();
});
