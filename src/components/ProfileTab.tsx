import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileTab() {
  const [rainAlert, setRainAlert] = useState(true);
  const [gearReminder, setGearReminder] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>MODE ANAK MOTOR</Text>
      <Text style={styles.title}>Profil & Preferensi</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="bicycle-outline" size={26} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.name}>Pengendara Harian</Text>
          <Text style={styles.role}>PantauCuaca ID · v1.0 Beta</Text>
        </View>
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Peringatan Peluang Hujan ≥ 50%</Text>
            <Text style={styles.settingDesc}>Tampilkan saran jam berangkat lebih awal</Text>
          </View>
          <Switch value={rainAlert} onValueChange={setRainAlert} trackColor={{ true: "#0F8A7B" }} />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Pengingat Jas Hujan & Cover Sepatu</Text>
            <Text style={styles.settingDesc}>Aktif saat sore hari atau cuaca mendung</Text>
          </View>
          <Switch value={gearReminder} onValueChange={setGearReminder} trackColor={{ true: "#0F8A7B" }} />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Sumber Data & Cloud</Text>
        <Text style={styles.infoText}>• Cuaca Per Jam: Open-Meteo API</Text>
        <Text style={styles.infoText}>• Info Gempa: BMKG TEWS Public JSON</Text>
        <Text style={styles.infoText}>• Sinkronisasi Rute Cloud: Siap untuk Firebase</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  eyebrow: { color: "#0F8A7B", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  title: { color: "#0F172A", fontSize: 20, fontWeight: "700", marginTop: 2, marginBottom: 16 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#0E4D4A", padding: 16, borderRadius: 20, marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  name: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  role: { color: "#A7F3D0", fontSize: 12, marginTop: 2 },
  settingCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, marginBottom: 16, elevation: 2 },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingTitle: { color: "#0F172A", fontSize: 13, fontWeight: "700" },
  settingDesc: { color: "#64748B", fontSize: 11, marginTop: 2 },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 14 },
  infoBox: { backgroundColor: "#F0FDFA", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#CCFBF1" },
  infoTitle: { color: "#0F766E", fontSize: 13, fontWeight: "700", marginBottom: 6 },
  infoText: { color: "#115E59", fontSize: 12, lineHeight: 19 },
});
