import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in leaflet with webpack/vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapLocationPickerProps {
  location: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 }; // Cairo

function LocationMarker({ location, onLocationSelect }: MapLocationPickerProps) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        onLocationSelect(latlng.lat, latlng.lng);
      }
    },
  };

  return location === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={location}
      ref={markerRef}
    />
  );
}

export default function MapLocationPicker({ location, onLocationSelect }: MapLocationPickerProps) {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  
  useEffect(() => {
    if (!location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setCenter({ lat, lng });
            onLocationSelect(lat, lng);
          },
          () => {
            // Permission denied or error, keep default
            onLocationSelect(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
          }
        );
      } else {
        onLocationSelect(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
      }
    }
  }, []);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer 
        center={location || center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker location={location || center} onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-gray-100 z-[400] text-xs font-medium text-gray-700 pointer-events-none">
        Drag marker or tap map
      </div>
    </div>
  );
}
