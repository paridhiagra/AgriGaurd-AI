/**
 * AgriGuard AI Centralized Frontend API Service
 */

function getHeaders() {
  const token = localStorage.getItem('agriguard_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchFarmDetails() {
  try {
    const res = await fetch('/api/farm', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch farm data');
    const data = await res.json();
    return data.farm;
  } catch (err) {
    console.warn('API error, returning fallback farm data:', err.message);
    return {
      farmName: 'Green Valley Farm',
      location: 'Sector 4, Green Valley, Punjab',
      farmSize: '4.8 Hectares',
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative (Day 34)',
      soilType: 'Loamy Silt with High Water Retention',
      waterSource: 'Canal Link + Solar Borewell',
      irrigationMethod: 'Micro-Drip In-Line Emitter',
      tankLevel: 72,
      sensorHealth: 98,
      lastCycleTime: "Y'day 6:30 PM",
      nextOptimalWindow: '6:00 PM – 8:00 PM',
      zoneName: 'Zone 1 • North Sector'
    };
  }
}

export async function updateFarmDetails(payload) {
  const res = await fetch('/api/farm', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update farm data');
  return await res.json();
}

export async function fetchWeather() {
  try {
    const res = await fetch('/api/weather');
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    return data.weather;
  } catch (err) {
    console.warn('Weather API error, using fallback:', err.message);
    return null;
  }
}

export async function requestAIRecommendation(payload) {
  try {
    const res = await fetch('/api/gemini/recommendation', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('AI recommendation request failed');
    return await res.json();
  } catch (err) {
    console.warn('Recommendation API error, computing local fallback:', err.message);
    const m = payload.soilMoisture ?? 18;
    const r = payload.rainProbability ?? 20;
    if (r >= 55 || (m < 25 && r >= 40)) {
      return {
        decision: 'WAIT_RAIN_EXPECTED',
        reason: `Meteorological radar shows ${r}% chance of rainfall. Irrigating now risks root waterlogging.`,
        recommendedAction: 'Keep pump valves locked. Rely on upcoming rainfall event.',
        keyFactors: [`Rain Probability: ${r}%`, `Soil Moisture: ${m}%`],
        confidence: 91,
        isFallback: true
      };
    } else if (m < 25) {
      return {
        decision: 'IRRIGATION_RECOMMENDED',
        reason: `Your soil moisture is low (${m}%) and rainfall probability is currently low (${r}%). Delaying risks crop stress.`,
        recommendedAction: 'Irrigate 35mm tonight between 6:00 PM – 8:00 PM to minimize midday evaporative loss.',
        keyFactors: [`Soil Moisture: ${m}% (< 22% threshold)`, `Rain Probability: ${r}%`],
        confidence: 96,
        isFallback: true
      };
    } else {
      return {
        decision: 'NO_IRRIGATION_NEEDED',
        reason: `Field capacity is well-balanced at ${m}%. Evaporation rate is nominal.`,
        recommendedAction: 'Zero water replenishment required today.',
        keyFactors: [`Soil Moisture: ${m}% (Optimal band 25-45%)`, `Rain Probability: ${r}%`],
        confidence: 95,
        isFallback: true
      };
    }
  }
}

export async function sendChatMessage(message, farmContext) {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, farmContext })
    });
    if (!res.ok) throw new Error('Chat API failed');
    return await res.json();
  } catch (err) {
    console.warn('Chat error, using fallback response:', err.message);
    return {
      reply: 'AgriGuard AI recommends irrigating tonight between 6:00 PM – 8:00 PM as soil moisture is low (18%) and rain probability is only 20%.',
      source: 'fallback'
    };
  }
}

export async function fetchHistory(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.crop && filters.crop !== 'all') params.append('crop', filters.crop);

  const query = params.toString() ? `?${params.toString()}` : '';
  let res = await fetch(`/api/recommendation/history${query}`, {
    headers: getHeaders()
  });

  if (!res.ok && res.status === 404) {
    res = await fetch(`/api/recommendations/history${query}`, {
      headers: getHeaders()
    });
  }

  if (!res.ok) {
    throw new Error(`History API responded with HTTP status ${res.status}`);
  }

  const data = await res.json();
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.history)
    ? data.history
    : [];

  return {
    history: list,
    stats: data?.stats || null
  };
}

export async function saveHistoryRecord(record) {
  try {
    let res = await fetch('/api/recommendation/history', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(record)
    });
    if (!res.ok && res.status === 404) {
      res = await fetch('/api/recommendations/history', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(record)
      });
    }
    if (!res.ok) throw new Error('Failed to save record');
    return await res.json();
  } catch (err) {
    console.warn('Failed to persist record:', err.message);
    return null;
  }
}
