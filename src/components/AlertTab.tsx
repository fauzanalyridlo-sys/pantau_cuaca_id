import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafetyStatus } from "../types/weather";
import { RainAlert } from "../utils/rainAlertHelper";

interface Props {
  safety: SafetyStatus;
  onRefresh: () => void;
  rainAlerts: RainAlert[];
  notificationEnabled: boolean;
  onEnableNotifications: () => void;
  weatherDataStatus: "live" | "demo" | "offline";
}

const RIDING_TIPS = [
  { id: "t1", icon: "weather-pouring", title: "Hujan Lebat & Jarak Pandang", desc: "Kurangi kecepatan 20-30%, nyalakan lampu utama, dan hindari genangan dalam." },
  { id: "t2", icon: "weather-windy", title: "Angin Samping Kencang", desc: "Pegang setang lebih rileks namun sigap, jaga jarak aman dari kendaraan besar." },
  { id: "t3", icon: "alert-circle-outline", title: "Pasca Info Gempa BMKG", desc: "Waspada retakan aspal, kabel menjuntai, atau reruntuhan di jalur tebing/jembatan." },
] as const;

function getAlertColor(level: RainAlert["level"]) {
  if (level === "danger") return "#DC4545";
  if (level === "warning") return "#D97706";
  if (level === "pre-alert") return "#1976D2";
  return "#26A69A";
}

function getAlertLabel(level: RainAlert["level"]) {
  if (level === "danger") return "BAHAYA";
  if (level === "warning") return "WASPADA";
  if (level === "pre-alert") return "PRA-PERINGATAN";
  return "INFO";
}

export default function AlertTab({
  safety,
  onRefresh,
  rainAlerts,
  notificationEnabled,
  onEnableNotifications,
  weatherDataStatus,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>PUSAT PERINGATAN</Text>
          <Text style={styles.title}>Info Keselamatan & BMKG</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh" size={16} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <View style={styles.rainSection}>
        <View style={styles.rainHeader}>
          <View style={styles.rainHeading}>
            <MaterialCommunityIcons name="weather-pouring" size={21} color="#1976D2" />
            <Text style={styles.sectionTitle}>Peringatan Hujan</Text>
          </View>
          <Text style={styles.sourceLabel}>{weatherDataStatus.toUpperCase()}</Text>
        </View>

        <Text style={styles.rainDescription}>
          Pantauan potensi hujan berdasarkan prakiraan cuaca per jam.
        </Text>

        {weatherDataStatus === "live" ? (
          rainAlerts.length > 0 ? (
            rainAlerts.map((alert) => (
              <View key={alert.id} style={styles.rainAlertCard}>
                <View style={[styles.alertAccent, { backgroundColor: getAlertColor(alert.level) }]} />
                <View style={styles.alertContent}>
                  <View style={styles.alertTopRow}>
                    <Text style={[styles.alertBadge, { color: getAlertColor(alert.level) }]}>
                      {getAlertLabel(alert.level)}
                    </Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyAlert}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#26A69A" />
              <Text style={styles.emptyTitle}>Belum ada indikasi hujan signifikan</Text>
              <Text style={styles.emptyText}>Tetap pantau perubahan prakiraan sebelum berkendara.</Text>
            </View>
          )
        ) : (
          <View style={styles.emptyAlert}>
            <Ionicons name="cloud-offline-outline" size={24} color="#D97706" />
            <Text style={styles.emptyTitle}>Data cuaca LIVE belum tersedia</Text>
            <Text style={styles.emptyText}>Hubungkan data cuaca terlebih dahulu untuk melihat peringatan aktual.</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.notificationButton, notificationEnabled && styles.notificationButtonActive]}
          onPress={onEnableNotifications}
          disabled={notificationEnabled}
        >
          <Ionicons
            name={notificationEnabled ? "notifications" : "notifications-outline"}
            size={18}
            color={notificationEnabled ? "#059669" : "#FFFFFF"}
          />
          <Text style={[styles.notificationButtonText, notificationEnabled && styles.notificationButtonTextActive]}>
            {notificationEnabled ? "Notifikasi sudah aktif" : "Aktifkan Notifikasi Hujan"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.notificationHint}>
          Notifikasi lokal diproses saat prakiraan LIVE diperbarui dan izin diberikan.
        </Text>
      </View>

      <View style={styles.quakeBanner}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DATA TERKINI BMKG</Text>
        </View>
        <Text style={styles.quakeTitle}>{safety.title}</Text>
        <Text style={styles.quakeDesc}>{safety.subtitle}</Text>
      </View>

      <Text style={styles.sectionTitle}>Panduan Safety Riding</Text>
      {RIDING_TIPS.map((tip) => (
        <View key={tip.id} style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <MaterialCommunityIcons name={tip.icon} size={20} color="#26A69A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  eyebrow: { color: "#1976D2", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  title: { color: "#0F172A", fontSize: 20, fontWeight: "700", marginTop: 2 },
  refreshBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#EAF4FF", justifyContent: "center", alignItems: "center" },
  rainSection: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 15, marginBottom: 18, elevation: 2 },
  rainHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rainHeading: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { color: "#0F172A", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  sourceLabel: { color: "#059669", fontSize: 10, fontWeight: "800" },
  rainDescription: { color: "#64748B", fontSize: 12, lineHeight: 18, marginBottom: 12 },
  rainAlertCard: { flexDirection: "row", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 9 },
  alertAccent: { width: 4 },
  alertContent: { flex: 1, padding: 11 },
  alertTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  alertBadge: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  alertTime: { color: "#64748B", fontSize: 11, fontWeight: "700" },
  alertTitle: { color: "#0F172A", fontSize: 13, fontWeight: "700" },
  alertMessage: { color: "#64748B", fontSize: 11, lineHeight: 16, marginTop: 4 },
  emptyAlert: { backgroundColor: "#F0F9FF", borderRadius: 12, padding: 14, alignItems: "center", gap: 5 },
  emptyTitle: { color: "#0F172A", fontSize: 12, fontWeight: "700", textAlign: "center" },
  emptyText: { color: "#64748B", fontSize: 11, lineHeight: 16, textAlign: "center" },
  notificationButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#1976D2", padding: 12, borderRadius: 12, marginTop: 12 },
  notificationButtonActive: { backgroundColor: "#DCFCE7" },
  notificationButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  notificationButtonTextActive: { color: "#059669" },
  notificationHint: { color: "#94A3B8", fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 7 },
  quakeBanner: { backgroundColor: "#1565C0", borderRadius: 20, padding: 18, marginBottom: 20 },
  badge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.16)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  badgeText: { color: "#D8F0ED", fontSize: 10, fontWeight: "700" },
  quakeTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  quakeDesc: { color: "#D8F0ED", fontSize: 12, lineHeight: 18, marginTop: 6 },
  tipCard: { flexDirection: "row", gap: 12, backgroundColor: "#FFFFFF", padding: 14, borderRadius: 16, marginBottom: 10, elevation: 2 },
  tipIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#EAF4FF", justifyContent: "center", alignItems: "center" },
  tipTitle: { color: "#0F172A", fontSize: 13, fontWeight: "700" },
  tipDesc: { color: "#64748B", fontSize: 12, lineHeight: 17, marginTop: 2 },
});
