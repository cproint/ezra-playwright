import { Page, expect } from "@playwright/test";

export class CookieBanner {
  constructor(private page: Page) {}

  private acceptButton = this.page.getByRole("button", { name: /accept/i });

  async acceptIfVisible() {
    if (await this.acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.acceptButton.click();
      await expect(this.acceptButton).toBeHidden({ timeout: 5000 });
    }
  }
}

