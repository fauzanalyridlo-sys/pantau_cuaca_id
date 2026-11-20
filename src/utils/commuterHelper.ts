import { HourlyWeather, CommuteAdvice } from "../types/weather";

export function getCommuteAdvice(hourly: HourlyWeather[]): CommuteAdvice {
  const rainySlots = hourly.filter((item) => !item.isNow && item.rainProb >= 50);

  if (rainySlots.length === 0) {
    const nextSlot = hourly.find((item) => !item.isNow) ?? hourly[0];
    const nextTime = nextSlot ? nextSlot.time : "beberapa jam ke depan";
    return {
      headline: "Jalur relatif aman berkendara",
      description: `Peluang hujan rendah hingga ${nextTime}. Ada 60 menit waktu aman di jalur.`,
      safeMinutes: 60,
      riskProgress: 0.28,
    };
  }

  const firstRain = rainySlots[0];
  return {
    headline: `Berangkat sebelum ${firstRain.time}`,
    description: `Potensi hujan (${firstRain.rainProb}%) mulai pukul ${firstRain.time}. Ada 30 menit waktu aman.`,
    safeMinutes: 30,
    riskProgress: Math.min(0.95, Math.max(0.65, firstRain.rainProb / 100)),
  };
}
