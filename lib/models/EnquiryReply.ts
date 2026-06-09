import mongoose from "mongoose";

// Matches the real `enquiry_replies` collection shape.
const EnquiryReplySchema = new mongoose.Schema(
  {
    reply_id: String,
    enquiry_id: String,
    sender_id: String,
    reply_text: String,
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: "enquiry_replies",
    strict: false,
  }
);

export const EnquiryReply =
  mongoose.models.EnquiryReply ||
  mongoose.model("EnquiryReply", EnquiryReplySchema);
