import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafetyStatus } from "../types/weather";

interface Props {
  safety: SafetyStatus;
  onRefresh: () => void;
}

const RIDING_TIPS = [
  { id: "t1", icon: "weather-pouring", title: "Hujan Lebat & Jarak Pandang", desc: "Kurangi kecepatan 20-30%, nyalakan lampu utama, dan hindari genangan dalam." },
  { id: "t2", icon: "weather-windy", title: "Angin Samping Kencang", desc: "Pegang setang lebih rileks namun sigap, jaga jarak aman dari kendaraan besar." },
  { id: "t3", icon: "alert-circle-outline", title: "Pasca Info Gempa BMKG", desc: "Waspada retakan aspal, kabel menjuntai, atau reruntuhan di jalur tebing/jembatan." },
] as const;

export default function AlertTab({ safety, onRefresh }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>PUSAT PERINGATAN</Text>
          <Text style={styles.title}>Info Keselamatan & BMKG</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh" size={16} color="#0F8A7B" />
        </TouchableOpacity>
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
            <MaterialCommunityIcons name={tip.icon} size={20} color="#0F766E" />
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
  eyebrow: { color: "#0F8A7B", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  title: { color: "#0F172A", fontSize: 20, fontWeight: "700", marginTop: 2 },
  refreshBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E6FFFA", justifyContent: "center", alignItems: "center" },
  quakeBanner: { backgroundColor: "#0E4D4A", borderRadius: 20, padding: 18, marginBottom: 20 },
  badge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.16)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  badgeText: { color: "#A7F3D0", fontSize: 10, fontWeight: "700" },
  quakeTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  quakeDesc: { color: "#CCFBF1", fontSize: 12, lineHeight: 18, marginTop: 6 },
  sectionTitle: { color: "#0F172A", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  tipCard: { flexDirection: "row", gap: 12, backgroundColor: "#FFFFFF", padding: 14, borderRadius: 16, marginBottom: 10, elevation: 2 },
  tipIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F0FDFA", justifyContent: "center", alignItems: "center" },
  tipTitle: { color: "#0F172A", fontSize: 13, fontWeight: "700" },
  tipDesc: { color: "#64748B", fontSize: 12, lineHeight: 17, marginTop: 2 },
});
