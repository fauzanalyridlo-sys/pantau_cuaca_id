import React from "react";
import * as Notifications from "expo-notifications";
import HomeScreen from "./src/screens/HomeScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return <HomeScreen />;
}