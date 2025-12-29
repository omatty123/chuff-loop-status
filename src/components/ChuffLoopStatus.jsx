import { useState } from 'react';

export default function ChuffLoopStatus() {
  const [activeLight, setActiveLight] = useState('green');
  const [statusText, setStatusText] = useState('SYSTEM: OPERATIONAL');

  const defconLevel = 2;
  const defconInfo = '50% chance snow, <0.5" · Blowing snow til 4pm';

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
