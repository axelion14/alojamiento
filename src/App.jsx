import { useState, useMemo, useEffect } from 'react'
import propiedades from './data/propiedades.json'
import MapaMorelia, { UNIVERSIDADES, calcularDistancia } from './components/MapaMorelia'

// Geolocation reference map for Morelia zones
const coordinatesMap = {
  'Felicitas del Río': { lat: 19.6945, lng: -101.2035 },
  'Cuauhtémoc': { lat: 19.7020, lng: -101.1810 },
  'Centro': { lat: 19.7027, lng: -101.1923 },
  'Altozano': { lat: 19.6630, lng: -101.1500 },
  'Ventura Puente': { lat: 19.6980, lng: -101.1840 },
  'Chapultepec': { lat: 19.6980, lng: -101.1710 },
  'Lomas de Morelia': { lat: 19.7140, lng: -101.1490 },
  'Jacarandas': { lat: 19.7160, lng: -101.2180 },
  'Campestre': { lat: 19.6890, lng: -101.1770 },
  'Tres Marías': { lat: 19.7120, lng: -101.1180 },
  'Miguel Hidalgo': { lat: 19.7090, lng: -101.2190 },
  'Lomas del Valle': { lat: 19.6860, lng: -101.2190 },
  'Villas del Pedregal': { lat: 19.7010, lng: -101.2770 },
  'Santiaguito': { lat: 19.7220, lng: -101.1970 },
  'Bosques de Morelia': { lat: 19.6830, lng: -101.2380 },
  'La Paloma': { lat: 19.6840, lng: -101.1920 },
  'Torreón Nuevo': { lat: 19.7350, lng: -101.2010 },
  'Manantiales': { lat: 19.7110, lng: -101.2320 },
  'Vista Bella': { lat: 19.6810, lng: -101.1950 },
  'Las Américas': { lat: 19.6930, lng: -101.1640 },
  'Fray Antonio de Lisboa': { lat: 19.7235, lng: -101.1880 },
  'Universidad': { lat: 19.6885, lng: -101.2045 },
  'San Juanito Itzícuaro': { lat: 19.6960, lng: -101.2610 }
};

function normalize(str) {
  return str.toLowerCase().trim()
}

function Navbar({ busqueda, onBusquedaChange, usuario, abrirAuth, abrirPublicar, cerrarSesion }) {
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 text-xl font-extrabold text-indigo-900 shrink-0 tracking-tight">
          <span className="text-3xl filter drop-shadow">🏠</span>
          <span className="hidden sm:inline bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">ViviendaMorelia</span>
        </a>
        
        {/* Search input */}
        <div className="flex items-center gap-2 bg-gray-100/80 hover:bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white rounded-xl px-3 py-2 w-full max-w-xs md:max-w-md transition-all duration-200">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar alojamiento..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="bg-transparent outline-none w-full text-xs md:text-sm text-gray-700 placeholder-gray-400"
          />
          {busqueda && (
            <button onClick={() => onBusquedaChange('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>

        {/* Auth status & actions */}
        <div className="flex items-center gap-2">
          {usuario ? (
            <div className="flex items-center gap-2">
              {/* User badge */}
              <div className="hidden xs:flex flex-col text-right">
                <span className="text-xs font-bold text-gray-800">{usuario.nombre}</span>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase">{usuario.rol === 'arrendador' ? '🔑 Propietario' : '🎓 Estudiante'}</span>
              </div>
              
              {usuario.rol === 'arrendador' && (
                <button
                  onClick={abrirPublicar}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  <span>➕</span> Publicar
                </button>
              )}
              
              <button
                onClick={cerrarSesion}
                className="text-gray-450 hover:text-rose-600 p-2 text-xs font-bold transition-all rounded-lg hover:bg-rose-50"
                title="Cerrar sesión"
              >
                Salir ✕
              </button>
            </div>
          ) : (
            <button
              onClick={abrirAuth}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs md:text-sm py-2 px-3 md:px-4 rounded-xl border border-indigo-200 transition-all active:scale-95 whitespace-nowrap"
            >
              <span>👤</span> Iniciar Sesión / Registrarse
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function Sidebar({
  precioMax, onPrecioMaxChange,
  genero, onGeneroChange,
  zona, onZonaChange,
  tipo, onTipoChange,
  serviciosSel, onServiciosChange,
  zonas, tipos, servicios,
  onLimpiar, hayFiltros,
  sidebarAbierto, cerrarSidebar,
  selectedUniId, onUniChange
}) {
  function toggleServicio(s) {
    if (serviciosSel.includes(s)) {
      onServiciosChange(serviciosSel.filter((x) => x !== s))
    } else {
      onServiciosChange([...serviciosSel, s])
    }
  }

  const selectedUni = UNIVERSIDADES.find(u => u.id === selectedUniId);

  const panel = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span className="text-indigo-500">⚙️</span> Filtros de Búsqueda
        </h2>
        <button
          onClick={cerrarSidebar}
          className="md:hidden w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full text-sm"
        >
          ✕
        </button>
      </div>

      {/* 2. GEOGRAPHICAL REFERENCE FILTER */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <span>🎓</span> Proximidad a tu Escuela
        </label>
        <select
          value={selectedUniId}
          onChange={(e) => onUniChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white hover:border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer font-medium"
        >
          <option value="">-- No calcular cercanía --</option>
          {UNIVERSIDADES.map((u) => (
            <option key={u.id} value={u.id}>
              {u.icono} {u.nombre}
            </option>
          ))}
        </select>
        {selectedUni && (
          <p className="text-xs text-indigo-600 mt-1.5 font-medium leading-normal bg-indigo-50 p-2 rounded-lg border border-indigo-100">
            💡 Se calculará la distancia y ruta visual en el mapa interactivo a: <strong>{selectedUni.nombre}</strong>.
          </p>
        )}
      </div>

      {/* 1. BUDGET FILTER */}
      <div>
        <label className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
          <span className="flex items-center gap-1">💰 Precio máximo</span>
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-indigo-100">
            ${precioMax.toLocaleString('es-MX')} MXN
          </span>
        </label>
        <input
          type="range"
          min={1000}
          max={12000}
          step={500}
          value={precioMax}
          onChange={(e) => onPrecioMaxChange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
          <span>$1,000</span>
          <span>$12,000</span>
        </div>
      </div>

      {/* 1. GENDER FILTER */}
      <div>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <span>👤</span> Género Permitido
        </span>
        <div className="grid grid-cols-2 gap-2">
          {['Todos', 'Hombre', 'Mujer', 'Mixto'].map((g) => (
            <label 
              key={g} 
              className={`
                flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer select-none transition-all
                ${genero === g 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-50' 
                  : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                }
              `}
            >
              <input
                type="radio"
                name="genero"
                value={g}
                checked={genero === g}
                onChange={() => onGeneroChange(g)}
                className="sr-only"
              />
              <span>
                {g === 'Todos' && '🌍'}
                {g === 'Hombre' && '👦'}
                {g === 'Mujer' && '👧'}
                {g === 'Mixto' && '👫'}
              </span>
              {g}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <span>📍</span> Zona de Morelia
        </span>
        <select
          value={zona}
          onChange={(e) => onZonaChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white hover:border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        >
          {zonas.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <span>🏘️</span> Tipo de Alojamiento
        </span>
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white hover:border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        >
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* 1. SERVICES FILTER */}
      <div>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <span>🔧</span> Servicios Incluidos
        </span>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {servicios.map((s) => {
            const isChecked = serviciosSel.includes(s);
            return (
              <label 
                key={s} 
                className={`
                  flex items-center gap-1.5 p-2 rounded-lg text-xs border cursor-pointer transition-all select-none
                  ${isChecked 
                    ? 'bg-indigo-50/50 text-indigo-700 border-indigo-200' 
                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleServicio(s)}
                  className="accent-indigo-600 rounded"
                />
                <span className="truncate">{s}</span>
              </label>
            )
          })}
        </div>
      </div>

      {hayFiltros && (
        <button
          onClick={onLimpiar}
          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2.5 px-4 rounded-xl border border-rose-200 transition-colors"
        >
          **Limpiar Filtros**
        </button>
      )}
    </div>
  )

  return (
    <>
      <div className="hidden md:block w-72 shrink-0 md:sticky md:top-24 md:self-start">
        {panel}
      </div>

      {sidebarAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={cerrarSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-out
          md:hidden shadow-2xl
          ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {panel}
      </aside>
    </>
  )
}

function PropertyCard({ propiedad, onSelect, selectedUni, onHover, isHighlighted }) {
  const badgeColor =
    propiedad.genero === 'Solo Mujeres'
      ? 'bg-pink-100 text-pink-700'
      : propiedad.genero === 'Solo Hombres'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700'

  const distanciaText = useMemo(() => {
    if (!selectedUni) return null;
    const d = calcularDistancia(propiedad.lat, propiedad.lng, selectedUni.lat, selectedUni.lng);
    return d < 1 
      ? `A ${(d * 1000).toFixed(0)} m de ${selectedUni.nombre.split(' ')[0]}`
      : `A ${d.toFixed(1)} km de ${selectedUni.nombre.split(' ')[0]}`;
  }, [propiedad.lat, propiedad.lng, selectedUni]);

  const isApartado = propiedad.status === 'apartado';

  return (
    <article
      onClick={() => onSelect(propiedad)}
      onMouseEnter={() => onHover && onHover(propiedad.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`
        bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col relative
        ${isHighlighted ? 'ring-2 ring-indigo-500 border-indigo-300' : 'border-gray-150'}
        ${isApartado ? 'opacity-65 grayscale bg-slate-50' : ''}
      `}
    >
      {isApartado && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 z-10 bg-rose-600/90 text-white font-extrabold px-4 py-2 rounded-xl border-2 border-white shadow-2xl tracking-widest text-sm uppercase">
          🔒 Reservado
        </div>
      )}

      <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
        {propiedad.imagenes?.[0] ? (
          <img
            src={propiedad.imagenes[0]}
            alt={propiedad.titulo}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl">🏠</span>
        )}
        
        <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm ${badgeColor}`}>
          {propiedad.genero}
        </span>

        {/* Landlord verification badge */}
        {propiedad.isVerified && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold bg-emerald-600 text-white px-2 py-1 rounded-full shadow-md">
            <span>🛡️</span> Verificado
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-indigo-900">
              ${propiedad.precio.toLocaleString('es-MX')}
              <span className="text-xs text-gray-500 font-normal">/mes</span>
            </span>
          </div>
          
          <h3 className="font-bold text-gray-800 leading-tight text-sm line-clamp-2">
            {propiedad.titulo}
          </h3>
          
          <p className="text-xs text-gray-400 font-medium">
            {propiedad.zona} • {propiedad.tipo}
          </p>

          {distanciaText && (
            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-[10px] font-bold mt-1.5">
              <span>📍</span>
              <span className="truncate">{distanciaText}</span>
            </div>
          )}
        </div>

        {propiedad.servicios?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-gray-50">
            {propiedad.servicios.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                {s}
              </span>
            ))}
            {propiedad.servicios.length > 3 && (
              <span className="text-[9px] text-gray-400 font-bold">+{propiedad.servicios.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function PropertyGrid({ propiedades, onSelect, onLimpiar, selectedUni, onHover, highlightedId, apartadasOcultasCount }) {
  if (propiedades.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <span className="text-6xl mb-4">🏚️</span>
        <p className="text-lg font-bold text-gray-600">No hay alojamientos que coincidan</p>
        <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros de tu búsqueda.</p>
        <button
          onClick={onLimpiar}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl mt-5 shadow-md shadow-indigo-100 transition-colors"
        >
          🧹 Limpiar todos los filtros
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col space-y-4">
      {apartadasOcultasCount > 0 && (
        <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-2.5 text-xs text-indigo-800 font-medium">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>
              <strong>Filtro Preventivo Activo:</strong> Se ocultaron automáticamente <strong>{apartadasOcultasCount} propiedades</strong> que ya han sido apartadas, evitando falsas expectativas.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {propiedades.map((p) => (
          <PropertyCard 
            key={p.id} 
            propiedad={p} 
            onSelect={onSelect} 
            selectedUni={selectedUni} 
            onHover={onHover}
            isHighlighted={highlightedId === p.id}
          />
        ))}
      </div>
    </div>
  )
}

function PropertyModal({ propiedad, modalVisible, cerrarModal }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') cerrarModal()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [cerrarModal])

  const badgeColor =
    propiedad.genero === 'Solo Mujeres'
      ? 'bg-pink-100 text-pink-700'
      : propiedad.genero === 'Solo Hombres'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700'

  const mensaje = `Hola, me interesa la propiedad "${propiedad.titulo}" en ${propiedad.zona}. ¿Podrías darme más información?`
  const urlWhatsApp = `https://wa.me/${propiedad.contacto}?text=${encodeURIComponent(mensaje)}`

  const nearestUnis = useMemo(() => {
    return UNIVERSIDADES.map(u => {
      const dist = calcularDistancia(propiedad.lat, propiedad.lng, u.lat, u.lng);
      return { ...u, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);
  }, [propiedad.lat, propiedad.lng]);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${modalVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}
      `}
      onClick={cerrarModal}
    >
      <div
        className={`
          relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto
          transition-all duration-300 ease-out border border-gray-100
          ${modalVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={cerrarModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full text-sm transition-colors shadow-md"
        >
          ✕
        </button>

        <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-3xl">
          {propiedad.imagenes?.[0] ? (
            <img
              src={propiedad.imagenes[0]}
              alt={propiedad.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-7xl">🏠</span>
          )}
          <span className={`absolute top-4 right-14 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${badgeColor}`}>
            {propiedad.genero}
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <span className="text-3xl font-extrabold text-indigo-900">
              ${propiedad.precio.toLocaleString('es-MX')} MXN
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              {propiedad.titulo}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              📍 {propiedad.zona} • {propiedad.tipo}
            </p>
            {propiedad.direccion && (
              <p className="text-xs text-gray-400 mt-1">
                 Dirección exacta: {propiedad.direccion}
              </p>
            )}
          </div>

          <div className="border-t border-b border-gray-100 py-4">
            {propiedad.isVerified ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-150 p-4 rounded-2xl text-emerald-800">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h4 className="text-sm font-bold">Arrendador Verificado (Registro Antifraude)</h4>
                  <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
                    Identidad validada con identificación oficial y comprobante de domicilio coincidente. El riesgo de fraude es mínimo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-150 p-4 rounded-2xl text-amber-800">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h4 className="text-sm font-bold">Arrendador No Verificado</h4>
                  <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                    Propietario no verificado aún. Evita realizar depósitos o transferencias previas sin antes visitar físicamente y firmar contrato.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              🎓 Distancia Real a Centros de Estudio
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {nearestUnis.map(u => {
                const walkingMinutes = (u.dist * 1000 / 80).toFixed(0);
                return (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{u.icono}</span>
                      <span className="text-xs font-bold text-gray-800">{u.nombre}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-900">
                        {u.dist < 1 ? `${(u.dist * 1000).toFixed(0)} metros` : `${u.dist.toFixed(2)} km`}
                      </span>
                      <span className="block text-[10px] text-gray-400">🚶 Aprox. {walkingMinutes} min caminando</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Descripción
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {propiedad.descripcion}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              🔧 Servicios Incluidos
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(propiedad?.servicios ?? []).map((s) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              ✅ Amenidades
            </h3>
            <ul className="grid grid-cols-2 gap-1.5">
              {(propiedad?.amenidades ?? []).map((a) => (
                <li key={a} className="text-xs text-gray-600 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 px-6 rounded-2xl w-full transition-all active:scale-[0.99] shadow-lg shadow-emerald-100"
          >
            <span className="text-2xl">💬</span>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

// SIMULATED AUTH MODAL FOR THE REGISTER FLOW
function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('estudiante') // 'estudiante' | 'arrendador'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onAuthSuccess({ nombre: nombre.trim(), rol })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm">✕</button>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center pb-2 border-b border-gray-50">
            <span className="text-3xl">🔑</span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">Iniciar Sesión / Registro</h3>
            <p className="text-xs text-gray-400 mt-0.5">Accede al portal estudiantil de Morelia.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Nombre de Usuario</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Sofia UMSNH"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-700 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Tipo de Cuenta (Rol)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRol('estudiante')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  rol === 'estudiante'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-50'
                    : 'bg-white hover:bg-slate-50 text-gray-600 border-gray-200'
                }`}
              >
                🎓 Estudiante
              </button>
              <button
                type="button"
                onClick={() => setRol('arrendador')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  rol === 'arrendador'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-50'
                    : 'bg-white hover:bg-slate-50 text-gray-600 border-gray-200'
                }`}
              >
                🔑 Arrendador
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-4 rounded-2xl transition-all shadow-md mt-2"
          >
            Entrar al Portal
          </button>
        </form>
      </div>
    </div>
  )
}

// 3. NEW PROPERTY PUBLISHING + DOCUMENT VERIFICATION MODAL
function PublicarPropiedadModal({ isOpen, onClose, onPublishSuccess }) {
  const [step, setStep] = useState(1); // 1 = details, 2 = docs, 3 = loading, 4 = success
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [zona, setZona] = useState('Centro');
  const [tipo, setTipo] = useState('Habitación');
  const [direccion, setDireccion] = useState('');
  const [genero, setGenero] = useState('Mixto');
  
  // Document upload simulation
  const [fileId, setFileId] = useState('');
  const [fileUtilityBill, setFileUtilityBill] = useState('');
  
  // Services
  const defaultServices = ["Wifi", "Agua", "Luz", "Gas", "Estacionamiento", "Seguridad"];
  const [serviciosSel, setServiciosSel] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTitulo('');
      setDescripcion('');
      setPrecio('');
      setZona('Centro');
      setTipo('Habitación');
      setDireccion('');
      setGenero('Mixto');
      setFileId('');
      setFileUtilityBill('');
      setServiciosSel([]);
    }
  }, [isOpen]);

  const toggleService = (s) => {
    setServiciosSel(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileId || !fileUtilityBill) return;

    setStep(3); // Loading spinner for validation
    setTimeout(() => {
      // Build properties data
      const newProperty = {
        titulo,
        descripcion,
        precio: Number(precio),
        genero,
        zona,
        tipo,
        direccion,
        servicios: serviciosSel,
        contacto: "524431234567", // simulated contact
        imagenes: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"], // mock image
        isVerified: true, // Automatically verified because they uploaded identity + utility bills matching address!
        status: "disponible"
      };

      onPublishSuccess(newProperty);
      setStep(4); // Success screen
    }, 2500); // simulated OCR validator delay
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm">✕</button>

        {/* Form Details Step 1 */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="text-center pb-2 border-b border-gray-50">
              <span className="text-3xl">🏠</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Publicar Alojamiento</h3>
              <p className="text-xs text-gray-400 mt-0.5">Ingresa los datos principales de tu propiedad en Morelia.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Título de la publicación</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Cuarto amueblado frente a Medicina"
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Precio Mensual (MXN)</label>
                <input
                  type="number"
                  required
                  min="500"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej. 3000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Género Admitido</label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="Mixto">👫 Mixto</option>
                  <option value="Solo Mujeres">👧 Solo Mujeres</option>
                  <option value="Solo Hombres">👦 Solo Hombres</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Zona / Colonia</label>
                <select
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none"
                >
                  {Object.keys(coordinatesMap).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="Habitación">Habitación</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Estudio">Estudio</option>
                  <option value="Casa">Casa</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Dirección Física Completa</label>
                <input
                  type="text"
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej. Av. Ventura Puente #412, Col. Cuauhtémoc, Morelia"
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Descripción del alojamiento</label>
                <textarea
                  required
                  rows="2"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Cerca de las facultades de salud UMSNH, ambiente amigable..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 bg-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Services checklist */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">Servicios que Incluye</label>
              <div className="grid grid-cols-3 gap-2">
                {defaultServices.map(s => {
                  const active = serviciosSel.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleService(s)}
                      className={`py-1 px-2 border rounded-lg text-xs font-semibold transition-all ${
                        active 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-gray-200 text-gray-500'
                      }`}
                    >
                      {active ? '✓' : ''} {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Siguiente: Cargar Documentación Antifraude ➔
            </button>
          </form>
        )}

        {/* Verification Upload Step 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center pb-2 border-b border-gray-50">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Cargar Documentos Antifraude</h3>
              <p className="text-xs text-gray-400 mt-0.5">Para publicar, es obligatorio validar tu identidad y la dirección del inmueble.</p>
            </div>

            <div className="bg-indigo-50 text-indigo-700 p-3 rounded-2xl text-[11px] font-medium leading-relaxed border border-indigo-100 space-y-1">
              <p>📌 <strong>Requisitos de Validación:</strong></p>
              <p>El comprobante de domicilio debe mostrar la misma dirección ingresada en el paso anterior: <strong className="text-indigo-900">{direccion}</strong>. El sistema validará los datos para certificar el anuncio.</p>
            </div>

            {/* Upload ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">1. Identificación Oficial del Arrendador (INE / Pasaporte)</label>
              <div className="border border-dashed border-gray-250 hover:border-indigo-400 rounded-2xl p-4 bg-slate-50/50 cursor-pointer text-center relative">
                <input
                  type="file"
                  id="pub-id-doc"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => setFileId(e.target.files?.[0]?.name || '')}
                  className="hidden"
                />
                <label htmlFor="pub-id-doc" className="cursor-pointer flex flex-col items-center">
                  <span className="text-2xl mb-1">🪪</span>
                  {fileId ? (
                    <span className="text-xs font-bold text-emerald-600 truncate max-w-[250px]">✓ {fileId}</span>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">Subir INE o Pasaporte oficial</span>
                  )}
                </label>
              </div>
            </div>

            {/* Upload Utility Bill */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">2. Comprobante de Domicilio (Recibo CFE / Agua de la Propiedad)</label>
              <div className="border border-dashed border-gray-250 hover:border-indigo-400 rounded-2xl p-4 bg-slate-50/50 cursor-pointer text-center relative">
                <input
                  type="file"
                  id="pub-utility-doc"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => setFileUtilityBill(e.target.files?.[0]?.name || '')}
                  className="hidden"
                />
                <label htmlFor="pub-utility-doc" className="cursor-pointer flex flex-col items-center">
                  <span className="text-2xl mb-1">📄</span>
                  {fileUtilityBill ? (
                    <span className="text-xs font-bold text-emerald-600 truncate max-w-[250px]">✓ {fileUtilityBill}</span>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">Subir Recibo de Luz/Agua con dirección coincidente</span>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold text-xs py-3 px-4 rounded-2xl transition-all"
              >
                Volver
              </button>
              
              <button
                type="submit"
                disabled={!fileId || !fileUtilityBill}
                className="w-2/3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all shadow-md"
              >
                Publicar y Verificar 🔒
              </button>
            </div>
          </form>
        )}

        {/* Loading Spinner Step 3 */}
        {step === 3 && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-gray-800 text-sm">Validación Antifraude en Progreso</h4>
              <div className="text-xs text-indigo-600 font-semibold space-y-1 animate-pulse">
                <p>🔍 Extrayendo dirección de {fileUtilityBill}...</p>
                <p>🛡️ Cotejando INE de Arrendador...</p>
                <p>🗺️ Georreferenciando inmueble en zona {zona}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Screen Step 4 */}
        {step === 4 && (
          <div className="py-8 flex flex-col items-center justify-center space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-4xl text-emerald-600 animate-bounce shadow-md">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-gray-800 text-lg">¡Publicado y Verificado!</h4>
              <p className="text-xs text-gray-500 max-w-[320px]">
                El recibo coincide plenamente con la dirección física. Tu propiedad fue listada en el mapa de Morelia con el distintivo <strong>"🛡️ Arrendador Verificado"</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all"
            >
              Ver en la lista y mapa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// SIMULATOR PANEL FOR PRESENTATION
function DemoControlPanel({ 
  propiedadesState, 
  onToggleStatus, 
  mostrarApartadasDemo, 
  setMostrarApartadasDemo,
  abrirAuth,
  usuarioLogueado,
  onForzarArrendador
}) {
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const total = propiedadesState.length;
    const disponibles = propiedadesState.filter(p => p.status === 'disponible').length;
    const apartadas = total - disponibles;
    const verificadas = propiedadesState.filter(p => p.isVerified).length;
    return { total, disponibles, apartadas, verificadas };
  }, [propiedadesState]);

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm w-full font-sans transition-all duration-300">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 text-white rounded-full shadow-2xl px-4 py-3 border border-slate-700 text-xs font-bold transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="animate-pulse">🧪</span> Panel de Simulación (Demostración)
        </button>
      ) : (
        <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl p-4 border border-slate-800 flex flex-col space-y-3.5 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-extrabold text-xs text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🧪</span> Panel de Demostración MVP
            </h4>
            <button 
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white text-xs bg-slate-900 px-2 py-0.5 rounded-md"
            >
              Ocultar
            </button>
          </div>

          {/* Stats dashboard */}
          <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/50">
              <span className="block text-slate-400 font-bold">Base de Datos</span>
              <span className="text-sm font-extrabold text-slate-200">{stats.total} total</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/50">
              <span className="block text-slate-400 font-bold">Ocultas (Apartadas)</span>
              <span className="text-sm font-extrabold text-rose-400">{stats.apartadas} filtro</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/50">
              <span className="block text-slate-400 font-bold">Disponibles</span>
              <span className="text-sm font-extrabold text-emerald-400">{stats.disponibles} activas</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/50">
              <span className="block text-slate-400 font-bold">Verificados</span>
              <span className="text-sm font-extrabold text-indigo-300">{stats.verificadas} prop.</span>
            </div>
          </div>

          {/* Simulation functions */}
          <div className="space-y-2 text-xs border-t border-b border-slate-850 py-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-350 text-[11px]">Demo - Ver apartadas:</span>
              <input
                type="checkbox"
                checked={mostrarApartadasDemo}
                onChange={(e) => setMostrarApartadasDemo(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
              />
            </div>

            {/* Quick logins */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block font-bold">Login Rápido para Demostración:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onForzarArrendador('Don Carlos (Arrendador)', 'arrendador')}
                  className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 py-1 rounded text-[10px] font-bold border border-indigo-500/30"
                >
                  🔑 Ser Arrendador
                </button>
                <button
                  type="button"
                  onClick={() => onForzarArrendador('Mateo (Estudiante)', 'estudiante')}
                  className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-1 rounded text-[10px] font-bold border border-blue-500/30"
                >
                  🎓 Ser Estudiante
                </button>
              </div>
            </div>
          </div>

          {/* Toggle status of properties */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block tracking-wider">Simular Reservas en Vivo:</span>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
              {propiedadesState.slice(0, 5).map(p => {
                const isApartada = p.status === 'apartado';
                return (
                  <div key={p.id} className="flex justify-between items-center text-[10px] bg-slate-900 p-1.5 rounded border border-slate-850">
                    <span className="text-slate-300 truncate max-w-[170px]">{p.titulo}</span>
                    <button
                      onClick={() => onToggleStatus(p.id)}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        isApartada ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {isApartada ? '🔒 Apartado' : '🔓 Libre'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [busqueda, setBusqueda] = useState('')
  const [precioMax, setPrecioMax] = useState(12000)
  const [genero, setGenero] = useState('Todos')
  const [zona, setZona] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [serviciosSel, setServiciosSel] = useState([])
  const [selectedUniId, setSelectedUniId] = useState('')
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  
  // Modals
  const [authModalAbierto, setAuthModalAbierto] = useState(false)
  const [publicarModalAbierto, setPublicarModalAbierto] = useState(false)

  // Logged-in User
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const saved = localStorage.getItem('viviendas_morelia_user')
    return saved ? JSON.parse(saved) : null
  })

  // Highlighted property ID from card hover
  const [highlightedPropertyId, setHighlightedPropertyId] = useState(null)

  // Demo status view toggles
  const [mostrarApartadasDemo, setMostrarApartadasDemo] = useState(false)

  // Properties State (LocalStorage)
  const [propiedadesState, setPropiedadesState] = useState(() => {
    const saved = localStorage.getItem('viviendas_morelia_data')
    return saved ? JSON.parse(saved) : propiedades
  })

  useEffect(() => {
    localStorage.setItem('viviendas_morelia_data', JSON.stringify(propiedadesState))
  }, [propiedadesState])

  useEffect(() => {
    if (usuarioLogueado) {
      localStorage.setItem('viviendas_morelia_user', JSON.stringify(usuarioLogueado))
    } else {
      localStorage.removeItem('viviendas_morelia_user')
    }
  }, [usuarioLogueado])

  function abrirModal(propiedad) {
    setPropiedadSeleccionada(propiedad)
    requestAnimationFrame(() => setModalVisible(true))
  }

  function cerrarModal() {
    setModalVisible(false)
    setTimeout(() => setPropiedadSeleccionada(null), 200)
  }

  const selectedUni = useMemo(() => {
    return UNIVERSIDADES.find(u => u.id === selectedUniId) || null
  }, [selectedUniId])

  const zonas = useMemo(
    () => ['Todas', ...new Set(propiedadesState.map((p) => p.zona))],
    [propiedadesState]
  )

  const tipos = useMemo(
    () => ['Todos', ...new Set(propiedadesState.map((p) => p.tipo))],
    [propiedadesState]
  )

  const servicios = useMemo(
    () => [...new Set(propiedadesState.flatMap((p) => p.servicios || []))],
    [propiedadesState]
  )

  // Filter out reserved properties automatically
  const apartadasOcultasCount = useMemo(() => {
    if (mostrarApartadasDemo) return 0;
    return propiedadesState.filter(p => p.status === 'apartado').length;
  }, [propiedadesState, mostrarApartadasDemo])

  // Filter logic
  const filtradas = useMemo(() => {
    return propiedadesState.filter((p) => {
      if (p.status !== 'disponible' && !mostrarApartadasDemo) return false;

      const term = normalize(busqueda)
      if (term) {
        const enTitulo = normalize(p.titulo).includes(term)
        const enDesc = normalize(p.descripcion).includes(term)
        if (!enTitulo && !enDesc) return false
      }
      
      if (p.precio > precioMax) return false
      
      if (genero !== 'Todos') {
        const normalGen = normalize(genero)
        const normalPropGen = normalize(p.genero)
        if (normalGen === 'hombre' && normalPropGen !== 'solo hombres') return false
        if (normalGen === 'mujer' && normalPropGen !== 'solo mujeres') return false
        if (normalGen === 'mixto' && normalPropGen !== 'mixto') return false
      }

      if (zona !== 'Todas' && normalize(p.zona) !== normalize(zona)) return false
      if (tipo !== 'Todos' && normalize(p.tipo) !== normalize(tipo)) return false
      
      if (serviciosSel.length > 0) {
        const nomServSel = serviciosSel.map(normalize)
        if (!nomServSel.every((s) => (p.servicios ?? []).map(normalize).includes(s))) return false
      }

      return true
    })
  }, [propiedadesState, busqueda, precioMax, genero, zona, tipo, serviciosSel, mostrarApartadasDemo])

  // Handler to toggle property availability status
  function handleToggleStatus(id) {
    setPropiedadesState(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'disponible' ? 'apartado' : 'disponible' } : p
    ))
  }

  // Handler to publish a new house and georeference it
  function handlePublishSuccess(newProp) {
    const nextId = Math.max(...propiedadesState.map(p => p.id)) + 1;
    
    // Assign lat/lng coordinates in Morelia
    const zoneCoords = coordinatesMap[newProp.zona] || { lat: 19.7027, lng: -101.1923 };
    const offsetLat = (Math.random() - 0.5) * 0.003;
    const offsetLng = (Math.random() - 0.5) * 0.003;
    
    const finalizedProperty = {
      ...newProp,
      id: nextId,
      lat: Number((zoneCoords.lat + offsetLat).toFixed(6)),
      lng: Number((zoneCoords.lng + offsetLng).toFixed(6))
    };

    setPropiedadesState(prev => [finalizedProperty, ...prev]);
  }

  function handleForzarLoginDemo(nombre, rol) {
    setUsuarioLogueado({ nombre, rol });
  }

  function limpiarFiltros() {
    setBusqueda('')
    setPrecioMax(12000)
    setGenero('Todos')
    setZona('Todas')
    setTipo('Todos')
    setServiciosSel([])
    setSelectedUniId('')
  }

  const hayFiltrosActivos =
    busqueda !== '' ||
    precioMax < 12000 ||
    genero !== 'Todos' ||
    zona !== 'Todas' ||
    tipo !== 'Todos' ||
    serviciosSel.length > 0 ||
    selectedUniId !== ''

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-16">
      <Navbar 
        busqueda={busqueda} 
        onBusquedaChange={setBusqueda} 
        usuario={usuarioLogueado}
        abrirAuth={() => setAuthModalAbierto(true)}
        abrirPublicar={() => setPublicarModalAbierto(true)}
        cerrarSesion={() => setUsuarioLogueado(null)}
      />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Sidebar & Property Grid (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col md:flex-row gap-6">
            <Sidebar
              precioMax={precioMax}
              onPrecioMaxChange={setPrecioMax}
              genero={genero}
              onGeneroChange={setGenero}
              zona={zona}
              onZonaChange={setZona}
              tipo={tipo}
              onTipoChange={setTipo}
              serviciosSel={serviciosSel}
              onServiciosChange={setServiciosSel}
              zonas={zonas}
              tipos={tipos}
              servicios={servicios}
              onLimpiar={limpiarFiltros}
              hayFiltros={hayFiltrosActivos}
              sidebarAbierto={sidebarAbierto}
              cerrarSidebar={() => setSidebarAbierto(false)}
              selectedUniId={selectedUniId}
              onUniChange={setSelectedUniId}
            />
            
            <PropertyGrid
              propiedades={filtradas}
              onSelect={abrirModal}
              onLimpiar={limpiarFiltros}
              selectedUni={selectedUni}
              onHover={setHighlightedPropertyId}
              highlightedId={highlightedPropertyId}
              apartadasOcultasCount={apartadasOcultasCount}
            />
          </div>

          {/* Right Column: Sticky Map (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 h-[400px] lg:h-[calc(100vh-140px)] min-h-[380px] z-10">
            <MapaMorelia
              propiedades={filtradas}
              selectedProperty={propiedadSeleccionada}
              onSelectProperty={abrirModal}
              selectedUniId={selectedUniId}
              highlightedPropertyId={highlightedPropertyId}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setSidebarAbierto((v) => !v)}
        className="md:hidden fixed bottom-4 right-4 z-30 w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg text-xl transition-colors active:scale-90"
      >
        ⚙️
      </button>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalAbierto}
        onClose={() => setAuthModalAbierto(false)}
        onAuthSuccess={setUsuarioLogueado}
      />

      {/* Publishing & Document Verification Modal */}
      <PublicarPropiedadModal
        isOpen={publicarModalAbierto}
        onClose={() => setPublicarModalAbierto(false)}
        onPublishSuccess={handlePublishSuccess}
      />

      {/* Detail Modal */}
      {propiedadSeleccionada && (
        <PropertyModal
          propiedad={propiedadSeleccionada}
          modalVisible={modalVisible}
          cerrarModal={cerrarModal}
        />
      )}

      {/* Demo panel */}
      <DemoControlPanel 
        propiedadesState={propiedadesState}
        onToggleStatus={handleToggleStatus}
        mostrarApartadasDemo={mostrarApartadasDemo}
        setMostrarApartadasDemo={setMostrarApartadasDemo}
        abrirAuth={() => setAuthModalAbierto(true)}
        usuarioLogueado={usuarioLogueado}
        onForzarArrendador={handleForzarLoginDemo}
      />
    </div>
  )
}

export default App

