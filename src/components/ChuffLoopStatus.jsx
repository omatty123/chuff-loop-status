import { useState, useEffect } from 'react';

export default function ChuffLoopStatus() {
  const [activeLight, setActiveLight] = useState('green');
  const [statusText, setStatusText] = useState('SYSTEM: OPERATIONAL');
  const [defconLevel, setDefconLevel] = useState(3);
  const [defconInfo, setDefconInfo] = useState('Loading weather data...');

  // Fetch weather data and calculate DEFCON level
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Get the forecast URL for the location (44.2837, -88.3725 = ZIP 54911)
        const pointsResponse = await fetch('https://api.weather.gov/points/44.2837,-88.3725');
        if (!pointsResponse.ok) throw new Error('Failed to fetch location data');
        const pointsData = await pointsResponse.json();

        // Fetch the detailed forecast
        const forecastResponse = await fetch(pointsData.properties.forecast);
        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');
        const forecastData = await forecastResponse.json();

        // Get the current period's forecast
        const currentPeriod = forecastData.properties.periods[0];
        const detailedForecast = currentPeriod.detailedForecast.toLowerCase();
        const shortForecast = currentPeriod.shortForecast;

        // Calculate DEFCON level based on snow conditions
        let level = 3;
        let info = shortForecast;

        // Check for snow-related keywords and accumulation
        const hasSnow = detailedForecast.includes('snow');
        const hasBlizzard = detailedForecast.includes('blizzard');
        const hasIce = detailedForecast.includes('ice') || detailedForecast.includes('freezing rain');

        // Parse snow accumulation if mentioned
        const accumulationMatch = detailedForecast.match(/(\d+)\s*to\s*(\d+)\s*inch/i) ||
                                   detailedForecast.match(/(\d+)\s*inch/i);
        let maxAccumulation = 0;
        if (accumulationMatch) {
          maxAccumulation = parseInt(accumulationMatch[2] || accumulationMatch[1], 10);
        }

        // Parse snow chance if mentioned
        const chanceMatch = detailedForecast.match(/chance\s+of\s+(?:snow|precipitation)[^\d]*(\d+)/i) ||
                            detailedForecast.match(/(\d+)\s*percent\s+chance/i);
        let snowChance = 0;
        if (chanceMatch) {
          snowChance = parseInt(chanceMatch[1], 10);
        }

        // Determine DEFCON level
        if (hasBlizzard || maxAccumulation >= 6 || (hasSnow && hasIce)) {
          level = 1; // Maximum threat
          info = `${shortForecast} · ${maxAccumulation > 0 ? maxAccumulation + '"+ accumulation' : 'Severe conditions'}`;
        } else if (hasSnow && (maxAccumulation >= 2 || snowChance >= 50)) {
          level = 2; // Elevated threat
          info = `${snowChance > 0 ? snowChance + '% chance snow' : shortForecast}${maxAccumulation > 0 ? ', ' + maxAccumulation + '" possible' : ''}`;
        } else if (hasSnow || hasIce) {
          level = 2; // Elevated for any snow/ice mention
          info = shortForecast;
        } else {
          level = 3; // No threat
          info = shortForecast;
        }

        setDefconLevel(level);
        setDefconInfo(info);

      } catch (error) {
        console.error('Weather fetch error:', error);
        setDefconInfo('Unable to fetch weather data');
        setDefconLevel(3);
      }
    };

    // Fetch immediately and then every 30 minutes
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = (color, text) => {
    setActiveLight(color);
    setStatusText(text);
  };

  const getStatusColor = () => {
    if (activeLight === 'green') return '#00ff00';
    if (activeLight === 'yellow') return '#ffff00';
    return '#ff0000';
  };

  const getDefconClass = () => {
    if (defconLevel === 1) return 'text-red-500 animate-pulse';
    if (defconLevel === 2) return 'text-yellow-400 animate-pulse';
    return 'text-green-500';
  };

  const getDefconLabel = () => {
    if (defconLevel === 1) return 'MAXIMUM THREAT';
    if (defconLevel === 2) return 'ELEVATED THREAT';
    return 'NO THREAT';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-5 font-mono">
      {/* Main Status Container */}
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl text-center border-2 border-gray-700 mb-5">
        <h1 className="text-green-500 text-2xl font-bold mb-6 tracking-wider">CHUFF LOOP STATUS</h1>

        {/* Traffic Light */}
        <div className="bg-gray-950 p-5 rounded-full inline-block mb-5 border-4 border-gray-700">
          <div
            className={`w-16 h-16 rounded-full m-2 transition-all duration-300 ${
              activeLight === 'red'
                ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                : 'bg-gray-700 opacity-30'
            }`}
            style={activeLight === 'red' ? { animationDuration: '0.5s' } : {}}
          />
          <div
            className={`w-16 h-16 rounded-full m-2 transition-all duration-300 ${
              activeLight === 'yellow'
                ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse'
                : 'bg-gray-700 opacity-30'
            }`}
            style={activeLight === 'yellow' ? { animationDuration: '1s' } : {}}
          />
          <div
            className={`w-16 h-16 rounded-full m-2 transition-all duration-300 ${
              activeLight === 'green'
                ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse'
                : 'bg-gray-700 opacity-30'
            }`}
            style={activeLight === 'green' ? { animationDuration: '1.5s' } : {}}
          />
        </div>

        {/* Status Text */}
        <div
          className="text-2xl font-bold mb-5"
          style={{ color: getStatusColor() }}
        >
          {statusText}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => updateStatus('green', 'SYSTEM: OPERATIONAL')}
            className="px-6 py-3 bg-green-600 text-white font-bold uppercase rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => updateStatus('yellow', 'WARNING: NEEDS SHOVEL')}
            className="px-6 py-3 bg-yellow-500 text-black font-bold uppercase rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Slow
          </button>
          <button
            onClick={() => updateStatus('red', 'CRITICAL: SNOWED IN')}
            className="px-6 py-3 bg-red-600 text-white font-bold uppercase rounded-lg hover:bg-red-700 transition-colors"
          >
            Closed
          </button>
        </div>
      </div>

      {/* DEFCON Container */}
      <div className="bg-gray-800/80 px-6 py-4 rounded-xl text-center border border-gray-700">
        <div className="text-xs text-gray-500 tracking-widest mb-2">OPERATIONAL THREAT</div>
        <div className={`text-3xl font-bold ${getDefconClass()}`}>
          DEFCON {defconLevel}
        </div>
        <div className="text-xs text-gray-400 mt-1">{getDefconLabel()}</div>
        <div className="text-xs text-gray-400 mt-2">{defconInfo}</div>
        <a
          href="https://forecast.weather.gov/MapClick.php?lat=44.2837&lon=-88.3725"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline mt-2 inline-block"
        >
          NWS 54911 →
        </a>
      </div>
    </div>
  );
}
