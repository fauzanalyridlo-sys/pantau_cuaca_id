import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HourlyWeather } from "../types/weather";
import {
  analyzeManualDeparture,
  getAutomaticRecommendations,
  VehicleType,
  CommuterRecommendation,
} from "../utils/smartCommuterHelper";

type Props = {
  hourly: HourlyWeather[];
  weatherDataStatus: "live" | "demo" | "offline";
};

type Mode = "automatic" | "manual";

const RISK_COLORS = {
  low: "#059669",
  moderate: "#D97706",
  high: "#DC4545",
  unknown: "#64748B",
};

const RISK_LABELS = {
  low: "Risiko rendah",
  moderate: "Waspada",
  high: "Risiko tinggi",
  unknown: "Data belum lengkap",
};

function getIntensityLabel(intensity: CommuterRecommendation["rainIntensity"]) {
  if (intensity === "heavy") return "Lebat";
  if (intensity === "moderate") return "Sedang";
  if (intensity === "light") return "Ringan";
  return "Minim";
}

function RecommendationDetails({
  recommendation,
}: {
  recommendation: CommuterRecommendation;
}) {
  const riskColor = RISK_COLORS[recommendation.riskLevel];

  return (
    <View style={styles.detailCard}>
      <View style={styles.detailTopRow}>
        <View style={styles.departureTimeWrap}>
          <Text style={styles.smallLabel}>JAM BERANGKAT</Text>
          <Text style={styles.departureTime}>
            {recommendation.departureTime}
          </Text>
        </View>
        <View
          style={[
            styles.riskBadge,
            { backgroundColor: `${riskColor}15` },
          ]}
        >
          <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
          <Text style={[styles.riskBadgeText, { color: riskColor }]}>
            {RISK_LABELS[recommendation.riskLevel]}
          </Text>
        </View>
      </View>

      <Text style={styles.recommendationTitle}>
        {recommendation.title}
      </Text>
      <Text style={styles.recommendationDescription}>
        {recommendation.description}
      </Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Ionicons name="umbrella-outline" size={16} color="#1976D2" />
          <Text style={styles.metricValue}>
            {recommendation.rainProbability}%
          </Text>
          <Text style={styles.metricLabel}>Peluang hujan</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBox}>
          <Ionicons name="water-outline" size={16} color="#1976D2" />
          <Text style={styles.metricValue}>
            {recommendation.maxRainMm.toFixed(1)} mm
          </Text>
          <Text style={styles.metricLabel}>Maks. per jam</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBox}>
          <Ionicons name="cloud-outline" size={16} color="#1976D2" />
          <Text style={styles.metricValue}>
            {getIntensityLabel(recommendation.rainIntensity)}
          </Text>
          <Text style={styles.metricLabel}>Intensitas</Text>
        </View>
      </View>

      {!recommendation.isDataComplete && (
        <View style={styles.incompleteNotice}>
          <Ionicons name="information-circle-outline" size={15} color="#B45309" />
          <Text style={styles.incompleteText}>
            Data prakiraan belum mencakup seluruh 2 jam perjalanan.
          </Text>
        </View>
      )}
    </View>
  );
}

export default function SmartCommuterCard({
  hourly,
  weatherDataStatus,
}: Props) {
  const [mode, setMode] = useState<Mode>("automatic");
  const [vehicle, setVehicle] = useState<VehicleType>("motor");
  const [selectedDepartureIndex, setSelectedDepartureIndex] = useState<
    number | null
  >(null);

  const futureSlots = useMemo(
    () =>
      hourly
        .map((slot, index) => ({ slot, index }))
        .filter(({ slot }) => !slot.isNow),
    [hourly]
  );

  const selectedIndex =
    selectedDepartureIndex !== null &&
    futureSlots.some(({ index }) => index === selectedDepartureIndex)
      ? selectedDepartureIndex
      : futureSlots[0]?.index ?? -1;

  const automaticRecommendations = useMemo(
    () => getAutomaticRecommendations(hourly, vehicle, 2),
    [hourly, vehicle]
  );

  const manualRecommendation = useMemo(
    () =>
      selectedIndex >= 0
        ? analyzeManualDeparture(hourly, selectedIndex, vehicle, 2)
        : null,
    [hourly, selectedIndex, vehicle]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={styles.headingIcon}>
          <Ionicons name="navigate-outline" size={20} color="#1976D2" />
        </View>
        <View style={styles.headingTextWrap}>
          <Text style={styles.eyebrow}>SMART COMMUTER</Text>
          <Text style={styles.heading}>Rekomendasi perjalanan</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Analisis risiko hujan untuk perkiraan perjalanan 2 jam ke depan.
      </Text>

      <Text style={styles.controlLabel}>KENDARAAN</Text>
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segment, vehicle === "motor" && styles.segmentActive]}
          onPress={() => setVehicle("motor")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="bicycle-outline"
            size={16}
            color={vehicle === "motor" ? "#FFFFFF" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentText,
              vehicle === "motor" && styles.segmentTextActive,
            ]}
          >
            Motor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, vehicle === "mobil" && styles.segmentActive]}
          onPress={() => setVehicle("mobil")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="car-outline"
            size={16}
            color={vehicle === "mobil" ? "#FFFFFF" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentText,
              vehicle === "mobil" && styles.segmentTextActive,
            ]}
          >
            Mobil
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.controlLabel}>METODE REKOMENDASI</Text>
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segment, mode === "automatic" && styles.segmentActive]}
          onPress={() => setMode("automatic")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="sparkles-outline"
            size={16}
            color={mode === "automatic" ? "#FFFFFF" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentText,
              mode === "automatic" && styles.segmentTextActive,
            ]}
          >
            Otomatis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, mode === "manual" && styles.segmentActive]}
          onPress={() => setMode("manual")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={mode === "manual" ? "#FFFFFF" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentText,
              mode === "manual" && styles.segmentTextActive,
            ]}
          >
            Pilih jam
          </Text>
        </TouchableOpacity>
      </View>

      {mode === "automatic" ? (
        <View style={styles.resultsWrap}>
          <Text style={styles.resultsHeading}>
            3 pilihan waktu dengan risiko terendah
          </Text>
          {automaticRecommendations.length > 0 ? (
            automaticRecommendations.map((item, index) => (
              <View key={`${item.departureTime}-${index}`}>
                <View style={styles.rankRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.rankCaption}>
                    Rekomendasi {index + 1}
                  </Text>
                </View>
                <RecommendationDetails recommendation={item} />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="cloud-offline-outline"
                size={24}
                color="#94A3B8"
              />
              <Text style={styles.emptyTitle}>
                Belum cukup data prakiraan
              </Text>
              <Text style={styles.emptyText}>
                Belum tersedia rentang prakiraan 2 jam yang lengkap untuk
                dibandingkan.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.resultsWrap}>
          <Text style={styles.resultsHeading}>Pilih jam keberangkatan</Text>
          {futureSlots.length > 0 ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timeList}
              >
                {futureSlots.map(({ slot, index }) => {
                  const active = index === selectedIndex;
                  return (
                    <TouchableOpacity
                      key={`${slot.time}-${index}`}
                      style={[
                        styles.timeChip,
                        active && styles.timeChipActive,
                      ]}
                      onPress={() => setSelectedDepartureIndex(index)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          active && styles.timeChipTextActive,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {manualRecommendation && (
                <RecommendationDetails recommendation={manualRecommendation} />
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                Jam keberangkatan belum tersedia
              </Text>
              <Text style={styles.emptyText}>
                Coba muat ulang prakiraan cuaca.
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={15} color="#64748B" />
        <Text style={styles.footerText}>
          Saran berdasarkan estimasi prakiraan, bukan jaminan kondisi aman.
          {weatherDataStatus === "live"
            ? " Data cuaca LIVE."
            : weatherDataStatus === "demo"
              ? " Data saat ini DEMO."
              : " Data cuaca OFFLINE."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginTop: 22,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headingIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headingTextWrap: { flex: 1 },
  eyebrow: {
    color: "#1976D2",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  heading: { color: "#0F172A", fontSize: 16, fontWeight: "700", marginTop: 2 },
  subtitle: { color: "#64748B", fontSize: 12, lineHeight: 18, marginTop: 10 },
  controlLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginTop: 16,
    marginBottom: 7,
  },
  segmentRow: { flexDirection: "row", gap: 8 },
  segment: {
    flex: 1,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  segmentActive: { backgroundColor: "#1976D2", borderColor: "#1976D2" },
  segmentText: { color: "#64748B", fontSize: 12, fontWeight: "700" },
  segmentTextActive: { color: "#FFFFFF" },
  resultsWrap: { marginTop: 18 },
  resultsHeading: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 7 },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { color: "#1976D2", fontSize: 11, fontWeight: "800" },
  rankCaption: { color: "#64748B", fontSize: 11, fontWeight: "600" },
  detailCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  detailTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  departureTimeWrap: { gap: 2 },
  smallLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  departureTime: { color: "#0F172A", fontSize: 21, fontWeight: "800" },
  riskBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskBadgeText: { fontSize: 10, fontWeight: "700" },
  recommendationTitle: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  recommendationDescription: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  metricBox: { flex: 1, alignItems: "center", gap: 3 },
  metricValue: { color: "#1E293B", fontSize: 12, fontWeight: "800" },
  metricLabel: { color: "#94A3B8", fontSize: 9, textAlign: "center" },
  metricDivider: { width: 1, height: 30, backgroundColor: "#E2E8F0" },
  incompleteNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFBEB",
    padding: 9,
    borderRadius: 9,
    marginTop: 10,
  },
  incompleteText: { flex: 1, color: "#B45309", fontSize: 10, lineHeight: 15 },
  timeList: { gap: 8, paddingBottom: 12 },
  timeChip: {
    minWidth: 62,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  timeChipActive: { backgroundColor: "#1976D2", borderColor: "#1976D2" },
  timeChipText: { color: "#64748B", fontSize: 12, fontWeight: "700" },
  timeChipTextActive: { color: "#FFFFFF" },
  emptyState: {
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  emptyTitle: { color: "#334155", fontSize: 12, fontWeight: "700" },
  emptyText: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    marginTop: 4,
  },
  footerText: { flex: 1, color: "#64748B", fontSize: 10, lineHeight: 15 },
});
