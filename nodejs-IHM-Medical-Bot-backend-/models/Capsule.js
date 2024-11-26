// models/Capsule.js
const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
  content: { type: String },
  id: { type: String, required: true, unique: true }, // Ensure the id is unique
  time: { type: String},
  date: { type: String },
  patient: { type: String},
});

// You can remove the _id generation if you don't want to use it, but it's good practice to keep it.
CapsuleSchema.set('toJSON', { virtuals: true }); // Include virtuals in JSON output
CapsuleSchema.set('toObject', { virtuals: true }); // Include virtuals in Object output

const Capsule = mongoose.model('Capsule', CapsuleSchema);

module.exports = Capsule;
