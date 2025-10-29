const axios = require('axios');
const BLYNK_TOKEN = 'SSc8S0l-lFVEvh5gcAniKYabMZcl1SJ0';
const BACKEND_API_URL = "http://localhost:5000/api/sensors";
const KORTI_LOCATION_ID = "69018b88074984219be7378a"; // Use your real ObjectId here!
const DEVICE_ID = "ESP32_KORTI_001";

// Bulk fetch all pins from Blynk Cloud
async function fetchBlynkBulk() {
  const url = `https://blynk.cloud/external/api/getAll?token=${BLYNK_TOKEN}`;
  try {
    const resp = await axios.get(url);
    return resp.data; // returns { v0, v1, v2, v3, v4 }
  } catch (err) {
    console.error("❌ Error fetching all pins:", err.response?.data || err.message);
    return null;
  }
}

// Post sensor data to backend (with location ObjectId)
async function fetchBlynkAndPost() {
  try {
    const data = await fetchBlynkBulk();
    if (!data) return;

    // Use the correct lower-case keys from Blynk response!
    const temperature = Number(data.v1);
    const humidity = Number(data.v2);
    const rainStatus = data.v3;
    const rainLevel = Number(data.v0);
    const rainPercent = Number(data.v4);

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

    const payload = {
      location: KORTI_LOCATION_ID, // <-- Real ObjectId, not name!
      deviceId: DEVICE_ID,
      readings: {
        temperature: { value: temperature, unit: "C" },
        humidity: { value: humidity, unit: "%" },
        rainfall: { detected, intensity }
      },
      timestamp: new Date().toISOString(),
      dataQuality: "good"
    };

    console.log("Posting payload:", JSON.stringify(payload, null, 2));

    const resp = await axios.post(BACKEND_API_URL, payload);
    console.log("✅ Data posted for Korti. DB response:", resp.data);
  } catch (err) {
    console.error("❌ Blynk fetch/POST error (network/backend):", err.message);
  }
}

// Run every 5 minutes & once immediately
setInterval(fetchBlynkAndPost, 5 * 60 * 1000);
fetchBlynkAndPost();
