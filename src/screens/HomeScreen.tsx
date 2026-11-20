import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StatusBar, Platform, ActivityIndicator, Modal, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { WeatherSummary, SafetyStatus } from "../types/weather";
import { getCommuteAdvice } from "../utils/commuterHelper";
import { FALLBACK_WEATHER, FALLBACK_SAFETY } from "../utils/fallbackData";
import { LOCATION_PRESETS, LocationPreset } from "../utils/locationPresets";
import { SHELTER_BY_LOCATION } from "../utils/shelterData";
import { fetchWeatherByCoords, fetchLatestQuakeSafety } from "../services/weatherApi";
import { homeStyles as styles } from "../styles/homeStyles";
import RouteTab from "../components/RouteTab";
import AlertTab from "../components/AlertTab";
import ProfileTab from "../components/ProfileTab";

type TabKey = "Beranda" | "Rute" | "Peringatan" | "Profil";
const TOP_INSET = Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 12;

export default function HomeScreen() {
  const [selectedLoc, setSelectedLoc] = useState<LocationPreset>(LOCATION_PRESETS[0]);
  const [locModalVisible, setLocModalVisible] = useState<boolean>(false);
  const [shelterModalVisible, setShelterModalVisible] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherSummary>(FALLBACK_WEATHER);
  const [safety, setSafety] = useState<SafetyStatus>(FALLBACK_SAFETY);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAdvice, setShowAdvice] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabKey>("Beranda");

  const loadLiveData = useCallback(async (targetLoc: LocationPreset = selectedLoc) => {
    setLoading(true);
    try {
      const [liveWeather, liveSafety] = await Promise.allSettled([
        fetchWeatherByCoords(targetLoc.name, targetLoc.latitude, targetLoc.longitude),
        fetchLatestQuakeSafety(),
      ]);
      if (liveWeather.status === "fulfilled" && liveWeather.value.hourly.length > 0) {
        setWeather(liveWeather.value);
      }
      if (liveSafety.status === "fulfilled") {
        setSafety(liveSafety.value);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedLoc]);

  useEffect(() => {
    loadLiveData(selectedLoc);
  }, [selectedLoc, loadLiveData]);

  const handleSelectLocation = (preset: LocationPreset) => {
    setSelectedLoc(preset);
    setLocModalVisible(false);
    setActiveTab("Beranda");
  };

  const openInMaps = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  const shelters = SHELTER_BY_LOCATION[selectedLoc.id] ?? SHELTER_BY_LOCATION.lowokwaru;
  const advice = getCommuteAdvice(weather.hourly);

  const renderWeatherIcon = (icon: string, isNow?: boolean) => {
    if (icon === "sunny") return <View style={styles.sunBadge}><View style={styles.sunCore} /></View>;
    if (icon === "rainy") return <MaterialCommunityIcons name="weather-rainy" size={30} color="#94A3B8" />;
    return <MaterialCommunityIcons name="weather-cloudy" size={30} color={isNow ? "#E2E8F0" : "#CBD5E1"} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={activeTab === "Beranda" ? "light-content" : "dark-content"} />
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, activeTab !== "Beranda" && { paddingTop: TOP_INSET }]} showsVerticalScrollIndicator={false}>
        {activeTab === "Beranda" && (
          <>
            <LinearGradient colors={["#0B3B39", "#135D58", "#18736C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.heroHeader, { paddingTop: TOP_INSET + 10 }]}>
              <View style={styles.topBar}>
                <TouchableOpacity style={styles.locationRow} activeOpacity={0.8} onPress={() => setLocModalVisible(true)}>
                  <View style={styles.circleIconBtn}><Ionicons name="location-outline" size={18} color="#E2F1F0" /></View>
                  <View>
                    <Text style={styles.locationLabel}>Lokasi saat ini</Text>
                    <View style={styles.locationNameRow}>
                      <Text style={styles.locationValue}>{weather.locationName}</Text>
                      <Ionicons name="chevron-down" size={15} color="#E2F1F0" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleIconBtn} activeOpacity={0.8} onPress={() => setActiveTab("Peringatan")}>
                  {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <><Ionicons name="notifications-outline" size={19} color="#FFFFFF" /><View style={styles.notifDot} /></>}
                </TouchableOpacity>
              </View>

              <View style={styles.heroBody}>
                <View>
                  <Text style={styles.bigTemp}>{weather.currentTempC}°</Text>
                  <Text style={styles.conditionText}>{weather.condition}</Text>
                  <Text style={styles.feelsLikeText}>Terasa seperti {weather.feelsLikeC}° · H: {weather.highC}° L: {weather.lowC}°</Text>
                </View>
                <View style={styles.weatherGraphic}>
                  <View style={styles.sunGlow} />
                  <View style={styles.sunCircle} />
                  <View style={styles.backCloudGroup}>
                    <View style={styles.backCloudPuffLeft} />
                    <View style={styles.backCloudPuffTop} />
                    <View style={styles.backCloudBase} />
                  </View>
                  <View style={styles.frontCloudGroup}>
                    <View style={styles.frontCloudLeft} />
                    <View style={styles.frontCloudMid} />
                    <View style={styles.frontCloudRight} />
                    <View style={styles.frontCloudBase} />
                  </View>
                </View>
              </View>

              <View style={styles.heroMetrics}>
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="waves" size={16} color="#8CE0D8" />
                  <Text style={styles.metricLabel}>Kelembapan</Text>
                  <Text style={styles.metricValue}>{weather.humidity}%</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="weather-windy" size={16} color="#8CE0D8" />
                  <Text style={styles.metricLabel}>Angin</Text>
                  <Text style={styles.metricValue}>{weather.windKmh} km/j</Text>
                </View>
              </View>
            </LinearGradient>

            {showAdvice && (
              <View style={styles.adviceCard}>
                <View style={styles.adviceTopRow}>
                  <View style={styles.adviceIconBox}><MaterialCommunityIcons name="weather-pouring" size={22} color="#D97706" /></View>
                  <View style={styles.adviceTextWrap}>
                    <Text style={styles.adviceEyebrow}>SARAN PERJALANAN</Text>
                    <Text style={styles.adviceHeadline}>{advice.headline}</Text>
                    <Text style={styles.adviceDesc}>{advice.description}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowAdvice(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="close" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                <View style={styles.riskRow}>
                  <View style={styles.riskTrack}>
                    <LinearGradient colors={["#10B981", "#84CC16", "#F59E0B"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.riskFill, { width: `${advice.riskProgress * 100}%` }]} />
                  </View>
                  <Text style={styles.riskLabel}>{advice.riskProgress >= 0.6 ? "Risiko tinggi" : "Risiko rendah"}</Text>
                </View>
              </View>
            )}

            <View style={[styles.sectionWrap, !showAdvice && { marginTop: 20 }]}>
              <Text style={styles.sectionEyebrow}>PRAKIRAAN HARI INI</Text>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Timeline hujan</Text>
                <TouchableOpacity onPress={() => loadLiveData(selectedLoc)}><Text style={styles.sectionAction}>Refresh</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineList}>
                {weather.hourly.map((slot) => {
                  const active = Boolean(slot.isNow);
                  return (
                    <View key={slot.time} style={[styles.hourPill, active ? styles.hourPillActive : styles.hourPillNormal]}>
                      <Text style={[styles.hourTitle, active && styles.textWhite]}>{active ? "Sekarang" : slot.time}</Text>
                      {active && <Text style={styles.hourSubTime}>{slot.time}</Text>}
                      <View style={styles.hourIconWrap}>{renderWeatherIcon(slot.icon, active)}</View>
                      <Text style={[styles.hourTemp, active && styles.textWhite]}>{slot.tempC}°</Text>
                      <Text style={[styles.hourProb, active ? styles.hourProbActive : slot.rainProb >= 70 ? styles.hourProbHigh : styles.hourProbLow]}>{slot.rainProb}%</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Butuh tempat menepi?</Text>
                <View style={styles.gpsBadge}><View style={styles.gpsDot} /><Text style={styles.gpsText}>GPS aktif</Text></View>
              </View>
              <LinearGradient colors={["#0F8A7B", "#0B6E63"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shelterBanner}>
                <View style={styles.bannerDecorCircle1} />
                <View style={styles.bannerDecorCircle2} />
                <View style={styles.shelterContent}>
                  <View style={styles.shelterPill}><Ionicons name="umbrella-outline" size={13} color="#E6FFFA" /><Text style={styles.shelterPillText}>Darurat hujan</Text></View>
                  <Text style={styles.shelterTitle}>Cari shelter aman di sekitar Anda</Text>
                  <Text style={styles.shelterSubtitle}>Masjid, SPBU, dan minimarket terdekat.</Text>
                  <TouchableOpacity style={styles.shelterBtn} activeOpacity={0.85} onPress={() => setShelterModalVisible(true)}>
                    <Text style={styles.shelterBtnText}>Cari sekarang</Text>
                    <Ionicons name="paper-plane-outline" size={14} color="#0F766E" />
                  </TouchableOpacity>
                </View>
                <View style={styles.shelterRightPin}><Ionicons name="location-outline" size={24} color="#D1FAE5" /></View>
              </LinearGradient>
            </View>

            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Info keselamatan</Text>
                <TouchableOpacity onPress={() => setActiveTab("Peringatan")}><Text style={styles.sectionAction}>Lihat semua</Text></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.safetyCard} activeOpacity={0.85} onPress={() => setActiveTab("Peringatan")}>
                <View style={styles.safetyShieldBox}><Ionicons name="shield-checkmark-outline" size={22} color="#10B981" /></View>
                <View style={styles.safetyTextWrap}>
                  <View style={styles.safetyTitleRow}>
                    <Text style={styles.safetyTitle} numberOfLines={1}>{safety.title}</Text>
                    <View style={styles.terkiniBadge}><Text style={styles.terkiniText}>TERKINI</Text></View>
                  </View>
                  <Text style={styles.safetySubtitle}>{safety.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === "Rute" && (
          <RouteTab selectedLocId={selectedLoc.id} onSelectPreset={handleSelectLocation} />
        )}

        {activeTab === "Peringatan" && (
          <AlertTab safety={safety} onRefresh={() => loadLiveData(selectedLoc)} />
        )}

        {activeTab === "Profil" && <ProfileTab />}
      </ScrollView>

      <Modal visible={locModalVisible} transparent animationType="slide" onRequestClose={() => setLocModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Lokasi Pantauan</Text>
              <TouchableOpacity onPress={() => setLocModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
            {LOCATION_PRESETS.map((item) => {
              const isSelected = item.id === selectedLoc.id;
              return (
                <TouchableOpacity key={item.id} style={[styles.presetItem, isSelected && styles.presetItemActive]} onPress={() => handleSelectLocation(item)}>
                  <View>
                    <Text style={styles.presetName}>{item.name}</Text>
                    <Text style={styles.presetTag}>{item.tag}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color="#0F8A7B" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal visible={shelterModalVisible} transparent animationType="slide" onRequestClose={() => setShelterModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Tempat Menepi Terdekat</Text>
                <Text style={styles.presetTag}>Sekitar {selectedLoc.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShelterModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
            {shelters.map((spot) => (
              <View key={spot.id} style={styles.shelterCard}>
                <View style={styles.shelterInfo}>
                  <View style={styles.shelterBadgeRow}>
                    <View style={styles.shelterCatBadge}><Text style={styles.shelterCatText}>{spot.category}</Text></View>
                    <Text style={styles.shelterDistText}>{spot.distanceText}</Text>
                  </View>
                  <Text style={styles.shelterName}>{spot.name}</Text>
                  <Text style={styles.shelterNote}>{spot.note}</Text>
                </View>
                <TouchableOpacity style={styles.mapsActionBtn} activeOpacity={0.85} onPress={() => openInMaps(spot.mapsQuery)}>
                  <Ionicons name="navigate" size={13} color="#FFFFFF" />
                  <Text style={styles.mapsActionText}>Maps</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        {([
          { key: "Beranda", icon: "home-outline", activeIcon: "home" },
          { key: "Rute", icon: "git-branch-outline", activeIcon: "git-branch" },
          { key: "Peringatan", icon: "warning-outline", activeIcon: "warning" },
          { key: "Profil", icon: "person-outline", activeIcon: "person" },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.navItem} onPress={() => setActiveTab(tab.key)} activeOpacity={0.8}>
              <View style={[styles.navIndicator, isActive && styles.navIndicatorActive]} />
              <Ionicons name={isActive ? tab.activeIcon : tab.icon} size={21} color={isActive ? "#0F8A7B" : "#94A3B8"} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
