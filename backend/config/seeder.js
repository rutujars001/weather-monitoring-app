const mongoose = require('mongoose');
const Location = require('../models/Location');
const SensorData = require('../models/SensorData');
const Alert = require('../models/Alert');
require('dotenv').config();

const locations = [
  {
    name: "Korti",
    coordinates: {
      latitude: 17.686944,
      longitude: 75.243333
    },
    description: "SKN Sinhgad College of Engineering Weather Station",
    deviceId: "ESP32_KORTI_001",
    isActive: true
  },
  {
    name: "Pandharpur",
    coordinates: {
      latitude: 17.669444,
      longitude: 75.264444
    },
    description: "Pandharpur City Weather Station",
    deviceId: "ESP32_PANDHARPUR_001",
    isActive: true
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring');
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Location.deleteMany({});
    await SensorData.deleteMany({});
    await Alert.deleteMany({});
    
    console.log('🗑️  Cleared existing data');

    // Insert locations
    const insertedLocations = await Location.insertMany(locations);
    console.log('📍 Locations seeded:', insertedLocations.length);

    // Create sample sensor data for the last 24 hours
    const now = new Date();
    const sampleData = [];

    for (let location of insertedLocations) {
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Every hour
        
        sampleData.push({
          location: location._id,
          deviceId: location.deviceId,
          readings: {
            temperature: {
              value: location.name === 'Korti' ? 
                Math.round(28 + Math.random() * 8) : // 28-36°C for Korti
                Math.round(25 + Math.random() * 6),  // 25-31°C for Pandharpur
              unit: 'C'
            },
            humidity: {
              value: Math.round(60 + Math.random() * 25), // 60-85%
              unit: '%'
            },
            rainfall: {
              detected: Math.random() > 0.7, // 30% chance of rain
              intensity: ['none', 'light', 'moderate'][Math.floor(Math.random() * 3)]
            },
            lightIntensity: {
              value: timestamp.getHours() >= 6 && timestamp.getHours() <= 18 ?
                Math.round(50 + Math.random() * 300) : // Daylight: 50-350 lux
                Math.round(Math.random() * 50),        // Night: 0-50 lux
              unit: 'lux'
            }
          },
          timestamp,
          dataQuality: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)]
        });
      }
    }

    const insertedSensorData = await SensorData.insertMany(sampleData);
    console.log('📊 Sensor data seeded:', insertedSensorData.length);

    // Create sample alerts
    const sampleAlerts = [
      {
        location: insertedLocations[0]._id, // Korti
        type: 'rainfall_prediction',
        severity: 'medium',
        message: 'Rain expected in 15 minutes based on humidity and temperature patterns',
        prediction: {
          rainProbability: 85,
          timeWindow: 15,
          confidence: 'high'
        },
        isActive: true
      },
      {
        location: insertedLocations[1]._id, // Pandharpur
        type: 'rainfall_prediction',
        severity: 'high',
        message: 'Heavy rainfall ongoing - Duration estimated 2 hours',
        prediction: {
          rainProbability: 95,
          timeWindow: 120,
          confidence: 'high'
        },
        isActive: true
      }
    ];

    const insertedAlerts = await Alert.insertMany(sampleAlerts);
    console.log('🚨 Alerts seeded:', insertedAlerts.length);

    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

// Run seeder if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedDatabase };
