/**
 * @page Control de Materiales Deportivos - Encargado
 * @description Página para gestionar la devolución de materiales deportivos (HU-5 y HU-6)
 * @route /encargado/control-materiales
 */

"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ReservationService } from '@/services/reservation.service';
import { Reserva } from '@/types/reservation.types';

// Modal personalizado para este componente
function CustomModal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideUp">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h3 className="text-xl font-bold text-white font-poppins">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ControlMaterialesPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'devueltas' | 'no_devueltas'>('pendientes');
  
  // Modal states
  const [showNoDevueltoModal, setShowNoDevueltoModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [descripcionSancion, setDescripcionSancion] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    cargarReservas();
  }, [filtro]);

  const cargarReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReservationService.getReservasConMaterial(filtro);
      setReservas(response.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar reservas');
      console.error('Error cargando reservas con material:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarDevuelto = async (reservaId: number) => {
    try {
      await ReservationService.marcarDevuelto(reservaId, true);
      setSuccessMessage('Material marcado como devuelto correctamente');
      setShowSuccessModal(true);
      cargarReservas();
    } catch (error) {
      alert('Error al marcar material como devuelto: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleAbrirModalNoDevuelto = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setDescripcionSancion('');
    setShowNoDevueltoModal(true);
  };

  const handleConfirmarNoDevuelto = async () => {
    if (!selectedReserva || !descripcionSancion.trim()) {
      alert('Debe ingresar una descripción de la sanción');
      return;
    }

    try {
      const response = await ReservationService.marcarNoDevueltoYSuspender(
        selectedReserva.id_reserva,
        descripcionSancion
      );
      
      setShowNoDevueltoModal(false);
      setSuccessMessage(`${response.message}\nEl usuario ha sido suspendido automáticamente.`);
      setShowSuccessModal(true);
      cargarReservas();
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEstadoDevolucion = (reserva: Reserva) => {
    if (reserva.material_devuelto === null) {
      return { text: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    } else if (reserva.material_devuelto === true) {
      return { text: 'Devuelto', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
    } else {
      return { text: 'NO Devuelto', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="control-materiales" userType="encargado" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Control de Materiales Deportivos"
          description="Gestiona la devolución de materiales prestados"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            
            {/* Filtros */}
            <div className="mb-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 font-poppins">Filtrar por estado</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setFiltro('pendientes')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    filtro === 'pendientes'
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFiltro('devueltas')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    filtro === 'devueltas'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Devueltas
                </button>
                <button
                  onClick={() => setFiltro('no_devueltas')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    filtro === 'no_devueltas'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  No Devueltas
                </button>
                <button
                  onClick={() => setFiltro('todas')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    filtro === 'todas'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
              </div>
            </div>

            {/* Estado de carga */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Cargando reservas...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Lista de reservas */}
            {!loading && !error && (
              <div className="space-y-6">
                {reservas.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">No hay reservas</h3>
                    <p className="text-slate-600">No se encontraron reservas con material para este filtro.</p>
                  </div>
                ) : (
                  reservas.map((reserva) => {
                    const estadoDevolucion = getEstadoDevolucion(reserva);
                    
                    return (
                      <div key={reserva.id_reserva} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 py-6 text-white">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold font-poppins mb-2">{reserva.area_nombre}</h3>
                              <p className="text-blue-100">
                                {formatearFecha(reserva.fecha)} • {reserva.horario_inicio} - {reserva.horario_fin}
                              </p>
                            </div>
                            <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold border ${estadoDevolucion.color} shrink-0`}>
                              {estadoDevolucion.text}
                            </span>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Información del estudiante */}
                            <div>
                              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Estudiante</h4>
                              <div className="space-y-2">
                                <p className="text-slate-900"><span className="font-semibold">Nombre:</span> {reserva.usuario_nombre} {reserva.usuario_apellido}</p>
                                <p className="text-slate-900"><span className="font-semibold">DNI:</span> {reserva.usuario_dni}</p>
                                <p className="text-slate-900"><span className="font-semibold">Código:</span> {reserva.usuario_codigo}</p>
                                <p className="text-slate-900">
                                  <span className="font-semibold">Estado:</span>{' '}
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${reserva.usuario_activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {reserva.usuario_activo ? 'Activo' : 'Suspendido'}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Información de la reserva */}
                            <div>
                              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Detalles</h4>
                              <div className="space-y-2">
                                <p className="text-slate-900"><span className="font-semibold">Participantes:</span> {reserva.participantes}</p>
                                <p className="text-slate-900"><span className="font-semibold">Material:</span> ✅ Sí</p>
                                {reserva.fecha_devolucion && (
                                  <p className="text-slate-900">
                                    <span className="font-semibold">Fecha devolución:</span>{' '}
                                    {new Date(reserva.fecha_devolucion).toLocaleString('es-ES')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Botones de acción - Solo para pendientes */}
                          {reserva.material_devuelto === null && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleMarcarDevuelto(reserva.id_reserva)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Material Devuelto
                              </button>
                              <button
                                onClick={() => handleAbrirModalNoDevuelto(reserva)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                </svg>
                                NO Devuelto + Suspender
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal: Marcar como NO devuelto */}
      {showNoDevueltoModal && selectedReserva && (
        <CustomModal
          isOpen={showNoDevueltoModal}
          onClose={() => setShowNoDevueltoModal(false)}
          title="⚠️ Material NO Devuelto - Suspender Usuario"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">⚠️ Advertencia:</p>
              <p className="text-red-700 text-sm">
                Al confirmar, el usuario <span className="font-bold">{selectedReserva.usuario_nombre} {selectedReserva.usuario_apellido}</span> será <span className="font-bold">suspendido automáticamente</span> y no podrá realizar nuevas reservas hasta que se levante la suspensión.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción de la sanción *
              </label>
              <textarea
                value={descripcionSancion}
                onChange={(e) => setDescripcionSancion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Ej: Material deportivo no devuelto en la fecha establecida. Fecha límite: 05/11/2025"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowNoDevueltoModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarNoDevuelto}
                disabled={!descripcionSancion.trim()}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                Confirmar Suspensión
              </button>
            </div>
          </div>
        </CustomModal>
      )}

      {/* Modal: Éxito */}
      {showSuccessModal && (
        <CustomModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setSuccessMessage('');
          }}
          title="✅ Operación Exitosa"
        >
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-slate-800 whitespace-pre-line">{successMessage}</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSuccessMessage('');
              }}
              className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Entendido
            </button>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
