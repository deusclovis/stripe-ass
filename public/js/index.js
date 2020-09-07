let stripe = Stripe("pk_test_JVNQf6RPR6iMGRA26tXzVEwx");
const product = { id: "tesla_cybertruck", price: 100 };

const purchase = {
  items: [
    product
  ]
};

const increase = () => {

  console.log("increase");
  purchase.items.push(product);
  console.log(purchase);

};

const decrease = () => {

  if (purchase.items.length == 1) {
    console.log("You have to purchase at least 1 cybertruck"); 
  } else {
    console.log("decrease");
    purchase.items.pop();
    console.log(purchase);

  }
};

const printPurchase = () => {
  console.log(purchase);
};

fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(purchase)
})
  .then(function(result) {
    console.log(result);
    return result.json();
  })
  .then(function(data) {
    let elements = stripe.elements();

    let style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
      }
    };

    let card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");

    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.getElementById("submit").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });

    let form = document.getElementById("payment-form");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      // Complete payment when the submit button is clicked
      payWithCard(stripe, card, data.clientSecret);
    });
  });

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
let payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        showError(result.error.message);
      } else {
        console.log('paymentIntent: ' + result.paymentIntent.id);
        orderComplete(result.paymentIntent.id);
      }
    });
};

/* ------- UI helpers ------- */
// Shows a success message when the payment is complete
let orderComplete = function(paymentIntentId) {
  loading(false);
  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
  document.querySelector(".result-message").classList.remove("hidden");
  document.getElementById("submit").disabled = true;
  
};

// Show the customer the error from Stripe if their card fails to charge
let showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
let loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.getElementById("submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.getElementById("submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
