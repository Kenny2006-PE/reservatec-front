'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CalendarIcon, 
  UserIcon, 
  LogOutIcon, 
  ChevronRightIcon, 
  FileTextIcon,
  BarChartIcon,
  TrophyIcon,
  UsersIcon,
  SettingsIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@/components/Icons';
import { AuthService } from '@/services/auth';

interface SidebarProps {
  currentPath: 'user-info' | 'reservas' | 'cancha' | 'encargado' | string;
  userType?: 'estudiante' | 'encargado';
}

export default function Sidebar({ currentPath, userType = 'estudiante' }: SidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Configuración de menús según tipo de usuario
  const getMenuItems = () => {
    if (userType === 'encargado') {
      return [
        {
          href: '/encargado',
          label: 'Dashboard',
          description: 'Panel principal de gestión',
          icon: BarChartIcon,
          color: 'from-purple-500 to-purple-600',
          isActive: currentPath === 'encargado'
        },
        {
          href: '/encargado/reservas-activas',
          label: 'Reservas Activas',
          description: 'Gestionar reservas en curso',
          icon: CheckCircleIcon,
          color: 'from-blue-500 to-blue-600',
          isActive: currentPath.includes('reservas-activas')
        },
        {
          href: '/encargado/reservas-pendientes',
          label: 'Reservas Pendientes',
          description: 'Aprobar o rechazar solicitudes',
          icon: XCircleIcon,
          color: 'from-yellow-500 to-yellow-600',
          isActive: currentPath.includes('reservas-pendientes')
        },
        {
          href: '/encargado/reportes',
          label: 'Reportes Generales',
          description: 'Estadísticas y análisis',
          icon: FileTextIcon,
          color: 'from-indigo-500 to-indigo-600',
          isActive: currentPath.includes('reportes')
        },
        {
          href: '/encargado/usuarios',
          label: 'Usuarios',
          description: 'Gestión de usuarios del sistema',
          icon: UsersIcon,
          color: 'from-emerald-500 to-emerald-600',
          isActive: currentPath.includes('usuarios')
        },
        {
          href: '/encargado/formulario-informe',
          label: 'Formulario de Informe',
          description: 'Crear reportes detallados',
          icon: FileTextIcon,
          color: 'from-rose-500 to-rose-600',
          isActive: currentPath.includes('formulario-informe')
        },
        {
          href: '/encargado/estadisticas',
          label: 'Estadísticas',
          description: 'Métricas y análisis avanzado',
          icon: TrophyIcon,
          color: 'from-red-500 to-red-600',
          isActive: currentPath.includes('estadisticas')
        },
        {
          href: '/encargado/areas',
          label: 'Áreas',
          description: 'Gestión de espacios deportivos',
          icon: SettingsIcon,
          color: 'from-gray-500 to-gray-600',
          isActive: currentPath.includes('areas')
        }
      ];
    }

    // Menú por defecto para estudiantes
    return [
      {
        href: '/reservas',
        label: 'Reservas',
        description: 'Gestiona tus reservas deportivas',
        icon: CalendarIcon,
        color: 'from-blue-500 to-blue-600',
        isActive: currentPath === 'reservas' || currentPath === 'cancha'
      },
      {
        href: '/user-info',
        label: 'Mi Información',
        description: 'Perfil personal y configuración',
        icon: UserIcon,
        color: 'from-emerald-500 to-emerald-600',
        isActive: currentPath === 'user-info'
      }
    ];
  };

  const menuItems = getMenuItems();

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
              {userType === 'encargado' ? 'Panel de Gestión' : 'Navegación Principal'}
            </div>
          )}
          
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link 
                key={index}
                href={item.href} 
                className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl ${
                  item.isActive
                    ? 'bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm'
                    : 'hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg'
                }`}
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br ${item.color} rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <IconComponent className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">
                        {item.description}
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Cerrar sesión */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 mt-auto">
        <button 
          onClick={() => AuthService.logout()}
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