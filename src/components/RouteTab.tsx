import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LOCATION_PRESETS, LocationPreset } from "../utils/locationPresets";

interface SavedRoute {
  id: string;
  title: string;
  origin: string;
  destination: string;
  preset: LocationPreset;
}

const INITIAL_ROUTES: SavedRoute[] = [
  { id: "r1", title: "Jalur Kuliah / Kerja", origin: "Lowokwaru", destination: "Klojen, Malang", preset: LOCATION_PRESETS[0] },
  { id: "r2", title: "Riding Akhir Pekan", origin: "Malang", destination: "Kota Batu", preset: LOCATION_PRESETS[2] },
];

interface Props {
  selectedLocId: string;
  onSelectPreset: (preset: LocationPreset) => void;
}

export default function RouteTab({ selectedLocId, onSelectPreset }: Props) {
  const [routes, setRoutes] = useState<SavedRoute[]>(INITIAL_ROUTES);
  const [newTitle, setNewTitle] = useState("");
  const [newDest, setNewDest] = useState("");

  const handleAddRoute = () => {
    if (!newTitle.trim() || !newDest.trim()) return;
    const item: SavedRoute = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      origin: "Titik Awal",
      destination: newDest.trim(),
      preset: LOCATION_PRESETS[0],
    };
    setRoutes([item, ...routes]);
    setNewTitle("");
    setNewDest("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>RUTE KOMUTER MOTOR</Text>
      <Text style={styles.title}>Rute & Lokasi Favorit</Text>
      <Text style={styles.subtitle}>Pilih rute untuk memantau cuaca di titik tujuan secara cepat.</Text>

      <View style={styles.formCard}>
        <Text style={styles.formLabel}>Tambah Rute Baru</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama rute (mis. Kos -> Kampus)"
          placeholderTextColor="#94A3B8"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Tujuan (mis. Klojen / Batu)"
          placeholderTextColor="#94A3B8"
          value={newDest}
          onChangeText={setNewDest}
        />
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={handleAddRoute}>
          <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Simpan Rute</Text>
        </TouchableOpacity>
      </View>

      {routes.map((route) => {
        const active = route.preset.id === selectedLocId;
        return (
          <TouchableOpacity
            key={route.id}
            style={[styles.routeCard, active && styles.routeCardActive]}
            activeOpacity={0.85}
            onPress={() => onSelectPreset(route.preset)}
          >
            <View style={styles.routeIcon}>
              <Ionicons name="navigate-outline" size={19} color="#1976D2" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTitle}>{route.title}</Text>
              <Text style={styles.routePath}>{route.origin} → {route.destination}</Text>
            </View>
            <Text style={styles.useText}>{active ? "Aktif" : "Pantau"}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  eyebrow: { color: "#1976D2", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  title: { color: "#0F172A", fontSize: 20, fontWeight: "700", marginTop: 2 },
  subtitle: { color: "#64748B", fontSize: 12, marginTop: 4, marginBottom: 16 },
  formCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginBottom: 16, gap: 8, elevation: 2 },
  formLabel: { color: "#0F172A", fontSize: 13, fontWeight: "700" },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: "#0F172A" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#1976D2", paddingVertical: 10, borderRadius: 10, marginTop: 4 },
  addBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  routeCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#FFFFFF", padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 10 },
  routeCardActive: { borderColor: "#1976D2", backgroundColor: "#EAF4FF" },
  routeIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#D8F0ED", justifyContent: "center", alignItems: "center" },
  routeTitle: { color: "#0F172A", fontSize: 14, fontWeight: "700" },
  routePath: { color: "#64748B", fontSize: 12, marginTop: 2 },
  useText: { color: "#1976D2", fontSize: 12, fontWeight: "700" },
});
