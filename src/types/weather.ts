export interface HourlyWeather {
  time: string;
  dateTime?: string;
  tempC: number;
  condition: string;
  rainProb: number;
  rainMm?: number;
  rainIntensity?: "none" | "light" | "moderate" | "heavy";
  icon: "sunny" | "partly-cloudy" | "cloudy" | "rainy";
  isNow?: boolean;
}

export interface WeatherSummary {
  locationName: string;
  currentTempC: number;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  condition: string;
  humidity: number;
  windKmh: number;
  hourly: HourlyWeather[];
}

export interface CommuteAdvice {
  headline: string;
  description: string;
  riskProgress: number;
  riskLevel: "low" | "moderate" | "high" | "unknown";
}

export interface SafetyStatus {
  isSafe: boolean;
  title: string;
  subtitle: string;
}
