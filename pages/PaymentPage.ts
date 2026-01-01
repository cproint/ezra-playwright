import { Page, expect, FrameLocator } from "@playwright/test";

/**
 * PaymentDetails data structure
 */
export type PaymentDetails = {
  cardNumber: string;
  expiryMMYY: string; // Expected format: MM/YY
  cvc: string;
  zip: string;
};

/**
 * PaymentPage - Represents the payment step in the booking flow.
 */
export class PaymentPage {
  /**
   * Playwright Page instance injected by the test.
   */
  constructor(private readonly page: Page) {}

  /**
   * Continue button for completing payment and moving to the confirmation step.
   */
  private get continueButton() {
    return this.page.getByRole("button", { name: "Continue" });
  }

  /**
   * Payment page header.
   */
  private get paymentHeader() {
    return this.page.getByText("Choose a payment method");
  }

  /**
   * Declined Payment message.
   */
private get cardDeclinedError() {
  return this.stripeFrame().locator(
    'p[role="alert"]#Field-numberError'
  );
}

  /**
   * FrameLocator for the Stripe card payment iframe.
   */
  private stripeFrame(): FrameLocator {
    return this.page.frameLocator(
      'iframe[src*="elements-inner-payment"]:visible'
    );
  }

  /**
   * Raw locator for the Stripe payment iframe - Used  for visibility assertions before
   * interacting with iframe contents.
   */
  private get stripePaymentIframe() {
    return this.page.locator(
      'iframe[src*="elements-inner-payment"]:visible'
    );
  }

  /**
   * Normalizes a credit card number to Stripe’s expected format.
   *
   * Example:
   *   Input:  "4242424242424242"
   *   Output: "4242 4242 4242 4242"
   */
  private normalizeCardNumber(num: string) {
    const digits = num.replace(/\s+/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }

  /**
   * Normalizes expiration date to Stripe’s required format.
   *
   * Stripe expects: "MM / YY"
   */
  private normalizeExpiryMMYY(mmYY: string) {
    if (!/^\d{2}\/\d{2}$/.test(mmYY)) {
      throw new Error(
        `Expiry must be MM/YY (e.g., 01/26). Received: ${mmYY}`
      );
    }

    const [mm, yy] = mmYY.split("/");
    return `${mm} / ${yy}`;
  }

  /**
   * Asserts that the payment page is fully loaded and usable.
   *
   * This ensures we never attempt to interact with Stripe
   * before it is fully initialized.
   */
  async assertLoaded() {
    await expect(this.paymentHeader).toBeVisible();

    // Ensure the correct Stripe iframe is present
    await expect(this.stripePaymentIframe).toBeVisible();

    // Ensure a core field inside the iframe is ready
    await expect(
      this.stripeFrame().getByRole("textbox", { name: "Card number" })
    ).toBeVisible();
  }

  /**
   * Fills in payment details using Stripe-secured fields.
   */
  async pay(details: PaymentDetails) {
    await this.assertLoaded();

    const frame = this.stripeFrame();

    await frame
      .getByRole("textbox", { name: "Card number" })
      .fill(this.normalizeCardNumber(details.cardNumber));

    await frame
      .getByRole("textbox", { name: /Expiration date/i })
      .fill(this.normalizeExpiryMMYY(details.expiryMMYY));

    await frame
      .getByRole("textbox", { name: "Security code" })
      .fill(details.cvc);

    await frame
      .getByRole("textbox", { name: "ZIP code" })
      .fill(details.zip);

    // Stripe enables Continue only when form is valid
    await expect(this.continueButton).toBeEnabled();
  }

  async expectCardDeclinedError() {
    await expect(this.cardDeclinedError).toBeVisible();
    await expect(this.cardDeclinedError).toHaveText(
      /your card was declined/i
  );
  }
  
  /**
   * Completes the payment step and proceeds
   * to the confirmation page.
   */
  async continue() {
    await this.continueButton.click();
  }
}
