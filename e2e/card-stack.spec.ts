import { expect, type Page, test } from "@playwright/test";

async function waitForStack(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("loading-overlay")).toHaveCount(0, {
    timeout: 15_000,
  });
  await expect(page.getByTestId("top-card")).toBeVisible();
}

async function dragTopCard(page: Page, deltaX: number) {
  const card = page.getByTestId("top-card");
  const box = await card.boundingBox();
  if (!box) {
    throw new Error("Top card has no bounding box");
  }

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  const pointer = page.mouse;

  await pointer.move(startX, startY);
  await pointer.down();
  await pointer.move(startX + deltaX, startY, { steps: 16 });
  await pointer.up();
}

test("shows the photo stack after loading", async ({ page }) => {
  await waitForStack(page);
  await expect(page.getByTestId("top-card")).toHaveAttribute("data-alt", "Aiden");
  await expect(page.getByRole("img", { name: "Aiden" })).toBeVisible();
  await expect(page.getByText("Swipe the top photo left or right.")).toBeVisible();
});

test("swiping past the threshold cycles to the next photo", async ({ page }) => {
  await waitForStack(page);
  await expect(page.getByTestId("top-card")).toHaveAttribute("data-alt", "Aiden");
  await dragTopCard(page, 320);
  await expect(page.getByTestId("top-card")).toHaveAttribute("data-alt", "Garnie", {
    timeout: 5_000,
  });
});

test("a short drag snaps the top photo back", async ({ page }) => {
  await waitForStack(page);
  await dragTopCard(page, 36);
  await expect(page.getByTestId("top-card")).toHaveAttribute("data-alt", "Aiden");
  await expect(page.getByRole("img", { name: "Aiden" })).toBeVisible();
});
