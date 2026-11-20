import { HourlyWeather, WeatherSummary, SafetyStatus } from "../types/weather";

interface OpenMeteoResponse {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
}

interface BmkgQuakeResponse {
  Infogempa?: {
    gempa?: {
      Tanggal?: string;
      Jam?: string;
      Magnitude?: string;
      Kedalaman?: string;
      Wilayah?: string;
      Potensi?: string;
    };
  };
}

function mapWeatherCode(code: number): {
  condition: string;
  icon: HourlyWeather["icon"];
} {
  if (code === 0) return { condition: "Cerah", icon: "sunny" };
  if (code === 1 || code === 2) return { condition: "Cerah Berawan", icon: "partly-cloudy" };
  if (code === 3) return { condition: "Berawan", icon: "cloudy" };
  if (code >= 51 && code <= 67) return { condition: "Hujan", icon: "rainy" };
  if (code >= 80 && code <= 99) return { condition: "Hujan Petir", icon: "rainy" };
  return { condition: "Berawan", icon: "cloudy" };
}

export async function fetchWeatherByCoords(
  locationName = "Lowokwaru, Malang",
  latitude = -7.9553,
  longitude = 112.6137
): Promise<WeatherSummary> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&hourly=temperature_2m,precipitation_probability,weather_code` +
    `&timezone=Asia%2FJakarta&forecast_days=1`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil data cuaca Open-Meteo");
  }

  const data: OpenMeteoResponse = await res.json();
  const current = data.current;
  const hourlyRaw = data.hourly;

  const currentMapped = mapWeatherCode(current?.weather_code ?? 2);
  const currentTempC = Math.round(current?.temperature_2m ?? 28);

  const nowHourStr = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentHourPrefix = nowHourStr.slice(0, 2);

  const slots: HourlyWeather[] = [];
  if (hourlyRaw?.time) {
    for (let i = 0; i < hourlyRaw.time.length; i++) {
      const isoTime = hourlyRaw.time[i]; // "2026-11-19T20:00"
      const hhmm = isoTime.split("T")[1]?.slice(0, 5) ?? "00:00";
      const hourPrefix = hhmm.slice(0, 2);

      if (hourPrefix >= currentHourPrefix && slots.length < 6) {
        const mapped = mapWeatherCode(hourlyRaw.weather_code?.[i] ?? 2);
        slots.push({
          time: hhmm,
          tempC: Math.round(hourlyRaw.temperature_2m?.[i] ?? currentTempC),
          condition: mapped.condition,
          rainProb: Math.round(hourlyRaw.precipitation_probability?.[i] ?? 0),
          icon: mapped.icon,
          isNow: slots.length === 0,
        });
      }
    }
  }

  const temps = slots.length > 0 ? slots.map((s) => s.tempC) : [currentTempC];
  const highC = Math.max(...temps, currentTempC);
  const lowC = Math.min(...temps, currentTempC);

  return {
    locationName,
    currentTempC,
    feelsLikeC: currentTempC + 1,
    highC,
    lowC,
    condition: currentMapped.condition,
    humidity: Math.round(current?.relative_humidity_2m ?? 75),
    windKmh: Math.round(current?.wind_speed_10m ?? 10),
    hourly: slots,
  };
}

export async function fetchLatestQuakeSafety(): Promise<SafetyStatus> {
  const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
  if (!res.ok) {
    throw new Error("Gagal mengambil data gempa BMKG");
  }

  const json: BmkgQuakeResponse = await res.json();
  const g = json.Infogempa?.gempa;

  if (!g) {
    return {
      isSafe: true,
      title: "Kondisi wilayah aman",
      subtitle: "Belum ada pembaruan data gempa terbaru dari BMKG.",
    };
  }

  const mag = g.Magnitude ?? "-";
  const wilayah = g.Wilayah ?? "Indonesia";
  const jam = g.Jam ?? "";

  return {
    isSafe: false,
    title: `Gempa M ${mag} · ${jam}`,
    subtitle: `${wilayah} (${g.Potensi ?? "Info BMKG"})`,
  };
}
