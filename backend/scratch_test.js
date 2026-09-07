const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_TZ7CUOk3rP4sHb",
  key_secret: "l59R2VX50XZ5qAv0AhbuQaBC",
});

razorpayInstance.orders.create({
  amount: 100,
  currency: "INR",
  receipt: `receipt_order_${Date.now()}`,
}).then(res => {
  console.log("SUCCESS:", res.id);
}).catch(err => {
  console.error("ERROR:", err);
});
