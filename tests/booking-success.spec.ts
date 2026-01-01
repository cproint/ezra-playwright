import { test } from "@playwright/test";
import { requireEnv } from "../utils/env";
import { testData } from "../utils/testData";

// Page Objects representing each step of the user journey
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { BookingStep1Page } from "../pages/BookingStep1Page";
import { BookingStep2Page } from "../pages/BookingStep2Page";
import { PaymentPage } from "../pages/PaymentPage";
import { ConfirmationPage } from "../pages/ConfirmationPage";
import { CookieBanner } from "../pages/CookieBanner";

/**
 * TC01 - User can book scanning appointment successfully with valid payment
 *
 * End-to-end happy-path test that validates:
 * - Authentication
 * - Scan selection
 * - Scheduling
 * - Payment
 * - Confirmation
 *
 * This test intentionally focuses on business flow validation
 * rather than low-level UI mechanics 
 */
test("TC01 - User can book scanning appointment with valid payment", async ({ page }) => {
  /**
   * Step 0: Test setup
   *
   * - Initialize CookieBanner helper (non-blocking UI element)
   * - Reads credentials from environment variables. real credentials are not checkedin 
   *   but sample .env is checkedin github for verification.
   */
  const cookieBanner = new CookieBanner(page);
  const email = requireEnv("EZRA_EMAIL");
  const password = requireEnv("EZRA_PASSWORD");

  /**
   * Step 1: Navigate to login page and handle cookie consent
   *
   * - Use LoginPage Page Object to abstract navigation
   * - if present, click 'Accept cookie' button 
   */
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await cookieBanner.acceptIfVisible();

  /**
   * Step 2: Log in with valid credentials
   *
   * Successful login is validated via a user-visible
   */
  await loginPage.login(email, password);

  /**
   * Step 3: Enter booking flow
   *
   * Instead of clicking through intermediate UI,
   * we load url to go directly to the Select Plan step
   * as one of best automation testing practice
   */
  const homePage = new HomePage(page);
  await homePage.gotoSelectPlan();

  /**
   * Step 4: Booking Step 1 – Select a scan plan
   *
   * - Assert that Select Plan page is loaded
   * - Chooses MRI Scan priced at $499
   * - Continue to scheduling step
   */
  const step1 = new BookingStep1Page(page);
  await step1.assertLoaded();
  await step1.selectScan("MRI Scan", "$499");
  await step1.continue();

  /**
   * Step 5: Booking Step 2 – Schedule scan
   *
   * - Select the recommended center
   * - Pick a random available date and time
   * - Continue to payment step
   */
  const step2 = new BookingStep2Page(page);
  await step2.selectRecommendedCenter();
  await step2.pickRandomAvailableDateAndTime();
  await step2.continue();

  /**
   * Step 6: Payment
   *
   * - Fill Stripe-secured card fields using test card data
   * - Data is injected from testData
   */
  const paymentPage = new PaymentPage(page);
  await paymentPage.pay(testData.validPayment);
  await paymentPage.continue();

  /**
   * Step 7: Confirmation
   *
   * - Assert successful booking
   * - Validate that MRI Scan appointment is shown
   * - Confirm that post-booking CTA is available
   */
  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.expectScanDetailsSane();
});
