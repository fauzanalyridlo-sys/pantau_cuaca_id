import { HourlyWeather, WeatherSummary, SafetyStatus } from "../types/weather";

interface OpenMeteoResponse {
  current?: {
    time?: string;
    temperature_2m: number;
    apparent_temperature?: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    rain?: number[];
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

function mapRainIntensity(rainMm: number): NonNullable<HourlyWeather["rainIntensity"]> {
  if (rainMm < 0.1) return "none";
  if (rainMm < 2.5) return "light";
  if (rainMm < 7.5) return "moderate";
  return "heavy";
}

function mapWeatherCode(code: number): {
  condition: string;
  icon: HourlyWeather["icon"];
} {
  if (code === 0) return { condition: "Cerah", icon: "sunny" };
  if (code === 1 || code === 2) return { condition: "Cerah Berawan", icon: "partly-cloudy" };
  if (code === 3) return { condition: "Berawan", icon: "cloudy" };
  if (code >= 51 && code <= 67) return { condition: "Hujan", icon: "rainy" };
  if (code >= 80 && code <= 82) return { condition: "Hujan", icon: "rainy" };
  if (code >= 95 && code <= 99) return { condition: "Hujan Petir", icon: "rainy" };
  return { condition: "Berawan", icon: "cloudy" };
}

export async function fetchWeatherByCoords(
  locationName = "Lowokwaru, Malang",
  latitude = -7.9553,
  longitude = 112.6137
): Promise<WeatherSummary> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&hourly=temperature_2m,precipitation_probability,rain,weather_code` +
    `&timezone=Asia%2FJakarta&forecast_days=2`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil data cuaca Open-Meteo");
  }

  const data: OpenMeteoResponse = await res.json();
  const current = data.current;
  const hourlyRaw = data.hourly;

  const currentMapped = mapWeatherCode(current?.weather_code ?? 2);
  const currentTempC = Math.round(current?.temperature_2m ?? 28);

  const jakartaNow = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date()).replace(" ", "T");

  const currentHourKey = (current?.time ?? jakartaNow).slice(0, 13);

  const slots: HourlyWeather[] = [];

  if (hourlyRaw?.time) {
    const startIndex = hourlyRaw.time.findIndex(
      (time) => time.slice(0, 13) >= currentHourKey
    );

    if (startIndex >= 0) {
      for (
        let i = startIndex;
        i < hourlyRaw.time.length && slots.length < 24;
        i++
      ) {
        const isoTime = hourlyRaw.time[i];
        const hhmm = isoTime.split("T")[1]?.slice(0, 5) ?? "00:00";
        const mapped = mapWeatherCode(hourlyRaw.weather_code?.[i] ?? 2);

        const rainMm = Math.max(
          0,
          Number((hourlyRaw.rain?.[i] ?? 0).toFixed(1))
        );

        slots.push({
          time: hhmm,
          dateTime: isoTime,
          tempC: Math.round(hourlyRaw.temperature_2m?.[i] ?? currentTempC),
          condition: mapped.condition,
          rainProb: Math.round(hourlyRaw.precipitation_probability?.[i] ?? 0),
          rainMm,
          rainIntensity: mapRainIntensity(rainMm),
          icon: mapped.icon,
          isNow: isoTime.slice(0, 13) === currentHourKey,
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
    feelsLikeC: Math.round(current?.apparent_temperature ?? currentTempC),
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
