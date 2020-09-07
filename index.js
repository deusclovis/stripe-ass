const express = require("express");
const app = express();
const { resolve } = require("path");
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_7vynPHGLiribouGdPYQP7vqb");

app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

  console.log(items);

  return 100;
};

app.post("/", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sgd"
  });
  console.log(paymentIntent);
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sgd"
  });
  console.log(paymentIntent);
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(3000, () => console.log('running on 3000!'));
