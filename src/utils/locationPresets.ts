export interface LocationPreset {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  tag: string;
}

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: "lowokwaru",
    name: "Lowokwaru, Malang",
    latitude: -7.9553,
    longitude: 112.6137,
    tag: "Kos & Kampus",
  },
  {
    id: "klojen",
    name: "Klojen, Malang",
    latitude: -7.9797,
    longitude: 112.6304,
    tag: "Pusat Kota",
  },
  {
    id: "batu",
    name: "Kota Batu, Jatim",
    latitude: -7.8711,
    longitude: 112.5269,
    tag: "Jalur Dingin",
  },
  {
    id: "surabaya",
    name: "Surabaya, Jatim",
    latitude: -7.2575,
    longitude: 112.7521,
    tag: "Luar Kota",
  },
];
