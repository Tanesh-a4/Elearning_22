import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  amount: {
    type: Number,
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
paymentHistorySchema.index({ userId: 1 });                    // Faster fetching payment history for a user
paymentHistorySchema.index({ courseId: 1 });                  // Faster lookup of payments for a course
paymentHistorySchema.index({ paymentId: 1 }, { unique: true }); // Ensure no duplicate payment records
paymentHistorySchema.index({ status: 1 });                    // Filter by status quickly
paymentHistorySchema.index({ createdAt: -1 });                // Sort by latest payments easily

export const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
