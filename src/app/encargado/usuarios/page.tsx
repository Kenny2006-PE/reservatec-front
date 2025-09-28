/**
 * @page Usuarios - Encargado
 * @description Página para gestionar usuarios del sistema
 * @route /encargado/usuarios
 */

"use client";

import { useState } from 'react';
import SidebarEncargado from '@/components/Sidebar/SidebarEncargado';

export default function UsuariosPage() {
  const [currentPath] = useState('usuarios');

  // Datos de ejemplo
  const usuarios = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@tecsup.edu.pe',
      carrera: 'Ingeniería de Software',
      semestre: '6to',
      reservasActivas: 2,
      totalReservas: 15,
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria.garcia@tecsup.edu.pe',
      carrera: 'Administración Industrial',
      semestre: '4to',
      reservasActivas: 1,
      totalReservas: 8,
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Carlos López',
      email: 'carlos.lopez@tecsup.edu.pe',
      carrera: 'Mecatrónica',
      semestre: '8vo',
      reservasActivas: 0,
      totalReservas: 22,
      estado: 'Inactivo'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarEncargado currentPath={currentPath} />
      
      {/* Contenido principal */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-1">Administra los usuarios del sistema de reservas</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                + Nuevo Usuario
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="p-6 lg:p-8 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-600">Total Usuarios</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">142</p>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">14</p>
              <p className="text-sm text-gray-600">Usuarios Inactivos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">8</p>
              <p className="text-sm text-gray-600">Nuevos este mes</p>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="p-6 lg:p-8 bg-white border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Buscar usuarios por nombre o email..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Carrera:</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Todas las carreras</option>
                <option value="software">Ingeniería de Software</option>
                <option value="industrial">Administración Industrial</option>
                <option value="mecatronica">Mecatrónica</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Estado:</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrera</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semestre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                            {usuario.nombre.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                            <div className="text-sm text-gray-500">{usuario.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.carrera}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.semestre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <span className="font-medium text-blue-600">{usuario.reservasActivas}</span> activas
                        </div>
                        <div className="text-gray-500">
                          {usuario.totalReservas} total
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {usuario.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                            Ver perfil
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200">
                            Editar
                          </button>
                          <button className={`transition-colors duration-200 ${
                            usuario.estado === 'Activo' 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}>
                            {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">3</span> de{' '}
                <span className="font-medium">156</span> usuarios
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}