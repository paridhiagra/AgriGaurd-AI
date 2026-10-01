import bcrypt from 'bcryptjs';

const defaultHashedPassword = bcrypt.hashSync('password123', 10);

export const memoryStore = {
  users: [
    {
      id: 'usr_ramesh',
      name: 'Ramesh Patel',
      email: 'ramesh@farm.com',
      password: defaultHashedPassword,
      farmName: 'Green Valley Farm',
      createdAt: new Date().toISOString(),
    }
  ],
  farms: {
    'usr_ramesh': {
      id: 'farm_ramesh',
      userId: 'usr_ramesh',
      farmName: 'Green Valley Farm',
      location: 'Sector 4, Green Valley, Punjab',
      farmSize: '4.8 Hectares',
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative (Day 34)',
      soilType: 'Loamy Silt with High Water Retention',
      waterSource: 'Canal Link + Solar Borewell',
      irrigationMethod: 'Micro-Drip In-Line Emitter',
      tankLevel: 72,
      tankCapacity: 42000,
      sensorHealth: 98,
      lastCycleTime: "Y'day 6:30 PM",
      nextOptimalWindow: '6:00 PM – 8:00 PM',
      zoneName: 'Zone 1 • North Sector',
      sensorStation: 'Zone 1: Sensor Station Alpha (15cm & 30cm Depth)',
      updatedAt: new Date().toISOString()
    }
  },
  recommendations: [
    {
      id: 'rec_1',
      userId: 'usr_ramesh',
      timestamp: new Date().toISOString(),
      displayDate: 'Today, 6:00 AM',
      soilMoisture: 18,
      temperature: 31,
      humidity: 48,
      rainProbability: 20,
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative / Tillering',
      decision: 'IRRIGATION_RECOMMENDED',
      reason: 'Soil moisture is low (18%) and rainfall probability is currently low (20%). Delaying risks crop stress during critical tillering.',
      recommendedAction: 'Irrigate 35mm tonight between 6:00 PM – 8:00 PM to minimize midday evaporative loss.',
      keyFactors: [
        'Soil Moisture: 18% (Critical threshold < 22%)',
        'Rain Probability: 20% (Low next 48h)',
        'Ambient Temp: 31°C (Warm daytime)',
        'Evaporative Demand: 4.8 mm/day ET₀'
      ],
      farmerAction: 'Scheduled for 6:30 PM',
      status: 'Pending',
      waterAmount: '35mm (approx 14,000L)'
    },
    {
      id: 'rec_2',
      userId: 'usr_ramesh',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      displayDate: 'Yesterday, Sep 26',
      soilMoisture: 36,
      temperature: 29,
      humidity: 55,
      rainProbability: 15,
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative / Tillering',
      decision: 'NO_IRRIGATION_NEEDED',
      reason: 'Residual soil moisture is well-balanced from previous drip cycle. Field capacity is healthy and transpiration rate is normal.',
      recommendedAction: 'Zero water replenishment required today. Maintain normal sensor telemetry.',
      keyFactors: [
        'Soil Moisture: 36% (Optimal range 25-45%)',
        'Rain Probability: 15%',
        'Ambient Temp: 29°C'
      ],
      farmerAction: 'Adhered • Zero water used',
      status: 'Conserved',
      waterSaved: '3,000 L'
    },
    {
      id: 'rec_3',
      userId: 'usr_ramesh',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      displayDate: 'Sep 24, 7:15 AM',
      soilMoisture: 21,
      temperature: 27,
      humidity: 82,
      rainProbability: 85,
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative / Tillering',
      decision: 'WAIT_RAIN_EXPECTED',
      reason: 'Thunderstorm incoming within 8 hours. High rain probability (85%) provides sufficient natural replenishment. Irrigating risks root waterlogging.',
      recommendedAction: 'Keep pump valves locked. Rely on radar rainfall event (32mm received).',
      keyFactors: [
        'Rain Probability: 85% (Thunderstorm imminent)',
        'Soil Moisture: 21%',
        'Ambient Temp: 27°C'
      ],
      farmerAction: 'Deferred • Saved 18,000L',
      status: '18,000 L Saved',
      waterSaved: '18,000 L'
    },
    {
      id: 'rec_4',
      userId: 'usr_ramesh',
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
      displayDate: 'Sep 21, 5:30 AM',
      soilMoisture: 16,
      temperature: 33,
      humidity: 42,
      rainProbability: 5,
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative / Tillering',
      decision: 'IRRIGATION_RECOMMENDED',
      reason: 'Dry spell during crown root initiation. High ambient temperature (33°C) and low humidity demand deep penetration cycle.',
      recommendedAction: 'Irrigate 40mm via drip lines during early morning or dusk.',
      keyFactors: [
        'Soil Moisture: 16% (Critical)',
        'Rain Probability: 5%',
        'Ambient Temp: 33°C'
      ],
      farmerAction: 'Irrigated 40mm • Drip cycle completed',
      status: 'Completed',
      waterAmount: '40mm (16,000L)'
    }
  ]
};
