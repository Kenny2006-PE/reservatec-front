"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { UserService } from '@/services/user.service';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  dni: string;
  codigo: string;
  email: string;
  carrera: string;
  estado: 'activo' | 'suspendido';
  condicion_medica?: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [procesandoSuspension, setProcesandoSuspension] = useState<number | null>(null);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsuarios();
      setUsuarios(response.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoUsuario = async (usuarioId: number, nuevoEstado: 'activo' | 'suspendido') => {
    try {
      setProcesandoSuspension(usuarioId);
      
      await UserService.cambiarEstadoUsuario(usuarioId, nuevoEstado);
      
      // Actualizar el estado local
      setUsuarios(usuarios.map(usuario => 
        usuario.id_usuario === usuarioId 
          ? { ...usuario, estado: nuevoEstado }
          : usuario
      ));
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert('Error al cambiar el estado del usuario. Por favor, intenta de nuevo.');
    } finally {
      setProcesandoSuspension(null);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
    usuario.dni.includes(searchQuery) ||
    usuario.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpandUser = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="usuarios" userType="encargado" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Gestión de Usuarios"
          description="Gestiona la información de todos los usuarios registrados"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Buscar por nombre, DNI o código..."
                />
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">Cargando usuarios...</h3>
                  <p className="text-slate-600">Por favor espera un momento.</p>
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">No se encontraron usuarios</h3>
                  <p className="text-slate-600">Intenta con otros términos de búsqueda.</p>
                </div>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <div key={usuario.id_usuario} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 font-poppins">
                            {usuario.nombre} {usuario.apellido}
                          </h3>
                          <p className="text-slate-600">{usuario.carrera}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          {usuario.condicion_medica && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              {usuario.condicion_medica}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            usuario.estado === 'activo' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {usuario.estado === 'activo' ? 'Activo' : 'Suspendido'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => cambiarEstadoUsuario(
                              usuario.id_usuario, 
                              usuario.estado === 'activo' ? 'suspendido' : 'activo'
                            )}
                            disabled={procesandoSuspension === usuario.id_usuario}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              usuario.estado === 'activo'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                            } ${procesandoSuspension === usuario.id_usuario ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {procesandoSuspension === usuario.id_usuario ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Procesando...</span>
                              </div>
                            ) : (
                              usuario.estado === 'activo' ? 'Suspender' : 'Quitar Suspensión'
                            )}
                          </button>

                          <button
                            onClick={() => toggleExpandUser(usuario.id_usuario)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg 
                              className={`w-5 h-5 transform transition-transform ${expandedUser === usuario.id_usuario ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedUser === usuario.id_usuario && (
                      <div className="p-6 bg-gray-50/50">
                        <div className="text-sm text-gray-600">
                          <p className="mb-2"><strong>Email:</strong> {usuario.email}</p>
                          <p className="mb-2"><strong>DNI:</strong> {usuario.dni}</p>
                          <p className="mb-2"><strong>Código:</strong> {usuario.codigo}</p>
                          <p><strong>Carrera:</strong> {usuario.carrera}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}