import React, { useState } from 'react';
import { MapPin, Navigation, Crosshair, Check } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

const NEPAL_LANDMARKS = [
  { name: 'New Baneshwor Chowk', city: 'Kathmandu', lat: 27.6915, lng: 85.3420 },
  { name: 'Maitighar Mandala', city: 'Kathmandu', lat: 27.6938, lng: 85.3217 },
  { name: 'Patan Durbar Square', city: 'Lalitpur', lat: 27.6727, lng: 85.3253 },
  { name: 'Suryabinayak Chowk', city: 'Bhaktapur', lat: 27.6667, lng: 85.4286 },
  { name: 'Lakeside Center', city: 'Pokhara', lat: 28.2096, lng: 83.9595 },
];

export const DeliveryMapPicker: React.FC = () => {
  const { showToast } = useMarketplace();
  const [selectedPin, setSelectedPin] = useState(NEPAL_LANDMARKS[0]);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation Unsupported', 'Your browser does not support GPS location.', 'warning');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const customPin = {
          name: 'Current Device Location',
          city: 'Kathmandu Valley (GPS)',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        };
        setSelectedPin(customPin);
        showToast('GPS Location Locked! 📍', `Coordinates: ${customPin.lat}, ${customPin.lng}`, 'success');
      },
      () => {
        setIsLocating(false);
        showToast('Location Permission Denied', 'Please select a popular meeting chowk below.', 'info');
      }
    );
  };

  return (
    <div className="space-y-3">
      {/* Map Mock Simulation Box */}
      <div className="relative h-44 w-full bg-emerald-950/90 rounded-2xl overflow-hidden border border-gray-200 flex flex-col justify-between p-4 text-white shadow-inner">
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedPin.lat}, {selectedPin.lng}</span>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="bg-white text-gray-900 hover:bg-emerald-50 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#1b7a53] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : 'My GPS Location'}</span>
          </button>
        </div>

        {/* Center Target Pin */}
        <div className="relative z-10 self-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Crosshair className="w-4 h-4" />
          </div>
          <span className="bg-black/70 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 backdrop-blur-xs">
            {selectedPin.name}
          </span>
        </div>

        <div className="relative z-10 text-[10px] text-gray-300 bg-black/40 px-2.5 py-1 rounded-lg w-fit backdrop-blur-xs">
          Area: {selectedPin.city} • Verified Handshake Zone
        </div>
      </div>

      {/* Preset Landmark Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
          Quick Landmark Meeting Points
        </span>
        <div className="flex flex-wrap gap-1.5">
          {NEPAL_LANDMARKS.map((lm) => (
            <button
              key={lm.name}
              type="button"
              onClick={() => setSelectedPin(lm)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedPin.name === lm.name
                  ? 'bg-[#1b7a53] text-white shadow-2xs'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {selectedPin.name === lm.name && <Check className="w-3 h-3" />}
              <span>{lm.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};