import React from 'react';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';
import visibilityIcon from '../assets/visibility.png';
import sunriseIcon from '../assets/sunrise.png';
import sunsetIcon from '../assets/Sunset.png';

// Icon = template dasar reusable untuk semua icon
// menerima 3 props: src (gambar), alt (teks), className (animasi)
const Icon = ({src, alt, className}) => (
    // h-8 w-8 = ukuran 32x32px, inline-block = sebaris dengan teks
    <img src={src} alt={alt} className={`h-8 w-8 inline-block ${className}`} />
)

// masing-masing icon sudah dikonfigurasi src & animasinya
// export = agar bisa diimport di App.jsx
export const WindIcon = () => <Icon src={windIcon} alt="Wind" className="animate-icon svg-hover"/>;
export const HumidityIcon = () => <Icon src={humidityIcon} alt="Humidity" className="powerfull-pulse svg-hover"/>;
export const VisibilityIcon = () => <Icon src={visibilityIcon} alt="Visibility" className="powerfull-pulse svg-hover"/>;
export const SunriseIcon = () => <Icon src={sunriseIcon} alt="Sunrise" className="powerfull-pulse svg-hover"/>;
export const SunsetIcon = () => <Icon src={sunsetIcon} alt="Sunset" className="powerfull-pulse svg-hover"/>;
