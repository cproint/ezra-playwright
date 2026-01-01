import { Page, expect } from "@playwright/test";
import { requireEnv } from "../utils/env";
/**
 * HomePage - User Logs after successful Login and it's an entry point for the booking flow
 */
export class HomePage {
  /**
   * Playwright Page instance injected by the test.
   */
  constructor(private readonly page: Page) {}

  /**
   * Navigates directly to the "Select Plan" page
   * Note that rather than clicking Book Scan Appt, I am going directly to Select URL
   * This is one of best practice in Automation
   */
  async gotoSelectPlan() {
    const baseUrl = requireEnv("EZRA_BASE_URL");
    const url = new URL("/book-scan/select-plan", baseUrl).toString();
    await this.page.goto(url, { waitUntil: "domcontentloaded" });

    /**
     * Ensure the user is on /book-scan/select-plan page
     */
    await expect(this.page).toHaveURL(/\/book-scan\/select-plan/);

    /**
     * Additionally, ensure that Review your plan radio button is visible
     */
    await expect(
      this.page.getByText("Review your plan", { exact: true })
    ).toBeVisible();
  }
}
