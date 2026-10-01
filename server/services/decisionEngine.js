/**
 * Deterministic Decision Engine (AgriGuard Prototype Fallback)
 * 
 * Prototype Hackathon Rules:
 * - IF soilMoisture < 25 AND rainProbability < 40 -> IRRIGATION_RECOMMENDED
 * - IF soilMoisture < 25 AND rainProbability >= 40 -> WAIT_RAIN_EXPECTED
 * - IF soilMoisture >= 25                          -> NO_IRRIGATION_NEEDED
 */

export function calculateDeterministicRecommendation({
  soilMoisture = 18,
  temperature = 31,
  humidity = 48,
  rainProbability = 20,
  waterLevel = 72,
  crop = 'Wheat (PBW 550)',
  growthStage = 'Vegetative / Tillering'
}) {
  const moistureNum = Number(soilMoisture);
  const rainNum = Number(rainProbability);
  const tempNum = Number(temperature);

  let decision = 'IRRIGATION_RECOMMENDED';
  let reason = '';
  let recommendedAction = '';
  let keyFactors = [];
  let confidence = 92;

  // Exact user requested rules:
  // IF soilMoisture < 25 AND rainProbability < 40 -> IRRIGATION_RECOMMENDED
  // IF soilMoisture < 25 AND rainProbability >= 40 -> WAIT_RAIN_EXPECTED
  // IF soilMoisture >= 25                          -> NO_IRRIGATION_NEEDED
  if (moistureNum < 25 && rainNum < 40) {
    decision = 'IRRIGATION_RECOMMENDED';
    confidence = 92;
    reason = `Your soil moisture is low (${moistureNum}%) while rainfall probability is currently low (${rainNum}%). Delaying risks crop stress for ${crop} during the ${growthStage} stage. Irrigation is recommended.`;
    recommendedAction = `Irrigate 35mm tonight between 6:00 PM – 8:00 PM to minimize midday evaporative loss.`;
    keyFactors = [
      `Soil Moisture: ${moistureNum}% (Below 25% threshold)`,
      `Rain Probability: ${rainNum}% (Low expected rain)`,
      `Temperature: ${tempNum}°C (Warm conditions)`,
      `Crop Stage: ${growthStage}`
    ];
  } else if (moistureNum < 25 && rainNum >= 40) {
    decision = 'WAIT_RAIN_EXPECTED';
    confidence = 88;
    reason = `Soil moisture is low (${moistureNum}%), but rainfall probability is elevated (${rainNum}%). Expected rain can naturally recharge root zones and prevent waterlogging.`;
    recommendedAction = 'Keep pump valves locked. Monitor rain gauge over the next 24 hours before scheduling.';
    keyFactors = [
      `Rain Probability: ${rainNum}% (Rain expected)`,
      `Soil Moisture: ${moistureNum}%`,
      `Temperature: ${tempNum}°C`,
      `Water Tank Storage: ${waterLevel}%`
    ];
  } else {
    decision = 'NO_IRRIGATION_NEEDED';
    confidence = 95;
    reason = `Soil moisture is healthy at ${moistureNum}% (above 25% threshold) for ${crop}. Soil moisture is sufficient and no irrigation is needed today.`;
    recommendedAction = 'Maintain daily sensor monitoring. Zero water replenishment required today.';
    keyFactors = [
      `Soil Moisture: ${moistureNum}% (Optimal >= 25%)`,
      `Rain Probability: ${rainNum}%`,
      `Temperature: ${tempNum}°C`,
      `Tank Storage: ${waterLevel}%`
    ];
  }

  return {
    decision,
    reason,
    recommendedAction,
    keyFactors,
    confidence,
    isFallback: true,
    engine: 'AgriGuard Agro-Deterministic Matrix (v1.2)'
  };
}
