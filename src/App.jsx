import { useState, useMemo, useEffect } from 'react'
import propiedades from './data/propiedades.json'

function normalize(str) {
  return str.toLowerCase().trim()
}

function Navbar({ busqueda, onBusquedaChange }) {
  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-gray-800 shrink-0">
          <span className="text-2xl">🏠</span>
          <span className="hidden sm:inline">ViviendaMorelia</span>
        </a>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full max-w-md">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
          {busqueda && (
            <button
              onClick={() => onBusquedaChange('')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
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
}) {
  function toggleServicio(s) {
    if (serviciosSel.includes(s)) {
      onServiciosChange(serviciosSel.filter((x) => x !== s))
    } else {
      onServiciosChange([...serviciosSel, s])
    }
  }

  const panel = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
          <span>⚙️</span> Filtros
        </h2>
        <button
          onClick={cerrarSidebar}
          className="md:hidden w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full text-sm"
        >
          ✕
        </button>
      </div>

      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          <span>💰 Precio máximo</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
            ${precioMax.toLocaleString('es-MX')} MXN
          </span>
        </label>
        <input
          type="range"
          min={1000}
          max={10000}
          step={500}
          value={precioMax}
          onChange={(e) => onPrecioMaxChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$1,000</span>
          <span>$10,000</span>
        </div>
      </div>

      <div>
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
          <span>👤</span> Género permitido
        </span>
        <div className="space-y-1">
          {['Todos', 'Solo Mujeres', 'Solo Hombres', 'Mixto'].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="genero"
                value={g}
                checked={genero === g}
                onChange={() => onGeneroChange(g)}
                className="accent-blue-600"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
          <span>📍</span> Zona de Morelia
        </span>
        <select
          value={zona}
          onChange={(e) => onZonaChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          {zonas.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
          <span>🏘️</span> Tipo de alojamiento
        </span>
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
          <span>🔧</span> Servicios incluidos
        </span>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {servicios.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={serviciosSel.includes(s)}
                onChange={() => toggleServicio(s)}
                className="accent-blue-600 rounded"
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      {hayFiltros && (
        <button
          onClick={onLimpiar}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm py-2 px-4 rounded-lg border border-red-200 transition-colors"
        >
          🧹 Limpiar filtros
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
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={cerrarSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-out
          md:hidden
          ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {panel}
      </aside>
    </>
  )
}

function PropertyCard({ propiedad, onSelect }) {
  const badgeColor =
    propiedad.genero === 'Solo Mujeres'
      ? 'bg-pink-100 text-pink-700'
      : propiedad.genero === 'Solo Hombres'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700'

  return (
    <article
      onClick={() => onSelect(propiedad)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        {propiedad.imagenes?.[0] ? (
          <img
            src={propiedad.imagenes[0]}
            alt={propiedad.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl">🏠</span>
        )}
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}
        >
          {propiedad.genero}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-gray-800">
            ${propiedad.precio.toLocaleString('es-MX')}
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 leading-tight line-clamp-2">
          {propiedad.titulo}
        </h3>
        <p className="text-sm text-gray-500">
          {propiedad.zona} • {propiedad.tipo}
        </p>
        {propiedad.servicios?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {propiedad.servicios.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
            {propiedad.servicios.length > 4 && (
              <span className="text-xs text-gray-400">+{propiedad.servicios.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function PropertyGrid({ propiedades, onSelect, onLimpiar }) {
  if (propiedades.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-6xl mb-4">🏚️</span>
        <p className="text-lg font-medium text-gray-500">No hay propiedades que coincidan</p>
        <p className="text-sm mt-1">Intenta ajustar los filtros</p>
        <button
          onClick={onLimpiar}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 px-4 rounded-lg mt-4 transition-colors"
        >
          🧹 Limpiar todos los filtros
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {propiedades.map((p) => (
        <PropertyCard key={p.id} propiedad={p} onSelect={onSelect} />
      ))}
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

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-200 ease-out
        ${modalVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}
      `}
      onClick={cerrarModal}
    >
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto
          transition-all duration-200 ease-out
          ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={cerrarModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full text-sm transition-colors"
        >
          ✕
        </button>

        <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-2xl">
          {propiedad.imagenes?.[0] ? (
            <img
              src={propiedad.imagenes[0]}
              alt={propiedad.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-7xl">🏠</span>
          )}
          <span
            className={`absolute top-4 right-14 text-sm font-semibold px-3 py-1 rounded-full ${badgeColor}`}
          >
            {propiedad.genero}
          </span>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <span className="text-3xl font-bold text-gray-800">
              ${propiedad.precio.toLocaleString('es-MX')} MXN
            </span>
            <h2 className="text-xl font-semibold text-gray-800 mt-1">
              {propiedad.titulo}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {propiedad.zona} • {propiedad.tipo}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Descripción
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {propiedad.descripcion}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              🔧 Servicios
            </h3>
            <div className="flex flex-wrap gap-2">
              {(propiedad?.servicios ?? []).map((s) => (
                <span
                  key={s}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              ✅ Amenidades
            </h3>
            <ul className="space-y-1">
              {(propiedad?.amenidades ?? []).map((a) => (
                <li key={a} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span> {a}
                </li>
              ))}
              {(propiedad?.amenidades ?? []).length === 0 && (
                <li className="text-sm text-gray-400 italic">No se listan amenidades</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              ⚠️ Reglas
            </h3>
            <ul className="space-y-1">
              {(propiedad?.reglas ?? []).map((r) => (
                <li key={r} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span> {r}
                </li>
              ))}
              {(propiedad?.reglas ?? []).length === 0 && (
                <li className="text-sm text-gray-400 italic">No se especifican reglas</li>
              )}
            </ul>
          </div>

          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 px-6 rounded-xl w-full transition-colors"
          >
            <span className="text-2xl">💬</span>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [busqueda, setBusqueda] = useState('')
  const [precioMax, setPrecioMax] = useState(10000)
  const [genero, setGenero] = useState('Todos')
  const [zona, setZona] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [serviciosSel, setServiciosSel] = useState([])
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  function abrirModal(propiedad) {
    setPropiedadSeleccionada(propiedad)
    requestAnimationFrame(() => setModalVisible(true))
  }

  function cerrarModal() {
    setModalVisible(false)
    setTimeout(() => setPropiedadSeleccionada(null), 200)
  }

  const zonas = useMemo(
    () => ['Todas', ...new Set(propiedades.map((p) => p.zona))],
    []
  )

  const tipos = useMemo(
    () => ['Todos', ...new Set(propiedades.map((p) => p.tipo))],
    []
  )

  const servicios = useMemo(
    () => [...new Set(propiedades.flatMap((p) => p.servicios))],
    []
  )

  const filtradas = useMemo(() => {
    return propiedades.filter((p) => {
      const term = normalize(busqueda)
      if (term) {
        const enTitulo = normalize(p.titulo).includes(term)
        const enDesc = normalize(p.descripcion).includes(term)
        if (!enTitulo && !enDesc) return false
      }
      if (p.precio > precioMax) return false
      if (genero !== 'Todos' && normalize(p.genero) !== normalize(genero)) return false
      if (zona !== 'Todas' && normalize(p.zona) !== normalize(zona)) return false
      if (tipo !== 'Todos' && normalize(p.tipo) !== normalize(tipo)) return false
      if (serviciosSel.length > 0) {
        const nomServSel = serviciosSel.map(normalize)
        if (!nomServSel.every((s) => (p.servicios ?? []).map(normalize).includes(s))) return false
      }
      return true
    })
  }, [busqueda, precioMax, genero, zona, tipo, serviciosSel])

  function limpiarFiltros() {
    setBusqueda('')
    setPrecioMax(10000)
    setGenero('Todos')
    setZona('Todas')
    setTipo('Todos')
    setServiciosSel([])
  }

  const hayFiltrosActivos =
    busqueda !== '' ||
    precioMax < 10000 ||
    genero !== 'Todos' ||
    zona !== 'Todas' ||
    tipo !== 'Todos' ||
    serviciosSel.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar busqueda={busqueda} onBusquedaChange={setBusqueda} />
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
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
        />
        <PropertyGrid
          propiedades={filtradas}
          onSelect={abrirModal}
          onLimpiar={limpiarFiltros}
        />
      </div>

      <button
        onClick={() => setSidebarAbierto((v) => !v)}
        className="md:hidden fixed bottom-4 right-4 z-30 w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg text-xl transition-colors"
      >
        ⚙️
      </button>

      {propiedadSeleccionada && (
        <PropertyModal
          propiedad={propiedadSeleccionada}
          modalVisible={modalVisible}
          cerrarModal={cerrarModal}
        />
      )}
    </div>
  )
}

export default App
