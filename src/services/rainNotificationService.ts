import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { RainAlert } from "../utils/rainAlertHelper";

const STORAGE_KEY = "@pantau_cuaca_id/sent_rain_alerts";
const CHANNEL_ID = "rain-alerts";

export async function requestRainNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function notifyRainAlerts(
  alerts: RainAlert[]
): Promise<number> {
  if (alerts.length === 0) return 0;

  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return 0;

  let sentIds: string[] = [];

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    sentIds = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(sentIds)) sentIds = [];
  } catch {
    sentIds = [];
  }

  const unseen = alerts
    .filter((alert) => !sentIds.includes(alert.id))
    .sort((a, b) => b.priority - a.priority);

  // Kirim satu peringatan paling penting agar tidak membanjiri pengguna.
  const selected = unseen[0];
  if (!selected) return 0;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: selected.title,
      body: selected.message,
      sound: "default",
      data: {
        alertId: selected.id,
        level: selected.level,
        location: selected.id.split(":")[0],
      },
    },
    trigger: null,
  });

  sentIds.push(selected.id);

  // Batasi riwayat ID agar penyimpanan tidak terus membesar.
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sentIds.slice(-100))
  );

  return 1;
}
