export interface HourlyWeather {
  time: string;
  tempC: number;
  condition: string;
  rainProb: number;
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
  safeMinutes: number;
  riskProgress: number; // 0.0 - 1.0
}

export interface SafetyStatus {
  isSafe: boolean;
  title: string;
  subtitle: string;
}
