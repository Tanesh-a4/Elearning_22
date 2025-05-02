import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
schema.index({ user: 1, course: 1 }, { unique: true });   // One progress document per user per course
schema.index({ course: 1 });                              // Faster lookup by course
schema.index({ user: 1 });                                // Faster lookup by user

export const Progress = mongoose.model("Progress", schema);
