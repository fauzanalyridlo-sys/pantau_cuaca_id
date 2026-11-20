import { HourlyWeather } from "../types/weather";

export type RainAlertLevel =
  | "pre-alert"
  | "info"
  | "warning"
  | "danger";

export interface RainAlert {
  id: string;
  level: RainAlertLevel;
  severity: "light" | "moderate" | "heavy";
  priority: number;
  title: string;
  message: string;
  time: string;
  rainProb: number;
  rainMm: number;
}

function getSeverity(
  item: HourlyWeather
): RainAlert["severity"] | null {
  const amount = item.rainMm ?? 0;
  const intensity = item.rainIntensity;

  if (intensity === "heavy" || amount >= 7.5) {
    return "heavy";
  }

  if (intensity === "moderate" || amount >= 2.5) {
    return "moderate";
  }

  if (
    intensity === "light" ||
    amount >= 0.1 ||
    item.rainProb >= 50
  ) {
    return "light";
  }

  return null;
}

export function getRainAlerts(
  hourly: HourlyWeather[],
  locationName: string
): RainAlert[] {
  const upcoming = hourly.filter((item) => !item.isNow);

  const locationKey = locationName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const alerts: RainAlert[] = [];

  upcoming.forEach((item, index) => {
    const severity = getSeverity(item);

    if (!severity) return;

    const rainMm = item.rainMm ?? 0;
    const isSignificant =
      severity === "moderate" || severity === "heavy";

    const level: RainAlertLevel =
      isSignificant && index <= 1
        ? "pre-alert"
        : severity === "heavy"
          ? "danger"
          : severity === "moderate"
            ? "warning"
            : "info";

    const priority =
      severity === "heavy"
        ? 4
        : severity === "moderate"
          ? 3
          : 1;

    const severityLabel =
      severity === "heavy"
        ? "lebat"
        : severity === "moderate"
          ? "sedang"
          : "ringan";

    const title =
      level === "pre-alert"
        ? `Persiapan hujan ${severityLabel}`
        : severity === "heavy"
          ? "Peringatan hujan lebat"
          : severity === "moderate"
            ? "Waspada hujan sedang"
            : "Info potensi hujan";

    const message =
      `Prakiraan pukul ${item.time}: peluang hujan ` +
      `${item.rainProb}% dengan estimasi ${rainMm.toFixed(1)} mm/jam. ` +
      "Pertimbangkan kondisi cuaca sebelum berkendara.";

    const timeKey = item.dateTime ?? item.time;

    alerts.push({
      id: `${locationKey}:${timeKey}:${severity}`,
      level,
      severity,
      priority,
      title,
      message,
      time: item.time,
      rainProb: item.rainProb,
      rainMm,
    });
  });

  return alerts.slice(0, 3);
}
