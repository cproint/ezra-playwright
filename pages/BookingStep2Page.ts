import { Page, expect } from "@playwright/test";

/**
 * BookingStep2Page - This is basically Scheduling the Scan Page where user can select date/time
 */

export class BookingStep2Page {
  /**
   * Playwright Page instance injected by the test.
   */
  constructor(private readonly page: Page) {}

  /**
   * Here, the goal is to select recommended center.
   * TODO: Select any center based on center name
   */
  private get recommendedCenterCard() {
    return this.page
      .locator("div.location-card")
      .filter({ has: this.page.getByText("Recommended", { exact: true }) })
      .first();
  }

  /**
   * Continue button for advancing to the payment step.
   */
  private get continueButton() {
    return this.page.getByRole("button", { name: "Continue" });
  }

  /**
   * All visible calendar day "content" elements for the currently displayed month.
   */
  private get calendarDayContents() {
    return this.page.locator('[data-testid$="-cal-day-content"]');
  }

  /**
   * Selects the recommended scan center.
   */
  async selectRecommendedCenter() {
    await expect(this.recommendedCenterCard).toBeVisible();
    await this.recommendedCenterCard.click();

    // Calendar presence confirms center selection succeeded
    await expect(this.calendarDayContents.first()).toBeVisible();
  }

  /**
   * Selects a random available date and time.
   */
  async pickRandomAvailableDateAndTime() {
    const days = this.calendarDayContents;
    const dayCount = await days.count();

    if (dayCount === 0) {
      throw new Error("No calendar days found. Calendar may not be loaded.");
    }

    /**
     * Limiting retry attempts to avoid infinite loops.
     * Most months will have available slots within
     * a few random selections.
     */
    const maxAttempts = Math.min(12, dayCount);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const randomIndex = Math.floor(Math.random() * dayCount);
      const day = days.nth(randomIndex);

      // Availability is validated by time-slot appearance
      await day.click();

      // Attempt to select a time slot
      const picked = await this.tryPickAnyAvailableTime();
      if (picked) {
        // Selecting date+time should enable progression to 
        await expect(this.continueButton).toBeEnabled();
        return;
      }
    }

    throw new Error(
      `Could not find an available date/time after ${maxAttempts} attempts.`
    );
  }

  /**
   * Advances to the payment step.
   */
  async continue() {
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
  }

  // ---------- helpers ----------

  /**
   * Attempts to select any available time slot.
   *
   * Strategy:
   * - Look for visible time strings (e.g., "8:00 AM", "1:00 PM")
   *
   * Returns:
   * - true  -> time slot was found and clicked
   * - false -> no time slots present for this date
   */
  private async tryPickAnyAvailableTime(): Promise<boolean> {
    /**
     * Regex matches common time formats:
     * - 1–12 hour clock
     * - ":00" minutes
     * - AM / PM suffix
     */
    const timeCandidate = this.page
      .getByText(/\b\d{1,2}:00\s?(AM|PM)\b/i)
      .first();

    // No times means the selected day is unavailable
    if ((await timeCandidate.count().catch(() => 0)) === 0) return false;

    try {
      await expect(timeCandidate).toBeVisible();
      await timeCandidate.click();
      return true;
    } catch {
      // Slot existed but was not selectable (race condition / stale UI)
      return false;
    }
  }
}
