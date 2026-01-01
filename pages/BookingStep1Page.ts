import { Page, expect } from "@playwright/test";
/**
 * BookingStep1Page - This is basically Review your Plan Page where user can select a scan plan
 * (e.g., Select MRI Scan for $499 etc)
 */
export class BookingStep1Page {
  /**
   * Playwright Page instance injected by the test.
   */
  constructor(private readonly page: Page) {}

  /**
   * Continue button for advancing to scheduling page (BookingStep2)
   */
  private get continueButton() {
    return this.page.getByRole("button", { name: "Continue" });
  }
  /**
   * Asserts that Step 1 (Select Plan) is fully loaded.
   */
  async assertLoaded() {
    await expect(
      this.page.getByText("Review your plan", { exact: true })
    ).toBeVisible();
  }

  /**
   * Selects the MRI Scan ($499) option.
   */
  async selectScan(scanName: string, price: string) {
    const scanCard = this.page
      .getByTestId("MFULLBODY30-encounter-card")
      .filter({
        hasText: `${scanName} Available at ${price}`,
      })
      .first();

    await expect(scanCard).toBeVisible();
    await scanCard.click();

    // Selecting a scan should enable the Continue button
    await expect(this.continueButton).toBeEnabled();
  }
  
  /**
   * Advances to the next booking step (Schedule Date/Time) 
   */
  async continue() {
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
  }
  
}
