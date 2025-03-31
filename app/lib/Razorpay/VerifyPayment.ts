"use server";
import crypto from "crypto";

export async function verifyPayment(razorpay_order_id : string, razorpay_payment_id : string, razorpay_signature : string) {
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign)
    .digest("hex");
  return expectedSign === razorpay_signature
    ? { success: true, message: "Payment verified" }
    : { success: false, message: "Invalid signature" };
}