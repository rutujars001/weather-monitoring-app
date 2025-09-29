const mongoose = require('mongoose');
const { Schema } = mongoose;

const weatherDataSchema = new Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required:true },
  humidity: { type: Number, required: true },
}, { timestamps: true });

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

// --- This is the crucial line that was likely missing ---
module.exports = WeatherData;