const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  country: { type: String, default: null },
  photoURL: { type: String },
  address1: { type: String, default: null },
  address2: { type: String, default: null },
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("User", UserSchema);
