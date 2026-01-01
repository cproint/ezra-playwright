import { Page, expect } from "@playwright/test";
import { requireEnv } from "../utils/env";

/**
 * LoginPage - Page Object Model representing Ezra's login Page.
 */
export class LoginPage {
  /**
   * Playwright Page instance injected by the test.
   * readonly is used to prevent reassignment.
   */
  constructor(private readonly page: Page) {}

  /**
   * Email input field with locator id
   */
  private get email() {
    return this.page.locator("#email");
  }

  /**
   * Password input field with locator id
   */
  private get password() {
    return this.page.locator("#password");
  }

  /**
   * Submit button with button name
   */
  private get submit() {
    return this.page.locator("button.submit-btn");
  }

  /**
   * Navigates to the login page.
   * - Base URL can be environment specific (eg: qa/staging/prod etc)
   * - Used `domcontentloaded` so as soon as DOM is loaded, we can interact with the web elements 
   * - Explicitly waits for form fields to be visible
   */
  async goto() {
    const baseUrl = requireEnv("EZRA_BASE_URL");

    await this.page.goto(`${baseUrl}/sign-in`, {
      waitUntil: "domcontentloaded",
    });

    // Ensure login form is fully rendered before interacting
    await expect(this.email).toBeVisible();
    await expect(this.password).toBeVisible();
  }

  /**
   * Performs login using provided credentials.
   */
  async login(email: string, password: string) {
    // Fill credentials
    await this.email.fill(email);
    await this.password.fill(password);

    // Submit the login form
    await this.submit.click();

    /**
     * Post-login assertion
     * Explicitly wait for a dashboard element  - "book-scan-btn"
     */
    const bookScanVisible = this.page.locator(
      '[data-testid="book-scan-btn"]:visible'
    );

    await expect(bookScanVisible).toBeVisible({ timeout: 30000 });
  }
}
