import react, { useState, useEffect } from "react"
import WeatherBackground from "./components/WeatherBackground"
import { convertTemperature, getHumidityValue, getWindDirection, getVisibilityValue } from "./components/Helper"
import { WindIcon, HumidityIcon, VisibilityIcon, SunriseIcon, SunsetIcon } from "./components/Icons"


function App() {

  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('')
  const [suggestion, setSuggestion] = useState([])
  const [unit, setUnit] = useState('C')
  const [error, setError] = useState('')

  const API_KEY = '0f2469fdda2a6106f889ed69e59fe0a9'

  useEffect(() => {
  // (city.trim().length >= 3) Input minimal 3 huruf baru cari saran
  // (&& !weather) Hanya cari saran kalau belum ada data cuaca tampil
    if(city.trim().length >= 3 && !weather) {
      const timer = setTimeout(async () => fetchSuggestions(city), 500);
    // Setiap kali 'city' berubah lagi sebelum 500ms → timer lama dihapus, timer baru dibuat. Ini yang membuat debounce bekerja.
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  // function ini akan mengambil saran berdasarkan input kota dan memperbarui state suggestion.
  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
      response.ok ? setSuggestion(await response.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
    }
  }

  // ini akan mengambil data cuaca berdasarkan URL yang diberikan.
  const fetchWeatherData = async (url,name = '') => {
  // Bersihkan error & data lama dulu supaya UI tidak menampilkan data kota sebelumnya.
    setError('');
    setWeather(null);
    try {
      const response = await fetch(url);
      if(!response.ok) throw new Error((await response.json()).message || 'City not found')
      const data = await response.json();
    // simpan data cuaca
      setWeather(data);
    // simpan nama kota
      setCity(name || data.name);
    // tutup dropdown
      setSuggestion([]);
    } catch (error) {
      setError(error.message);
    }
  }

  // function ini mencegah pengajuan, memvalidasi city, dan mengambil data melalui API.
  const handleSearch = async (e) => {
  // mencegah halaman refresh, jadi React bisa handle sendiri tanpa reload.
    e.preventDefault()
    if(!city.trim()) return setError('Please enter a city or country name');
    await fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`)
  }

  // function ini memeriksa apakah suatu objek ada dan mengembalikannya.
  const getWeatherCondition = () => weather && ({
    main: weather.weather[0].main,
    isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset
  })

  return (
    <div className="min-h-screen">
      {/* background dinamis, dapat kondisi cuaca dari getWeatherCondition() */}
      <WeatherBackground condition={getWeatherCondition()} />

      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-6">
          Weather App
        </h1>

        {/* jika belum ada data cuaca → tampil form
            jika sudah ada data cuaca → tampil hasil */}
        {!weather ? (
          <form onSubmit={handleSearch} className="flex flex-col relative">

            {/* input kota, onChange update state city setiap ketikan */}
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city or country (min 3 letters)" 
            className="mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white 
            focus:outline-none focus:border-blue-300 transition duration-300"/>

            {/* dropdown suggestion, muncul jika suggestion.length > 0
                klik suggestion → fetchWeatherData pakai koordinat lat/lon */}
            {suggestion.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10">
                {suggestion.map((s) => (

                  // submit form → panggil handleSearch
                  <button type="button" key={`${s.lat}-${s.lon}`}
                  onClick={() => fetchWeatherData(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`
                    `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ''}`
                  )} className="block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors">
                    {s.name}, {s.country}{s.state && `, ${s.state}`}
                  </button>
                ))}
              </div>
            )}
            <button type="submit" className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
              Get Weather
            </button>
          </form>
        ): (
          <div className="mt-6 text-center transition-opacity duration-500">
            <button onClick={() => {setWeather(null); setCity('')}}
              className="mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors">
              Search Another City
            </button>
            <div className="flex items-center justify-between">
              {/* nama kota + tombol toggle satuan C/F */}
              <h2 className="text-3xl font-bold">
                {weather.name}
              </h2>
              <button onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors">
                &deg;{unit}
              </button>
            </div>

            {/* icon cuaca dari OpenWeatherMap CDN + animasi bounce */}
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}
            className="mx-auto my-4 animate-bounce"/>
            {/* suhu + deskripsi cuaca */}
            <p className="text-4xl">
              {convertTemperature(weather.main.temp, unit)}&deg;{unit}
            </p>
            <p className="capitalize">
              {weather.weather[0].description}
            </p>

            {/* array of array → [Icon, label, value]
               .map() → render tiap item sebaris: Icon + Label + Value */}
            <div className="flex flex-wrap justify-center mt-6">
              {[
                [HumidityIcon, 'Humidity', `${weather.main.humidity}% 
                (${getHumidityValue(weather.main.humidity)})`],

                [WindIcon, 'Wind', `${weather.wind.speed} m/s ${weather.wind.deg ?
                  `(${getWindDirection(weather.main.humidity)})` : ''}`],
              

                [VisibilityIcon, 'Visibility', getVisibilityValue(weather.visibility)]
                
              ].map(([Icon, label, value]) => (
                <div key={label} className="flex flex-col items-center m-2 p-2">
                  <Icon/>
                  <p className="mt-1 font-semibold">
                    {label}
                  </p>
                  <p className="text-sm">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* unix timestamp × 1000 → konversi ke jam (format HH:MM)
                contoh: 1234567890 × 1000 → "07:32" */}
            <div className="flex flex-wrap justify-around mt-6">
              {[
                [SunriseIcon, 'Sunrise', weather.sys.sunrise],
                [SunsetIcon, 'Sunset', weather.sys.sunset]
              ].map(([Icon, label, time]) => (
                <div key={label} className="flex flex-col items-center m-2">
                  <Icon/>
                  <p className="mt-1 font-semibold">
                    {label}
                  </p>
                  <p className="text-sm">
                    {new Date(time * 1000).toLocaleTimeString('en-GB',
                      {hour: '2-digit', minute: '2-digit'}
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* info tambahan di bawah */}
            <div className="mt-6 text-sm">
              <p><strong>Feels Like:</strong>{convertTemperature(weather.main.feels_like, unit)} &deg;{unit}</p>
              <p><strong>Pressure:</strong>{weather.main.pressure} hPa</p>
            </div>
          </div>
        )}

        {/* tampil jika ada error (kota tidak ditemukan, dll) */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default App
