import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  visibleTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to set visibleTo field to include both sender and receiver by default
messageSchema.pre('save', function(next) {
  if (this.isNew && (!this.visibleTo || this.visibleTo.length === 0)) {
    this.visibleTo = [this.sender, this.receiver];
  }
  next();
});

export const Message = mongoose.model('Message', messageSchema);