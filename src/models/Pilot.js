const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PilotSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  lastSeen: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
});

const Pilot = mongoose.model("pilot", PilotSchema);

module.exports = Pilot;
