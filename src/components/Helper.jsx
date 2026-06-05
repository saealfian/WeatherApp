
// mengubah derajat angin → arah mata angin
// contoh: 90° → 'E', 180° → 'S'
export const getWindDirection = (deg) => {

    if (deg > 337.5 || deg <= 22.5) return 'N';
    if (deg > 22.5 && deg <= 67.5) return 'NE';
    if (deg > 67.5 && deg <= 112.5) return 'E';
    if (deg > 112.5 && deg <= 157.5) return 'SE';
    if (deg > 157.5 && deg <= 202.5) return 'S';
    if (deg > 202.5 && deg <= 247.5) return 'SW';
    if (deg > 247.5 && deg <= 292.5) return 'W';
    if (deg > 292.5 && deg <= 337.5) return 'NW';
};

// mengubah angka kelembapan → kategori teks
// contoh: 98% → 'High', 33% → 'Moderate', 20% → 'Low'
export const getHumidityValue = (humidity) => {
    if (humidity < 30) return 'Low';
    if (humidity < 60) return 'Moderate';
    return 'High';
};

// mengubah visibilitas dari meter → kilometer (1 desimal)
// contoh: 8100m → '8.1 km', 10000m → '10.0 km'
export const getVisibilityValue = (visibility) => {
    const km = visibility / 1000;
    return `${km.toFixed(1)} km`;
};

// mengkonversi suhu Celsius → Fahrenheit jika unit = 'F'
// contoh: 24°C → '75.2' (F), 24°C → '24.0' (C)
export const convertTemperature = (temp, unit) => {
    if (unit === 'F') {
        return (temp * 9 / 5 + 32).toFixed(1);
    }
    return temp.toFixed(1);
};