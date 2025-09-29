const express = require('express');
const mongoose = require('mongoose');
const WeatherData = require('./models/weatherData'); 

const app = express();
const PORT = 3001;

app.use(express.json());

// --- Corrected Line ---
const dbURI = 'mongodb://localhost:27017/weatherAppDB'; // Use port 27017

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => console.error('❌ Could not connect to MongoDB:', err));

app.post('/api/weather', async (req, res) => {
  try {
    const { location, temperature, humidity } = req.body;
    const newReading = new WeatherData({
      location,
      temperature,
      humidity
    });
    const savedReading = await newReading.save();
    res.status(201).json(savedReading);
  } catch (error) {
    console.error("POST /api/weather ERROR:", error); 
    res.status(500).json({ message: 'Error saving weather data', error: error });
  }
});

app.get('/api/weather/latest', async (req, res) => {
  try {
    const latestKorti = await WeatherData.findOne({ location: 'Korti' }).sort({ createdAt: -1 });
    const latestPandharpur = await WeatherData.findOne({ location: 'Pandharpur' }).sort({ createdAt: -1 });
    res.status(200).json({
      korti: latestKorti,
      pandharpur: latestPandharpur
    });
  } catch (error) {
    console.error("GET /api/weather/latest ERROR:", error); 
    res.status(500).json({ message: 'Error fetching latest weather data', error: error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});