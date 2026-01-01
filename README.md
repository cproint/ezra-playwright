# Ezra Booking Flow - Playwright Automation Framework

# Overview

This repository contains a Playwright-based end-to-end automation framework for validating the scan booking flow on Ezra’s web application.

The primary goal of this implementation is to demonstrate:

Test design and Architecture

Stable synchronization strategies

Scalable Page Object architecture

Secure handling of sensitive workflows (payments, PHI/PII awareness)

# Tech Stack

Playwright (TypeScript)

Page Object Model (POM)

Stripe test card integration

dotenv for environment configuration

# Project Structure

ezra-playwright/
├── pages/
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── BookingStep1Page.ts
│   ├── BookingStep2Page.ts
│   ├── PaymentPage.ts
│   └── ConfirmationPage.ts
    └── CookieBanner.ts
│
├── tests/
│   └── booking-success.spec.ts
    └── booking-decline.spec.ts
│
├── utils/
│   └── env.ts
    └── testData.ts
│
├── playwright.config.ts
└── README.md

Note: playwright-report and test-results folders will be created in IDE (eg: Visual Studio Code)

# Architecture & Design Principles

1. Page Object Model (POM)

Each page in the booking flow is modeled as a dedicated Page Object with:

Encapsulated selectors

Clear, business-level actions

No hardcoded test data

This keeps tests readable and minimizes duplication.

2. Synchronization Strategy

Ezra is a Single Page Application (SPA).
To avoid flaky tests:

domcontentloaded is used for navigation

Assertions wait on user-visible UI state

Global waits are read from playwright.config.ts

3. Deep-Link Navigation Where Appropriate

Once authentication is established, the framework:

Navigates directly to /book-scan/select-plan to avoid unnecessary UI clicks

Reduces execution time and brittleness

This is a conscious tradeoff used only when safe

4. Generalized & Extensible Page Actions

Scan selection and scheduling are generalized to support:

Multiple scan types 

5. Stripe Payment Handling

Stripe card inputs are hosted inside secure iframes and Handled using testData.ts

# Test Flows Covered

1. TC01 - Happy Path – Successful Scan Booking

    User logs in

    User navigates to Select Plan

    MRI Scan ($499) is selected

    Recommended center is chosen

    Random available date & time selected

    Payment is completed using a valid test credit card

    Confirmation page is validated

2. TC01 - UnHappy Path – UnSuccessful Scan Booking

    User logs in

    User navigates to Select Plan

    MRI Scan ($499) is selected

    Recommended center is chosen

    Random available date & time selected

    Payment is completed using a a declined test credit card

    Declined Credit Card Message is validated

# Tradeoffs & Assumptions

# Tradeoffs

    Dynamic dates/times are validated via sanity checks, not exact matches

    UI behavior is trusted over visual styling (e.g., bold vs grey dates)

    Direct URL navigation assumes valid authenticated session


# Assumptions

    Test credentials are valid

    Stripe test environment is enabled

    Booking availability exists for at least one center

    All other UI elements are validdated (eg: continue button is disabled until all data is entered etc)
    
# Security Considerations

    No credentials or card data are hardcoded in test

    Sensitive data is injected via environment variables

    Stripe fields are handled exclusively within secure iframes

    Entire application uses https

    Bearer Token expires after cetain time 

# Configuration

    Environment Variables are handled using .env file (not checked in to this repo)

# Running Tests
    npx playwright test tests/booking-success.spec.ts --headed

# Installation

    Please follow Playwright official documentation for installation instructions

