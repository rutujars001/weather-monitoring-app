// backend/util/blynkToMongo.js
const axios = require('axios');
const BLYNK_TOKEN = 'SSc8S0l-lFVEvh5gcAniKYabMZcl1SJ0';

async function fetchBlynkBulk() {
  const url = `https://blynk.cloud/external/api/getAll?token=${BLYNK_TOKEN}`;
  try {
    const resp = await axios.get(url);
    return resp.data; // Should return all pins as V0-V4 keys
  } catch (err) {
    console.error("❌ Error fetching all pins:", err.response?.data || err.message);
    return null;
  }
}

async function fetchBlynkAndPost() {
  try {
    const data = await fetchBlynkBulk();
    if (!data) return;

    // Use exact keys from Blynk bulk API response:
    const temperature = Number(data.V1);
    const humidity = Number(data.V2);
    const rainStatus = data.V3;
    const rainLevel = Number(data.V0);
    const rainPercent = Number(data.V4);

    console.log("Fetched from Blynk (bulk):", {
      temperature,
      humidity,
      rainStatus,
      rainLevel,
      rainPercent
    });

    if (isNaN(temperature) || isNaN(humidity)) {
      console.error("❌ Skipping POST: temperature or humidity is missing from Blynk");
      return;
    }

    let detected = false, intensity = "none";
    if (rainStatus && String(rainStatus).toLowerCase().includes("rain")) detected = true;
    if (!isNaN(rainLevel) && rainLevel > 20) detected = true;
    if (!isNaN(rainPercent) && detected) {
      if (rainPercent > 70) intensity = "heavy";
      else if (rainPercent > 40) intensity = "moderate";
      else intensity = "light";
    }

    // TODO: Replace "Korti" below with correct location ObjectId if needed
    const payload = {
      location: "Korti",
      deviceId: "ESP32_KORTI_001",
      readings: {
        temperature: { value: temperature, unit: "C" },
        humidity: { value: humidity, unit: "%" },
        rainfall: { detected, intensity }
      },
      timestamp: new Date().toISOString(),
      dataQuality: "good"
    };

    console.log("Posting payload:", JSON.stringify(payload, null, 2));

    const BACKEND_API_URL = "http://localhost:5000/api/sensors";
    const resp = await axios.post(BACKEND_API_URL, payload);
    console.log("✅ Data posted for Korti. DB response:", resp.data);
  } catch (err) {
    console.error("❌ Blynk fetch/POST error (network/backend):", err.message);
  }
}

setInterval(fetchBlynkAndPost, 5 * 60 * 1000);
fetchBlynkAndPost();
