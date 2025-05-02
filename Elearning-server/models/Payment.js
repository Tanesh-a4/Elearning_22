import mongoose from "mongoose";

const schema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Add indexes
schema.index({ razorpay_order_id: 1 }, { unique: true });      // Ensure order IDs are unique
schema.index({ razorpay_payment_id: 1 }, { unique: true });    // Ensure payment IDs are unique
schema.index({ createdAt: -1 });                               // For faster sorting by latest payments

export const Payment = mongoose.model("Payment", schema);
