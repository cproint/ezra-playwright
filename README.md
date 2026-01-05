# Ezra Booking Flow - Playwright Automation Framework

# Overview

This repository contains a Playwright-based end-to-end automation framework for validating the scan booking flow on Ezra’s web application.

The primary goal of this implementation is to demonstrate:

Test design and Architecture

Stable synchronization strategies

Scalable Page Object architecture

Secure handling of sensitive data (payments, env variables)

# Tech Stack

Playwright (TypeScript)

Page Object Model (POM)

Stripe test card integration

dotenv for environment configuration

# Project Structure

ezra-playwright/
├── .github/workflows
│   ├── playwright.yml
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

Note: playwright-report and test-results folders will be created in IDE (eg: Visual Studio Code) or under https://github.com/cproint/ezra-playwright/actions/runs if using github actions

# Architecture & Design Principles

1. Page Object Model (POM)

Each page in the booking flow is modeled as a dedicated Page Object with:

Encapsulated selectors

Clear, business-level actions

No hardcoded test data

This keeps tests readable and minimizes duplication

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

    To keep the tests fast and reliable, the booking flow sometimes navigates directly to a page instead of clicking through every screen. This works well, but it assumes the user is already logged in

    Dates and times for scans are selected dynamically based on availability. Because these values change from run to run, the tests check that a valid appointment was booked rather than matching an exact date or time.

    The tests rely on how the application behaves (for example, whether time slots appear) instead of how things look visually (such as bold or grey text). This makes the tests more stable if the UI styling changes.



# Assumptions

    The test account credentials provided are valid and active.

    Stripe is running in a test mode and accepts standard test credit card numbers.

    At least one scan center has availability so the booking flow can complete.

    Core UI behaviors (such as disabling the Continue button until required fields are filled) are already covered by existing tests and are not re-validated in this flow
    
# Security Considerations

    No credentials or card data are hardcoded in test

    Sensitive data is injected via environment variables

    Stripe fields are handled exclusively within secure iframes

    Entire application uses https

    Bearer Token expires after cetain time 

# Configuration

    Environment Variables are handled using .env file (not checked in to this repo)

# Installation

    Please follow Playwright official documentation for installation instructions

# How to Run Tests?
    clone the repo and run below command
    npx playwright test tests/booking-success.spec.ts --headed
    or
    one can run directly using github actions workflow from https://github.com/cproint/ezra-playwright/actions 
# TODO?
    Create a separate repo and call it as common-repo. This repo should have common methods like Login, DB utilities, common utils, logging, common locators etc that will be used by many automation test teams.

    Add more tests to verify Scan details, Admin test cases using User facing Portal etc (eg: the appointment details are recorded correctly in User facing Portal etc)

    Create a separate repo for testing API endpoints, Security, Performance, end-to-end, Accessibility, Localization Testing etc

    Infra changes to run tests based on number of parallel nodes per product

    Write scripts to seed data into various envs before running tests 

    Useful tools to scrape/synthesize Production data to reproduce the customer issues
    
