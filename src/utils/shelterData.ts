export interface ShelterSpot {
  id: string;
  name: string;
  category: "Masjid" | "SPBU" | "Minimarket";
  distanceText: string;
  note: string;
  mapsQuery: string;
}

export const SHELTER_BY_LOCATION: Record<string, ShelterSpot[]> = {
  lowokwaru: [
    {
      id: "lw-1",
      name: "Masjid Raden Patah UB",
      category: "Masjid",
      distanceText: "± 450 m",
      note: "Area parkir motor luas & beratap kanopi",
      mapsQuery: "Masjid Raden Patah Universitas Brawijaya Malang",
    },
    {
      id: "lw-2",
      name: "SPBU Pertamina Soekarno Hatta",
      category: "SPBU",
      distanceText: "± 700 m",
      note: "Teras mushola & area tunggu aman dari tampias",
      mapsQuery: "SPBU Pertamina Soekarno Hatta Malang",
    },
    {
      id: "lw-3",
      name: "Indomaret Point Suhat",
      category: "Minimarket",
      distanceText: "± 550 m",
      note: "Teras depan lebar & bisa beli minuman hangat",
      mapsQuery: "Indomaret Point Soekarno Hatta Malang",
    },
  ],
  klojen: [
    {
      id: "kj-1",
      name: "Masjid Agung Jami Malang",
      category: "Masjid",
      distanceText: "± 350 m",
      note: "Serambi luas & parkir motor tertata di sisi alun-alun",
      mapsQuery: "Masjid Agung Jami Kota Malang",
    },
    {
      id: "kj-2",
      name: "SPBU Pertamina Rampal",
      category: "SPBU",
      distanceText: "± 900 m",
      note: "Area pengisian & selasar samping terlindung",
      mapsQuery: "SPBU Pertamina Rampal Malang",
    },
  ],
  batu: [
    {
      id: "bt-1",
      name: "Masjid Agung An-Nuur Batu",
      category: "Masjid",
      distanceText: "± 400 m",
      note: "Teduh dari angin dingin & hujan deras",
      mapsQuery: "Masjid Agung An-Nuur Kota Batu",
    },
    {
      id: "bt-2",
      name: "SPBU Pertamina Diponegoro Batu",
      category: "SPBU",
      distanceText: "± 650 m",
      note: "Jalur utama Malang–Batu, mudah akses keluar-masuk",
      mapsQuery: "SPBU Pertamina Diponegoro Kota Batu",
    },
  ],
  surabaya: [
    {
      id: "sb-1",
      name: "Masjid Nasional Al-Akbar",
      category: "Masjid",
      distanceText: "± 800 m",
      note: "Selasar luar sangat luas & aman untuk berteduh motor",
      mapsQuery: "Masjid Nasional Al-Akbar Surabaya",
    },
    {
      id: "sb-2",
      name: "SPBU Pertamina Ahmad Yani",
      category: "SPBU",
      distanceText: "± 500 m",
      note: "Tersedia minimarket & mushola di area SPBU",
      mapsQuery: "SPBU Pertamina Ahmad Yani Surabaya",
    },
  ],
};
