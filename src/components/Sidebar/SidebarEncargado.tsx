'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOutIcon, ChevronRightIcon } from '@/components/Icons';

interface SidebarEncargadoProps {
  currentPath: string;
}

export default function SidebarEncargado({ currentPath }: SidebarEncargadoProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión del encargado
    window.location.href = '/';
  };

  return (
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
              Panel de Control
            </div>
          )}
          
          {/* Reservas Activas */}
          <Link href="/encargado/reservas-activas" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'reservas-activas'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-green-400 group-hover:to-green-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Reservas Activas</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Reservas confirmadas y en curso</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>

          {/* Reservas Pendientes */}
          <Link href="/encargado/reservas-pendientes" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'reservas-pendientes'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Reservas Pendientes</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Solicitudes por aprobar</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>

          {/* Reportes Generales */}
          <Link href="/encargado/reportes-generales" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'reportes-generales'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-purple-400 group-hover:to-purple-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Reportes Generales</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Informes y estadísticas</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>

          {/* Usuarios */}
          <Link href="/encargado/usuarios" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'usuarios'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Usuarios</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Gestión de estudiantes</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>

          {/* Formulario de Informe */}
          <Link href="/encargado/formulario-informe" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'formulario-informe'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-indigo-400 group-hover:to-indigo-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Formulario de Informe</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Crear y gestionar informes</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>

          {/* Estadísticas */}
          <Link href="/encargado/estadisticas" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'estadisticas'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Estadísticas</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Análisis y métricas del sistema</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>

          {/* Áreas */}
          <Link href="/encargado/areas" 
            className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
              currentPath === 'areas'
                ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
            }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-teal-400 group-hover:to-teal-500 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Áreas</span>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Gestión de espacios deportivos</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
              </>
            )}
          </Link>
        </div>
      </nav>

      {/* Cerrar sesión */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 mt-auto">
        <button 
          onClick={handleLogout}
          className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-red-500/10 transition-all duration-300 w-full text-left border border-transparent hover:border-red-500/30 hover:shadow-lg`}
        >
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
      </div>
    </div>
  );
}