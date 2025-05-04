import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

// Add indexes
schema.index({ title: 1 });           
schema.index({ category: 1 });        
schema.index({ price: 1 });           
schema.index({ owner: 1 });           

export const Courses = mongoose.models.Courses || mongoose.model("Courses", schema);;
