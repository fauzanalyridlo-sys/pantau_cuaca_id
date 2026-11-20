import { HourlyWeather } from "../types/weather";

export type VehicleType = "motor" | "mobil";

export type TravelRisk = "low" | "moderate" | "high" | "unknown";

export interface CommuterRecommendation {
  departureTime: string;
  departureIndex: number;
  vehicle: VehicleType;
  riskScore: number;
  riskLevel: TravelRisk;
  rainProbability: number;
  maxRainMm: number;
  rainIntensity: "none" | "light" | "moderate" | "heavy";
  durationHours: number;
  title: string;
  description: string;
  isDataComplete: boolean;
}

const DEFAULT_DURATION = 2;

function getIntensity(
  item: HourlyWeather
): "none" | "light" | "moderate" | "heavy" {
  const amount = item.rainMm ?? 0;

  if (item.rainIntensity === "heavy" || amount >= 7.5) {
    return "heavy";
  }

  if (item.rainIntensity === "moderate" || amount >= 2.5) {
    return "moderate";
  }

  if (item.rainIntensity === "light" || amount >= 0.1) {
    return "light";
  }

  return "none";
}

function getRiskLevel(score: number): TravelRisk {
  if (score >= 70) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

function analyzeWindow(
  hourly: HourlyWeather[],
  departureIndex: number,
  vehicle: VehicleType,
  durationHours: number
): CommuterRecommendation {
  const departure = hourly[departureIndex];

  const slots = hourly.slice(
    departureIndex,
    departureIndex + durationHours
  );

  const isDataComplete = slots.length === durationHours;

  const rainProbability = Math.max(
    ...slots.map((item) => item.rainProb)
  );

  const maxRainMm = Math.max(
    ...slots.map((item) => item.rainMm ?? 0)
  );

  const rainIntensity = slots.reduce<
    CommuterRecommendation["rainIntensity"]
  >((highest, item) => {
    const current = getIntensity(item);
    const rank = { none: 0, light: 1, moderate: 2, heavy: 3 };

    return rank[current] > rank[highest] ? current : highest;
  }, "none");

  const amountRisk = Math.min(maxRainMm * 10, 100);
  const riskScore = isDataComplete
    ? Math.round(Math.max(rainProbability, amountRisk))
    : 0;

  const riskLevel: TravelRisk = isDataComplete
    ? getRiskLevel(riskScore)
    : "unknown";

  const vehicleLabel = vehicle === "motor" ? "sepeda motor" : "mobil";

  let title = "Data perjalanan belum lengkap";
  let description =
    "Prakiraan belum mencakup seluruh durasi perjalanan. Periksa kembali nanti.";

  if (isDataComplete) {
    if (riskLevel === "high") {
      title = "Risiko hujan tinggi";
      description =
        `Perjalanan ${vehicleLabel} berpotensi menghadapi hujan dengan ` +
        `peluang hingga ${rainProbability}% dan estimasi intensitas ${rainIntensity}. ` +
        "Pertimbangkan menunda perjalanan atau mencari waktu lain.";
    } else if (riskLevel === "moderate") {
      title = "Waspada selama perjalanan";
      description =
        `Peluang hujan mencapai ${rainProbability}% dengan estimasi ` +
        `${maxRainMm.toFixed(1)} mm/jam. Siapkan perlengkapan hujan dan ` +
        "sesuaikan kecepatan berkendara.";
    } else {
      title = "Kondisi relatif lebih mendukung";
      description =
        `Peluang hujan maksimum ${rainProbability}% selama perkiraan ` +
        `${durationHours} jam perjalanan. Tetap pantau perubahan cuaca.`;
    }
  }

  return {
    departureTime: departure.time,
    departureIndex,
    vehicle,
    riskScore,
    riskLevel,
    rainProbability,
    maxRainMm,
    rainIntensity,
    durationHours,
    title,
    description,
    isDataComplete,
  };
}

export function getAutomaticRecommendations(
  hourly: HourlyWeather[],
  vehicle: VehicleType,
  durationHours: number = DEFAULT_DURATION
): CommuterRecommendation[] {
  const candidates = hourly
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.isNow)
    .filter(
      ({ index }) =>
        hourly.length - index >= durationHours
    )
    .map(({ index }) =>
      analyzeWindow(hourly, index, vehicle, durationHours)
    );

  return candidates
    .filter((item) => item.isDataComplete)
    .sort((a, b) => a.riskScore - b.riskScore)
    .slice(0, 3);
}

export function analyzeManualDeparture(
  hourly: HourlyWeather[],
  departureIndex: number,
  vehicle: VehicleType,
  durationHours: number = DEFAULT_DURATION
): CommuterRecommendation | null {
  if (
    departureIndex < 0 ||
    departureIndex >= hourly.length ||
    hourly[departureIndex].isNow
  ) {
    return null;
  }

  return analyzeWindow(
    hourly,
    departureIndex,
    vehicle,
    durationHours
  );
}
