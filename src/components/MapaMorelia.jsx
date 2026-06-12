import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Geographic coordinates for Morelia's key institutions
export const UNIVERSIDADES = [
  { 
    id: 'cu',
    nombre: "Ciudad Universitaria (UMSNH)", 
    lat: 19.6925, 
    lng: -101.1994, 
    icono: "🎓", 
    desc: "Sede principal de la Universidad Michoacana (San Nicolás de Hidalgo)" 
  },
  { 
    id: 'medicina',
    nombre: "Facultad de Medicina y Odontología (UMSNH)", 
    lat: 19.6990, 
    lng: -101.1852, 
    icono: "🏥", 
    desc: "Área de la salud UMSNH (Av. Ventura Puente)" 
  },
  { 
    id: 'unam',
    nombre: "Campus UNAM Morelia", 
    lat: 19.6496, 
    lng: -101.2238, 
    icono: "🏫", 
    desc: "Campus de investigación y licenciaturas de la UNAM en Morelia" 
  },
  { 
    id: 'itm',
    nombre: "Instituto Tecnológico de Morelia (ITM)", 
    lat: 19.7226, 
    lng: -101.1858, 
    icono: "🔬", 
    desc: "Campus principal del Chato Naranjo (Salida a Salamanca)" 
  },
  { 
    id: 'uvaq',
    nombre: "Universidad Vasco de Quiroga (UVAQ)", 
    lat: 19.6644, 
    lng: -101.1517, 
    icono: "⛪", 
    desc: "Campus principal UVAQ en zona Altozano" 
  },
  { 
    id: 'tec',
    nombre: "Tec de Monterrey (ITESM)", 
    lat: 19.6631, 
    lng: -101.1444, 
    icono: "💻", 
    desc: "Campus Morelia en zona Altozano" 
  },
  { 
    id: 'derecho',
    nombre: "Facultad de Derecho (UMSNH)", 
    lat: 19.7042, 
    lng: -101.1947, 
    icono: "⚖️", 
    desc: "Histórica Facultad de Derecho UMSNH en el Centro Histórico" 
  }
];

// Haversine formula to compute distance in kilometers
export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapaMorelia({ 
  propiedades, 
  selectedProperty, 
  onSelectProperty, 
  selectedUniId,
  highlightedPropertyId
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const pathGroupRef = useRef(null);
  
  // Clean up and initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Centered on Morelia Centro
      const map = L.map(mapContainerRef.current, {
        zoomControl: false // custom zoom control placement
      }).setView([19.6925, -101.1994], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);
      
      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
      pathGroupRef.current = L.layerGroup().addTo(map);
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Register click callback in window so that the popup can trigger it
  useEffect(() => {
    window.handleVerPropiedadDesdeMapa = (id) => {
      const prop = propiedades.find(p => p.id === Number(id));
      if (prop && onSelectProperty) {
        onSelectProperty(prop);
      }
    };
    return () => {
      delete window.handleVerPropiedadDesdeMapa;
    };
  }, [propiedades, onSelectProperty]);
  
  // Fly to selected property if it changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedProperty) {
      mapInstanceRef.current.flyTo([selectedProperty.lat, selectedProperty.lng], 15, {
        duration: 1.5
      });
    }
  }, [selectedProperty]);
  
  // Update markers, paths, and overlays when properties or selected uni changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !pathGroupRef.current) return;
    
    // Clear all previous markers and lines
    markersGroupRef.current.clearLayers();
    pathGroupRef.current.clearLayers();
    
    const map = mapInstanceRef.current;
    const selectedUni = UNIVERSIDADES.find(u => u.id === selectedUniId);
    
    // 1. Draw Selected University marker and its walking distance radius circle
    if (selectedUni) {
      // Draw a 1 km (approx 10 min walking) and 2 km circle around the university
      L.circle([selectedUni.lat, selectedUni.lng], {
        radius: 1000,
        color: '#6366f1',
        fillColor: '#6366f1',
        fillOpacity: 0.1,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(pathGroupRef.current);

      // Main university marker
      const uniMarker = L.marker([selectedUni.lat, selectedUni.lng], {
        icon: L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white shadow-xl border-2 border-white text-lg font-bold z-10 transform scale-110">
                ${selectedUni.icono}
              </div>
            </div>
          `,
          className: 'custom-uni-marker-selected',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(markersGroupRef.current);
      
      uniMarker.bindPopup(`
        <div class="p-2 min-w-[150px]">
          <h4 class="font-bold text-gray-800 text-sm">${selectedUni.nombre}</h4>
          <p class="text-xs text-gray-500 mt-1">${selectedUni.desc}</p>
          <div class="mt-2 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">
            🔵 Radio de 1 km (Cercanía Caminando)
          </div>
        </div>
      `);
    }
    
    // Draw all universities as smaller markers
    UNIVERSIDADES.forEach(u => {
      // If it's the currently selected university, we already drew it with special highlight
      if (selectedUni && u.id === selectedUniId) return;
      
      const uniMarker = L.marker([u.lat, u.lng], {
        icon: L.divIcon({
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white shadow-md border border-white text-sm transform hover:scale-110 hover:bg-indigo-500 transition-all cursor-pointer">
              ${u.icono}
            </div>
          `,
          className: 'custom-uni-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(markersGroupRef.current);
      
      uniMarker.bindPopup(`
        <div class="p-2 min-w-[150px]">
          <h4 class="font-bold text-gray-800 text-sm">${u.nombre}</h4>
          <p class="text-xs text-gray-500 mt-1">${u.desc}</p>
        </div>
      `);
    });
    
    // 2. Draw Property Markers (with price tags)
    propiedades.forEach(p => {
      const isHighlighted = highlightedPropertyId === p.id;
      const isSelected = selectedProperty && selectedProperty.id === p.id;
      
      // Calculate distance to selected university
      let distText = '';
      let distanceKm = 0;
      if (selectedUni) {
        distanceKm = calcularDistancia(p.lat, p.lng, selectedUni.lat, selectedUni.lng);
        distText = distanceKm < 1 
          ? `A ${(distanceKm * 1000).toFixed(0)} m de la escuela`
          : `A ${distanceKm.toFixed(2)} km de la escuela`;
      }
      
      // Style logic
      let markerBg = 'bg-blue-600';
      let border = 'border-white';
      if (p.isVerified) {
        markerBg = 'bg-emerald-600';
      }
      if (isHighlighted || isSelected) {
        markerBg = p.isVerified ? 'bg-emerald-500 ring-4 ring-emerald-200' : 'bg-blue-500 ring-4 ring-blue-200';
      }
      
      const priceText = p.precio >= 1000 
        ? `$${(p.precio / 1000).toFixed(1)}k`
        : `$${p.precio}`;
        
      const propMarker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          html: `
            <div class="flex items-center justify-center px-2 py-1 rounded-full ${markerBg} ${border} border text-white text-[11px] font-extrabold shadow-lg whitespace-nowrap cursor-pointer transition-all duration-150 transform hover:scale-110">
              ${p.isVerified ? '🛡️ ' : ''}${priceText}
            </div>
          `,
          className: 'custom-prop-price-tag',
          iconSize: [60, 24],
          iconAnchor: [30, 12]
        })
      }).addTo(markersGroupRef.current);
      
      // Draw connection line if selected and there is a selected university
      if (selectedUni && (isSelected || isHighlighted)) {
        L.polyline([[selectedUni.lat, selectedUni.lng], [p.lat, p.lng]], {
          color: p.isVerified ? '#10b981' : '#3b82f6',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.8
        }).addTo(pathGroupRef.current);
      }
      
      // Popup HTML content with dynamic distance calculation
      propMarker.bindPopup(`
        <div class="p-2 space-y-2 font-sans w-52">
          ${p.imagenes?.[0] ? `
            <img src="${p.imagenes[0]}" alt="${p.titulo}" class="w-full h-20 object-cover rounded-md mb-1" />
          ` : ''}
          <h4 class="font-bold text-gray-800 text-xs leading-tight line-clamp-2">${p.titulo}</h4>
          <p class="text-[10px] text-gray-500">${p.tipo} • ${p.zona}</p>
          
          ${selectedUni ? `
            <div class="bg-indigo-50 border border-indigo-100 rounded-md p-1.5 text-[10px] text-indigo-700 font-medium flex items-center gap-1">
              <span>📍</span> <span>${distText}</span>
            </div>
          ` : ''}
          
          <div class="flex items-center justify-between pt-1">
            <span class="font-extrabold text-indigo-600 text-xs">$${p.precio.toLocaleString('es-MX')} / mes</span>
            ${p.isVerified ? '<span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Verificado</span>' : ''}
          </div>
          
          <button 
            onclick="window.handleVerPropiedadDesdeMapa(${p.id})" 
            class="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-2 rounded-md transition-colors shadow-sm"
          >
            Ver Detalles Completo
          </button>
        </div>
      `);
    });
    
    // Fit map bounds to show university and property if both are selected
    if (selectedUni && selectedProperty) {
      const bounds = L.latLngBounds([
        [selectedUni.lat, selectedUni.lng],
        [selectedProperty.lat, selectedProperty.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
  }, [propiedades, selectedUniId, selectedProperty, highlightedPropertyId]);
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '380px' }} />
      
      {/* Small floating map guide legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] text-gray-600 shadow-md border border-gray-100 space-y-1.5 pointer-events-none z-[1000]">
        <h5 className="font-bold text-gray-800 text-xs">Mapa de Morelia</h5>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-400"></span>
          <span>Arrendador Verificado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded bg-blue-600 border border-blue-400"></span>
          <span>Arrendador Estándar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🎓</span>
          <span>Escuela / Universidad</span>
        </div>
        {selectedUniId && (
          <div className="pt-1 border-t border-gray-100 flex items-center gap-1 text-indigo-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
            <span>Distancia a Escuela Activa</span>
          </div>
        )}
      </div>
    </div>
  );
}
