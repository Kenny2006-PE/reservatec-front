/**
 * @page Areas List Page
 * @description Página de listado de áreas deportivas
 * @route /reservas
 * @protected Requiere autenticación
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { LogOutIcon, ChevronRightIcon } from '@/components/Icons';
import { AuthService } from '@/services/auth';
import { useUserPicture } from '@/hooks/useUserPicture';

export default function ReservasPage() {
  const router = useRouter();
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const userPicture = useUserPicture();

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
      <Sidebar currentPath="reservas" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Reservar Espacios Deportivos"
          description="Selecciona el área deportiva donde deseas realizar tu reserva"
          userImage={userPicture}
        />

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
                        width="500" 
                        height="200" 
                        fill={selectedArea === 'futbol2' ? '#3b82f6' : hoveredArea === 'futbol2' ? '#60a5fa' : '#dbeafe'}
                        stroke="#3b82f6" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('futbol2')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('futbol2')}
                      />
                      {/* Líneas de la cancha de fútbol 2 */}
                      <rect x="60" y="50" width="460" height="180" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Círculo central */}
                      <circle cx="290" cy="140" r="35" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Línea central */}
                      <line x1="290" y1="50" x2="290" y2="230" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Áreas de penalty */}
                      <rect x="60" y="90" width="60" height="100" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      <rect x="460" y="90" width="60" height="100" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Áreas pequeñas */}
                      <rect x="60" y="110" width="25" height="60" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      <rect x="495" y="110" width="25" height="60" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      {/* Porterías */}
                      <rect x="40" y="125" width="20" height="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
                      <rect x="520" y="125" width="20" height="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
                      
                      {/* Label FUTBOL 2 */}
                      <text x="300" y="155" textAnchor="middle" className="fill-slate-700 font-bold text-3xl font-poppins">
                        FÚTBOL 2
                      </text>
                    </g>

                    {/* Frontón (esquina superior derecha) */}
                    <g>
                      <rect 
                        x="670" 
                        y="40" 
                        width="190" 
                        height="120" 
                        fill={selectedArea === 'fronton' ? '#8b5cf6' : hoveredArea === 'fronton' ? '#a78bfa' : '#ede9fe'}
                        stroke="#8b5cf6" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('fronton')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('fronton')}
                      />
                      {/* Líneas del frontón */}
                      <rect x="685" y="50" width="160" height="100" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                      {/* Líneas de servicio */}
                      <line x1="685" y1="80" x2="845" y2="80" stroke="#8b5cf6" strokeWidth="1"/>
                      <line x1="685" y1="120" x2="845" y2="120" stroke="#8b5cf6" strokeWidth="1"/>
                      
                      {/* Label FRONTON */}
                      <text x="765" y="110" textAnchor="middle" className="fill-slate-700 font-bold text-lg font-poppins">
                        FRONTÓN
                      </text>
                    </g>

                    {/* Área de Fútbol 1 (debajo de Fútbol 2) */}
                    <g>
                      <rect 
                        x="40" 
                        y="260" 
                        width="200" 
                        height="400" 
                        fill={selectedArea === 'futbol1' ? '#10b981' : hoveredArea === 'futbol1' ? '#34d399' : '#dcfce7'}
                        stroke="#10b981" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('futbol1')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('futbol1')}
                      />
                      {/* Líneas de la cancha de fútbol 1 - vertical */}
                      <rect x="55" y="275" width="170" height="370" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Círculo central */}
                      <circle cx="140" cy="460" r="30" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Línea central */}
                      <line x1="55" y1="460" x2="225" y2="460" stroke="#10b981" strokeWidth="2"/>
                      {/* Áreas de penalty */}
                      <rect x="90" y="275" width="100" height="50" fill="none" stroke="#10b981" strokeWidth="2"/>
                      <rect x="90" y="595" width="100" height="50" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Áreas pequeñas */}
                      <rect x="110" y="275" width="60" height="20" fill="none" stroke="#10b981" strokeWidth="2"/>
                      <rect x="110" y="625" width="60" height="20" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Porterías */}
                      <rect x="125" y="260" width="30" height="15" fill="none" stroke="#10b981" strokeWidth="3"/>
                      <rect x="125" y="645" width="30" height="15" fill="none" stroke="#10b981" strokeWidth="3"/>
                      
                      {/* Label FUTBOL 1 */}
                      <text x="140" y="410" textAnchor="middle" className="fill-slate-700 font-bold text-3xl font-poppins">
                        FÚTBOL 1
                      </text>
                    </g>

                    {/* Área de Futsal/Vóley/Básket (derecha, debajo del frontón) */}
                    <g>
                      <rect 
                        x="670" 
                        y="180" 
                        width="190" 
                        height="280" 
                        fill={selectedArea === 'voley' ? '#f59e0b' : hoveredArea === 'voley' ? '#fbbf24' : '#fef3c7'}
                        stroke="#f59e0b" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:fill-opacity-80"
                        onMouseEnter={() => setHoveredArea('voley')}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => handleAreaClick('voley')}
                      />
                      {/* Líneas de la cancha multiuso */}
                      <rect x="685" y="195" width="160" height="250" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Sección de Básket (parte superior) */}
                      <circle cx="765" cy="245" r="20" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="685" y="230" width="20" height="30" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="825" y="230" width="20" height="30" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Red de vóley (centro) */}
                      <line x1="685" y1="320" x2="845" y2="320" stroke="#f59e0b" strokeWidth="4"/>
                      <line x1="765" y1="300" x2="765" y2="340" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Cancha de futsal (parte inferior) */}
                      <circle cx="765" cy="400" r="20" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="685" y="380" width="25" height="40" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="820" y="380" width="25" height="40" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                      
                      {/* Labels */}
                      <text x="765" y="250" textAnchor="middle" className="fill-slate-700 font-bold text-sm font-poppins">
                        BÁSKET
                      </text>
                      <text x="765" y="405" textAnchor="middle" className="fill-slate-700 font-bold text-sm font-poppins">
                        VÓLEY
                      </text>
                    </g>

                    {/* Área de Co-Working (esquina inferior derecha) */}
                    <rect x="600" y="560" width="260" height="100" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2"/>
                    <text x="730" y="618" textAnchor="middle" className="fill-slate-600 font-semibold text-lg font-poppins">
                      CO-WORKING
                    </text>

                    {/* Etiqueta POLIDEPORTIVO */}
                    <text x="450" y="650" textAnchor="middle" className="fill-slate-500 font-bold text-xl font-poppins tracking-wider">
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