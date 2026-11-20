import { WeatherSummary, SafetyStatus } from "../types/weather";

export const FALLBACK_WEATHER: WeatherSummary = {
  locationName: "Lowokwaru, Malang",
  currentTempC: 29,
  feelsLikeC: 31,
  highC: 31,
  lowC: 23,
  condition: "Berawan",
  humidity: 76,
  windKmh: 8,
  hourly: [
    { time: "14:00", tempC: 29, condition: "Cerah", rainProb: 10, icon: "sunny", isNow: true },
    { time: "15:00", tempC: 28, condition: "Berawan", rainProb: 20, icon: "cloudy" },
    { time: "16:00", tempC: 27, condition: "Mendung", rainProb: 45, icon: "cloudy" },
    { time: "17:00", tempC: 25, condition: "Hujan", rainProb: 80, icon: "rainy" },
    { time: "18:00", tempC: 24, condition: "Hujan", rainProb: 90, icon: "rainy" },
  ],
};

export const FALLBACK_SAFETY: SafetyStatus = {
  isSafe: true,
  title: "Kondisi wilayah aman",
  subtitle: "Tidak ada peringatan gempa atau cuaca ekstrem di sekitar Malang.",
};
