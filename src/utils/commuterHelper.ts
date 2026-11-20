import { HourlyWeather, CommuteAdvice } from "../types/weather";

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

  const maxRisk = nextSixHours.reduce(
    (max, item) => Math.max(max, item.rainProb),
    0
  );

  const firstRain = upcomingSlots.find((item) => item.rainProb >= 50);

  const riskLevel: CommuteAdvice["riskLevel"] =
    maxRisk >= 60 ? "high" : maxRisk >= 30 ? "moderate" : "low";

  if (firstRain) {
    return {
      headline: `Waspada hujan pukul ${firstRain.time}`,
      description: `Peluang hujan mencapai ${firstRain.rainProb}% pada pukul ${firstRain.time}. Pertimbangkan membawa jas hujan atau menyesuaikan waktu perjalanan.`,
      riskProgress: maxRisk / 100,
      riskLevel,
    };
  }

  return {
    headline: "Belum ada indikasi hujan tinggi",
    description: `Dalam prakiraan 24 jam ke depan, belum ditemukan peluang hujan 50% atau lebih. Tetap pantau perubahan cuaca.`,
    riskProgress: maxRisk / 100,
    riskLevel,
  };
}
