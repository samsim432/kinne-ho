import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

// Fix Leaflet default icon path issue in React
const customMarkerIcon = new L.DivIcon({
  className: 'custom-pin',
  html: `<div style="background-color: #1b7a53; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(27,122,83,0.4); border: 2px solid white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

interface LocationMarkerProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  onLocationSelect: (addressHint: string) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      map.flyTo(e.latlng, map.getZoom());
      onLocationSelect(`Pinned Location (${newPos[0].toFixed(4)}, ${newPos[1].toFixed(4)})`);
    },
  });

  return position ? <Marker position={position} icon={customMarkerIcon} /> : null;
};

interface DeliveryMapPickerProps {
  onSelectCoordinates: (lat: number, lng: number, label: string) => void;
}

export const DeliveryMapPicker: React.FC<DeliveryMapPickerProps> = ({ onSelectCoordinates }) => {
  // Default coordinates: Kathmandu City Center (27.7172, 85.3240)
  const [position, setPosition] = useState<[number, number]>([27.7172, 85.3240]);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setIsLocating(false);
        onSelectCoordinates(coords[0], coords[1], 'Current GPS Location (Kathmandu)');
      },
      () => {
        setIsLocating(false);
        alert('Could not retrieve your GPS location. Please tap directly on the map.');
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#1b7a53]" />
          <span>Pin Delivery Point on Map</span>
        </label>
        
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="text-xs font-bold text-[#1b7a53] hover:text-[#156343] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
        >
          <Navigation className="w-3 h-3" />
          <span>{isLocating ? 'Locating...' : 'Use Current GPS'}</span>
        </button>
      </div>

      <div className="h-56 w-full rounded-2xl overflow-hidden border border-gray-200 relative z-0 shadow-2xs">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationSelect={(hint) => onSelectCoordinates(position[0], position[1], hint)}
          />
        </MapContainer>
      </div>

      <p className="text-[11px] text-gray-400">
        💡 Tap anywhere on the map to place the delivery pin for courier / seller drop-off.
      </p>
    </div>
  );
};