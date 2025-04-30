const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  itemId: String,
  itemName: String,
  quantity: Number,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
