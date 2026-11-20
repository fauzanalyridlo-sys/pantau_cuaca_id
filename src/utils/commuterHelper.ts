import { HourlyWeather, CommuteAdvice } from "../types/weather";

function getRainLabel(item: HourlyWeather): string {
  const intensity = item.rainIntensity;

  if (intensity === "heavy") return "lebat";
  if (intensity === "moderate") return "sedang";
  if (intensity === "light") return "ringan";

  const amount = item.rainMm ?? 0;
  if (amount >= 7.5) return "lebat";
  if (amount >= 2.5) return "sedang";
  if (amount >= 0.1) return "ringan";
  return "tidak signifikan";
}

export function getCommuteAdvice(hourly: HourlyWeather[]): CommuteAdvice {
  if (hourly.length === 0) {
    return {
      headline: "Prakiraan belum tersedia",
      description: "Belum ada data cuaca untuk memberikan saran perjalanan.",
      riskProgress: 0,
      riskLevel: "unknown",
    };
  }

  const upcomingSlots = hourly.filter((item) => !item.isNow);
  const nextSixHours = upcomingSlots.slice(0, 6);

  const maxRisk = nextSixHours.reduce((max, item) => {
    const amountRisk = Math.min((item.rainMm ?? 0) * 10, 100);
    return Math.max(max, item.rainProb, amountRisk);
  }, 0);

  const riskLevel: CommuteAdvice["riskLevel"] =
    maxRisk >= 70 ? "high" : maxRisk >= 35 ? "moderate" : "low";

  const firstRain = upcomingSlots.find(
    (item) =>
      item.rainProb >= 50 ||
      (item.rainProb >= 30 && (item.rainMm ?? 0) >= 2.5)
  );

  if (firstRain) {
    const amount = (firstRain.rainMm ?? 0).toFixed(1);
    const intensity = getRainLabel(firstRain);

    return {
      headline: `Waspada hujan pukul ${firstRain.time}`,
      description: `Peluang hujan ${firstRain.rainProb}% dengan estimasi curah hujan ${amount} mm/jam (${intensity}) pada pukul ${firstRain.time}. Siapkan jas hujan atau sesuaikan waktu perjalanan.`,
      riskProgress: maxRisk / 100,
      riskLevel,
    };
  }

  return {
    headline: "Belum ada indikasi hujan tinggi",
    description:
      "Dalam prakiraan 24 jam ke depan, belum ditemukan peluang hujan 50% atau lebih maupun estimasi hujan sedang hingga lebat. Tetap pantau perubahan cuaca.",
    riskProgress: maxRisk / 100,
    riskLevel,
  };
}
