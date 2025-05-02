import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
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
schema.index({ course: 1 });           // Index to quickly find lectures by course
schema.index({ title: 1 });            // Index to search lectures by title

export const Lecture = mongoose.model('Lecture', schema);
