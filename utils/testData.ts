export const testData = {
  validPayment: {
    // Stripe test card
    cardNumber: "4242424242424242",
    expiryMMYY: "12/34",
    cvc: "123",
    countryValue: "US",
    zip: "12345",
  },
    declinedPayment: {
    // Stripe test card
    cardNumber: "4000000000000002",
    expiryMMYY: "12/34",
    cvc: "123",
    countryValue: "US",
    zip: "12345",
  },
};
