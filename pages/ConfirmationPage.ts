import { Page, expect, Locator } from "@playwright/test";

/**
 * Expected Scan Appointment Confirmation Title. e.g "MRI Scan Appointment"
 */
export type ScanConfirmationExpected = {
  appointmentTitle?: string; 
};

/**
 * ConfirmationPage - Represents the final confirmation step after a successful booking.
 
 */
export class ConfirmationPage {
  /**
   * Playwright Page instance injected by the test.
   */
  constructor(private readonly page: Page) {}

  /**
   * Root container for the scan details card.
   */
  private get scanDetailsCard(): Locator {
    return this.page.locator("div.scan-details");
  }

  /**
   * Appointment title displayed within the scan details card.
   */
  private get appointmentTitle(): Locator {
    return this.scanDetailsCard.getByRole("heading", { level: 4 });
  }

  /**
   * Locator for Questionnaire Button 
   */
  private get beginMedicalQuestionnaireButton(): Locator {
    return this.page.getByRole("button", {
      name: /begin medical questionnaire/i,
    });
  }

  /**
   * Asserts that the confirmation page is loaded.
   */
  async assertOnPage() {
    await expect(this.page).toHaveURL(
      /\/book-scan\/scan-confirm(?:\?.*)?$/
    );

    await expect(this.scanDetailsCard).toBeVisible();
    await expect(this.appointmentTitle).toBeVisible();
  }

  /**
   * Sanity validation of scan confirmation details.
   */
  async expectScanDetailsSane() {
    await this.assertOnPage();

  /**
   * Sanity validation of scan confirmation details.
   * TODO: Validate Date/Time is correct. This can be done using api endpoint
   */    
    await expect(this.appointmentTitle).toHaveText(
      /MRI Scan Appointment/i
    );

    // Verify Begin Questionnaire Button appears so that we know Scan appt is successful
    await expect(this.beginMedicalQuestionnaireButton).toBeVisible();
  }
}
