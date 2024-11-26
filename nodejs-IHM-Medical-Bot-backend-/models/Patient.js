// models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  description: { type: String, required: true},
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
