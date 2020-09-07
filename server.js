// base from integration builder https://stripe.com/docs/payments/integration-builder with modifications

const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")("sk_test_7vynPHGLiribouGdPYQP7vqb");

app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = items => {

  let total_price = items.map((item_array) => { 
    return item_array.price;
  }).reduce((item, acc) => {
    return item + acc;
  });
  console.log('total_price: ' + total_price);
  
  return total_price;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log('items: ')
  console.log(items);
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
