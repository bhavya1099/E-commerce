import { useState } from "react";
import "../App.css";
import { useSelector } from "react-redux";

function loadScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://checkout.razorpay.com/v1/checkout.js`;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const openRazorpayCheckout = async () => {
  await loadScript();
  const resp = await fetch(`http://localhost:3001/checkout`, {
    method: "POST",
  });
  //checkout your id and get set go.
  const data = await resp.json();
  const { currency, id, amount } = data.message;
  const options = {
    key: "rzp_test_2e36vLJo3547Ej", // Enter the public key generated from the Dashboard
    amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: currency,
    name: "sample product",
    order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      alert(response.razorpay_payment_id);
      alert(response.razorpay_order_id);
      alert(response.razorpay_signature);
    },
    prefill: {
      name: "Bhavya",
      email: "bhavya@gmail.com",
      contact: "9829364066",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
  };
  const rzpl = new Razorpay(options);
  rzpl.open();
  rzpl.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
  console.log(data);
};

function Checkout() {
  const [count, setCount] = useState(0);
  const totalPrice = useSelector((store) => {
    return store.productPrice;
  });
  return (
    <>
      <h1>Payment</h1>
      <a onClick={openRazorpayCheckout}>Pay for {totalPrice}$</a>
    </>
  );
}

export default Checkout;
