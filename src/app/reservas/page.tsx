'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOutIcon, ChevronRightIcon } from '@/components/Icons';

export default function ReservasPage() {
  const router = useRouter();
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const areas = {
    futbol1: {
      name: "Fútbol 1",
      description: "Cancha principal de fútbol",
      color: "#10b981"
    },
    futbol2: {
      name: "Fútbol 2", 
      description: "Cancha secundaria de fútbol",
      color: "#3b82f6"
    },
    fronton: {
      name: "Frontón",
      description: "Cancha de frontón/squash",
      color: "#8b5cf6"
    },
    voley: {
      name: "Futsal/Vóley/Básket",
      description: "Cancha multiuso deportiva",
      color: "#f59e0b"
    }
  };

  const handleAreaClick = (areaId: string) => {
    router.push(`/reservas/${areaId}`);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20 lg:w-20' : 'w-full lg:w-80'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700/50 lg:min-h-screen transition-all duration-300 ease-in-out`}>
        {/* Header del sidebar */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center justify-center ${sidebarCollapsed ? 'w-full' : ''}`}>
              {!sidebarCollapsed && (
                <Image
                  src="/logo-blanco-dashboard.png"
                  alt="ReservaTec Logo"
                  width={160}
                  height={55}
                  className="object-contain drop-shadow-lg sm:w-48 sm:h-16 lg:w-52 lg:h-17"
                />
              )}
              {sidebarCollapsed && (
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
              )}
            </div>
            {/* Toggle button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
            >
              <svg 
                className={`w-5 h-5 text-slate-300 group-hover:text-white transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {!sidebarCollapsed && (
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 sm:mb-6 lg:mb-8 font-poppins">
                Navegación Principal
              </div>
            )}
            
            <Link href="#" className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-white font-poppins text-sm sm:text-base truncate">Reservas</span>
                    <span className="text-xs sm:text-sm text-blue-300 font-medium hidden sm:block">Gestiona tus reservas deportivas</span>
                  </div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full shadow-lg"></div>
                </>
              )}
            </Link>
            
            <Link href="/user-info" className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-emerald-400 group-hover:to-emerald-500 transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Mi Información</span>
                    <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Perfil personal y configuración</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
                </>
              )}
            </Link>
          </div>
        </nav>

        {/* Cerrar sesión */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 mt-auto">
          <Link href="/">
            <button className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-red-500/10 transition-all duration-300 w-full text-left border border-transparent hover:border-red-500/30 hover:shadow-lg`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-slate-700/80 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-300">
                <LogOutIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-300 group-hover:text-red-400" />
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-slate-100 group-hover:text-red-400 font-poppins text-sm sm:text-base truncate">Cerrar Sesión</span>
                    <span className="text-xs sm:text-sm text-slate-400 group-hover:text-red-300 font-medium hidden sm:block">Salir del sistema de forma segura</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
                </>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 font-poppins">Reservar Espacios Deportivos</h1>
              <p className="text-slate-600 font-medium tracking-wide text-sm sm:text-base">Selecciona el área deportiva donde deseas realizar tu reserva</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm sm:text-base font-semibold text-slate-900 font-poppins">Usuario Demo</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Estudiante Activo</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg font-poppins">
                UD
              </div>
            </div>
          </div>
        </header>

        {/* Contenido del mapa */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              
              {/* Header del mapa */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Mapa del Polideportivo</h2>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium">Haz click en cualquier área deportiva para ver disponibilidad y realizar tu reserva</p>
                </div>
              </div>

              {/* Mapa SVG del polideportivo */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-green-100 shadow-inner">
                  
                  {/* Tooltip */}
                  {hoveredArea && (
                    <div className="absolute top-4 left-4 z-20 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700/50 transform transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm" 
                          style={{ backgroundColor: areas[hoveredArea as keyof typeof areas].color }}
                        ></div>
                        <div>
                          <p className="font-bold font-poppins text-sm">{areas[hoveredArea as keyof typeof areas].name}</p>
                          <p className="text-xs text-slate-300">{areas[hoveredArea as keyof typeof areas].description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <svg
                    viewBox="0 0 900 700"
                    className="w-full h-auto max-h-[70vh] drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))' }}
                  >
                    {/* Fondo del polideportivo */}
                    <rect x="0" y="0" width="900" height="700" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3"/>
                    
                    {/* Área de Fútbol 2 (parte superior - horizontal) */}
                    <g>
                      <rect 
                        x="40" 
                        y="40" 
                        width="600" 
                        height="280" 
                        fill={selectedArea === 'futbol2' ? '#3b82f6' : hoveredArea === 'futbol2' ? '#60a5fa' : '#dbeafe'}
                        stroke="#3b82f6" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('futbol2')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('futbol2')}
                      />
                      {/* Líneas de la cancha de fútbol 2 */}
                      <rect x="60" y="60" width="560" height="240" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Círculo central */}
                      <circle cx="340" cy="180" r="45" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Línea central */}
                      <line x1="340" y1="60" x2="340" y2="300" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Áreas de penalty */}
                      <rect x="60" y="120" width="80" height="120" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      <rect x="540" y="120" width="80" height="120" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Áreas pequeñas */}
                      <rect x="60" y="150" width="30" height="60" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      <rect x="590" y="150" width="30" height="60" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Porterías */}
                      <rect x="40" y="165" width="20" height="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
                      <rect x="620" y="165" width="20" height="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
                      
                      {/* Label FUTBOL 2 */}
                      <text x="340" y="190" textAnchor="middle" className="fill-slate-700 font-bold text-3xl font-poppins">
                        FÚTBOL 2
                      </text>
                    </g>

                    {/* Frontón (esquina superior derecha) */}
                    <g>
                      <rect 
                        x="670" 
                        y="40" 
                        width="190" 
                        height="140" 
                        fill={selectedArea === 'fronton' ? '#8b5cf6' : hoveredArea === 'fronton' ? '#a78bfa' : '#ede9fe'}
                        stroke="#8b5cf6" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('fronton')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('fronton')}
                      />
                      {/* Líneas del frontón */}
                      <rect x="685" y="55" width="160" height="110" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                      {/* Líneas de servicio */}
                      <line x1="685" y1="90" x2="845" y2="90" stroke="#8b5cf6" strokeWidth="1"/>
                      <line x1="685" y1="130" x2="845" y2="130" stroke="#8b5cf6" strokeWidth="1"/>
                      
                      {/* Label FRONTON */}
                      <text x="765" y="115" textAnchor="middle" className="fill-slate-700 font-bold text-lg font-poppins">
                        FRONTÓN
                      </text>
                    </g>

                    {/* Graderías (entre las dos canchas de fútbol) */}
                    <rect x="40" y="330" width="600" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                    <g>
                      {/* Líneas de las gradas */}
                      <line x1="40" y1="335" x2="640" y2="335" stroke="#94a3b8" strokeWidth="1"/>
                      <line x1="40" y1="340" x2="640" y2="340" stroke="#94a3b8" strokeWidth="1"/>
                      <line x1="40" y1="345" x2="640" y2="345" stroke="#94a3b8" strokeWidth="1"/>
                      <line x1="40" y1="350" x2="640" y2="350" stroke="#94a3b8" strokeWidth="1"/>
                      <line x1="40" y1="355" x2="640" y2="355" stroke="#94a3b8" strokeWidth="1"/>
                    </g>

                    {/* Área de Fútbol 1 (parte inferior izquierda - mismo tamaño que Fútbol 2) */}
                    <g>
                      <rect 
                        x="40" 
                        y="380" 
                        width="500" 
                        height="280" 
                        fill={selectedArea === 'futbol1' ? '#10b981' : hoveredArea === 'futbol1' ? '#34d399' : '#dcfce7'}
                        stroke="#10b981" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('futbol1')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('futbol1')}
                      />
                      {/* Líneas de la cancha de fútbol 1 - mismas proporciones que fútbol 2 */}
                      <rect x="60" y="400" width="460" height="240" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Círculo central */}
                      <circle cx="290" cy="520" r="40" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Línea central */}
                      <line x1="290" y1="400" x2="290" y2="640" stroke="#10b981" strokeWidth="2"/>
                      {/* Áreas de penalty */}
                      <rect x="60" y="460" width="70" height="120" fill="none" stroke="#10b981" strokeWidth="2"/>
                      <rect x="450" y="460" width="70" height="120" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Áreas pequeñas */}
                      <rect x="60" y="490" width="25" height="60" fill="none" stroke="#10b981" strokeWidth="2"/>
                      <rect x="495" y="490" width="25" height="60" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Porterías */}
                      <rect x="40" y="505" width="20" height="30" fill="none" stroke="#10b981" strokeWidth="3"/>
                      <rect x="520" y="505" width="20" height="30" fill="none" stroke="#10b981" strokeWidth="3"/>
                      
                      {/* Label FUTBOL 1 */}
                      <text x="290" y="530" textAnchor="middle" className="fill-slate-700 font-bold text-3xl font-poppins">
                        FÚTBOL 1
                      </text>
                    </g>

                    {/* Área de Futsal/Vóley/Básket (derecha, desde graderías hacia abajo) */}
                    <g>
                      <rect 
                        x="670" 
                        y="200" 
                        width="190" 
                        height="460" 
                        fill={selectedArea === 'voley' ? '#f59e0b' : hoveredArea === 'voley' ? '#fbbf24' : '#fef3c7'}
                        stroke="#f59e0b" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('voley')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('voley')}
                      />
                      {/* Líneas de la cancha multiuso */}
                      <rect x="685" y="220" width="160" height="420" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Sección de Básket (parte superior) */}
                      <circle cx="765" cy="290" r="30" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="735" y="260" width="60" height="20" fill="none" stroke="#f59e0b" strokeWidth="1"/>
                      <line x1="765" y1="220" x2="765" y2="360" stroke="#f59e0b" strokeWidth="1"/>
                      <rect x="685" y="270" width="25" height="40" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="820" y="270" width="25" height="40" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Red de vóley (centro) */}
                      <line x1="685" y1="430" x2="845" y2="430" stroke="#f59e0b" strokeWidth="4"/>
                      <line x1="765" y1="410" x2="765" y2="450" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Cancha de futsal (parte inferior) */}
                      <circle cx="765" cy="550" r="25" fill="none" stroke="#f59e0b" strokeWidth="1"/>
                      <rect x="685" y="520" width="30" height="60" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="815" y="520" width="30" height="60" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Labels */}
                      <text x="765" y="310" textAnchor="middle" className="fill-slate-700 font-bold text-sm font-poppins">
                        BÁSKET
                      </text>
                      <text x="765" y="445" textAnchor="middle" className="fill-slate-700 font-bold text-sm font-poppins">
                        VÓLEY
                      </text>
                      <text x="765" y="570" textAnchor="middle" className="fill-slate-700 font-bold text-sm font-poppins">
                        FUTSAL
                      </text>
                    </g>

                    {/* Área verde lateral izquierda (zona de servicios) */}
                    <rect x="560" y="380" width="100" height="150" fill="#dcfce7" stroke="#84cc16" strokeWidth="2"/>
                    <text x="610" y="430" textAnchor="middle" className="fill-slate-600 font-semibold text-xs font-poppins">
                      SERVICIOS
                    </text>
                    <text x="610" y="445" textAnchor="middle" className="fill-slate-600 font-semibold text-xs font-poppins">
                      GENERALES
                    </text>

                    {/* Entrada principal */}
                    <rect x="560" y="550" width="100" height="110" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2"/>
                    <text x="610" y="610" textAnchor="middle" className="fill-slate-600 font-semibold text-sm font-poppins">
                      ENTRADA
                    </text>
                    <text x="610" y="625" textAnchor="middle" className="fill-slate-600 font-semibold text-sm font-poppins">
                      PRINCIPAL
                    </text>

                    {/* Etiqueta POLIDEPORTIVO */}
                    <text x="290" y="690" textAnchor="middle" className="fill-slate-500 font-bold text-xl font-poppins tracking-wider">
                      POLIDEPORTIVO
                    </text>
                  </svg>
                </div>

                {/* Leyenda de colores */}
                <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 font-poppins">Áreas Deportivas Disponibles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(areas).map(([key, area]) => (
                      <div 
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                          selectedArea === key 
                            ? 'border-slate-400 bg-slate-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => handleAreaClick(key)}
                      >
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm" 
                          style={{ backgroundColor: area.color }}
                        ></div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm font-poppins">{area.name}</p>
                          <p className="text-xs text-slate-600">{area.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to action */}
                {selectedArea && (
                  <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold font-poppins">
                          Has seleccionado: {areas[selectedArea as keyof typeof areas].name}
                        </h4>
                        <p className="text-blue-100 text-sm">Continúa para ver horarios disponibles y confirmar tu reserva</p>
                      </div>
                      <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-poppins">
                        Ver Horarios Disponibles
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}