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

  const ruthLink = page.getByRole("link", { name: /Open Ruth detail/ }).first();
  await ruthLink.focus();
  await expect(ruthLink).toBeFocused();
  await page.keyboard.press("Enter");
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

  await page.getByRole("radio", { name: "Text only" }).check();
  await expect(page.locator(".scripture-link")).toHaveCount(0);
  await expect(page.locator(".garden-note-link")).toHaveCount(0);
  await expect(page.locator(".entity-chip")).toHaveCount(0);
});

test("opens inline verse links in a mobile sheet without losing place", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ruth/1");

  await expect(page.locator(".entity-chip")).toHaveCount(0);

  const moabLink = page
    .locator(".scripture-link--place")
    .filter({ hasText: /^Moab/ })
    .last();
  await moabLink.scrollIntoViewIfNeeded();
  const scrollBeforeTap = await page.evaluate(() => window.scrollY);
  await moabLink.click();

  const detail = page.locator("#reader-detail");
  await expect(page).toHaveURL(/\/ruth\/1\?node=moab/);
  await expect(
    page.getByRole("dialog", { name: "Moab" }),
  ).toBeVisible();
  await expect(detail).toBeFocused();
  await expect(detail).toBeInViewport({ ratio: 0.5 });
  await expect(
    page.getByRole("heading", { name: "Moab", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      Math.abs((await page.evaluate(() => window.scrollY)) - scrollBeforeTap),
    )
    .toBeLessThan(40);

  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/ruth\/1$/);
});
