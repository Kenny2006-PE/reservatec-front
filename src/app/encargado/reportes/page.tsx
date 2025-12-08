/**
 * @page Reportes Generales
 * @description Gestiona los reportes y denuncias de usuarios sobre reservas activas
 * @route /encargado/reportes
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUserPicture } from '@/hooks/useUserPicture';
import { useUserName } from '@/hooks/useUserName';
import { ReportService } from '@/services/report.service';
import { Reporte, EstadoReporte } from '@/types/report.types';
import { 
  ClockIcon, 
  MapPinIcon, 
  AlertCircleIcon, 
  FlagIcon, 
  EyeIcon, 
  BanIcon, 
  XCircleIcon,
  CheckCircleIcon,
  FileTextIcon
} from '@/components/Icons';

export default function ReportesGeneralesPage() {
  const userPicture = useUserPicture();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<EstadoReporte | 'todas'>('pendiente');
  
  // Estados para modal de sanción
  const [modalSancion, setModalSancion] = useState(false);
  const [modalRechazo, setModalRechazo] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null);
  const [comentario, setComentario] = useState('');
  const [expandido, setExpandido] = useState<number | null>(null);

  useEffect(() => {
    cargarReportes();
  }, [filtro]);

  const cargarReportes = async () => {
    setLoading(true);
    try {
      console.log('Cargando reportes con filtro:', filtro);
      const response = await ReportService.getAllReports(filtro);
      console.log('Respuesta del servidor:', response);
      if (response.data) {
        console.log('Reportes recibidos:', response.data);
        setReportes(response.data);
      } else {
        console.log('No hay data en la respuesta');
        setReportes([]);
      }
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSancionar = async () => {
    if (!reporteSeleccionado || !comentario.trim()) {
      alert('Por favor ingresa un comentario');
      return;
    }

    try {
      await ReportService.sancionarDesdeReporte(reporteSeleccionado.id_reporte, {
        comentario: comentario.trim()
      });
      alert('Usuario sancionado exitosamente');
      setModalSancion(false);
      setComentario('');
      setReporteSeleccionado(null);
      cargarReportes();
    } catch (error: any) {
      console.error('Error sancionando:', error);
      alert(error.message || 'Error al sancionar usuario');
    }
  };

  const handleRechazar = async () => {
    if (!reporteSeleccionado) return;

    try {
      await ReportService.rechazarReporte(reporteSeleccionado.id_reporte, {
        comentario: comentario.trim() || 'Reporte rechazado'
      });
      alert('Reporte rechazado');
      setModalRechazo(false);
      setComentario('');
      setReporteSeleccionado(null);
      cargarReportes();
    } catch (error: any) {
      console.error('Error rechazando:', error);
      alert(error.message || 'Error al rechazar reporte');
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Fecha no disponible';
    
    // MySQL devuelve fechas en formato 'YYYY-MM-DD'
    // Necesitamos ajustar para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('T')[0].split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getBadgeColor = (estado: EstadoReporte) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'revisado': return 'bg-blue-100 text-blue-800';
      case 'sancionado': return 'bg-red-100 text-red-800';
      case 'rechazado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentPath="encargado" userType="encargado" />
        <div className="flex-1 flex flex-col">
          <Header 
            title="Reportes Generales" 
            description="Cargando..."
            userImage={userPicture}
          />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-500">Cargando reportes...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPath="encargado" userType="encargado" />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Reportes Generales" 
          description="Gestiona los reportes de las reservas activas"
          userImage={userPicture}
        />
        
        <main className="flex-1 p-4 md:p-8">
          {/* Filtros */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { valor: 'pendiente', label: 'Pendientes', icon: ClockIcon, count: reportes.filter(r => r.estado === 'pendiente').length },
              { valor: 'revisado', label: 'Revisados', icon: EyeIcon, count: reportes.filter(r => r.estado === 'revisado').length },
              { valor: 'sancionado', label: 'Sancionados', icon: BanIcon, count: reportes.filter(r => r.estado === 'sancionado').length },
              { valor: 'rechazado', label: 'Rechazados', icon: XCircleIcon, count: reportes.filter(r => r.estado === 'rechazado').length },
              { valor: 'todas', label: 'Todos', icon: FileTextIcon, count: reportes.length }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.valor}
                  onClick={() => setFiltro(item.valor as EstadoReporte | 'todas')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    filtro === item.valor
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="inline sm:hidden">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Lista de Reportes */}
          {reportes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <FileTextIcon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No hay reportes {filtro !== 'todas' ? filtro + 's' : ''}
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                {filtro === 'pendiente' 
                  ? 'No hay reportes pendientes de revisión' 
                  : 'Cambia el filtro para ver otros reportes'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportes.map((reporte) => (
                <div
                  key={reporte.id_reporte}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Encabezado del reporte */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                      {/* Avatar con iniciales */}
                      <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2 w-full sm:w-auto">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg sm:text-xl">
                            {reporte.reportado_nombre?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="text-left sm:text-center flex-1 sm:flex-none">
                          <p className="text-sm font-medium text-gray-900">
                            {reporte.reportado_nombre || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Reportado por
                          </p>
                          <p className="text-xs font-medium text-gray-700">
                            {reporte.reporta_nombre || 'Usuario'}
                          </p>
                        </div>
                      </div>

                      {/* Información de la reserva */}
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {reporte.area_nombre}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getBadgeColor(reporte.estado)}`}>
                            {reporte.estado.charAt(0).toUpperCase() + reporte.estado.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{reporte.razon}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <MapPinIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span>{reporte.area_nombre}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span>{reporte.hora_inicio} - {reporte.hora_fin}</span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-2">
                          {formatearFecha(reporte.reserva_fecha)}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandido(expandido === reporte.id_reporte ? null : reporte.id_reporte)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-start sm:self-auto"
                      >
                        <svg
                          className={`w-5 h-5 text-gray-600 transition-transform ${
                            expandido === reporte.id_reporte ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Detalles expandidos */}
                    {expandido === reporte.id_reporte && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Razón del reporte:</span>
                          <p className="text-sm text-gray-600 mt-1">{reporte.razon}</p>
                        </div>

                        <div>
                          <span className="text-sm font-semibold text-gray-700">Descripción:</span>
                          <p className="text-sm text-gray-600 mt-1">{reporte.descripcion || 'Sin descripción adicional'}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Reportado por:</span>
                            <p className="text-gray-600">
                              {reporte.reporta_nombre || 'Usuario'}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Fecha de reporte:</span>
                            <p className="text-gray-600">{new Date(reporte.fecha_reporte).toLocaleDateString('es-ES')}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Horario:</span>
                            <p className="text-gray-600">{reporte.hora_inicio} - {reporte.hora_fin}</p>
                          </div>
                        </div>

                        {reporte.comentario_admin && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <span className="text-sm font-semibold text-blue-900">Comentario del encargado:</span>
                            <p className="text-sm text-blue-700 mt-1">{reporte.comentario_admin}</p>
                            {reporte.admin_nombre && (
                              <p className="text-xs text-blue-600 mt-1">
                                - {reporte.admin_nombre} {reporte.admin_apellido}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  {reporte.estado === 'pendiente' && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setReporteSeleccionado(reporte);
                          setModalSancion(true);
                          setComentario('');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <BanIcon className="w-4 h-4" />
                        Sancionar
                      </button>
                      <button
                        onClick={() => {
                          setReporteSeleccionado(reporte);
                          setModalRechazo(true);
                          setComentario('');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Sanción */}
      {modalSancion && reporteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Sancionar Usuario
              </h3>
            </div>
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-800">
                <strong>Advertencia:</strong> Al confirmar, <strong>{reporteSeleccionado.reportado_nombre}</strong> será <strong>SUSPENDIDO</strong> y no podrá realizar nuevas reservas.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario de la sanción *
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
                placeholder="Describe el motivo de la sanción..."
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setModalSancion(false);
                  setReporteSeleccionado(null);
                  setComentario('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSancionar}
                disabled={!comentario.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <BanIcon className="w-4 h-4" />
                Confirmar Sanción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {modalRechazo && reporteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Rechazar Reporte
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              El reporte será marcado como rechazado. El usuario reportado NO será sancionado.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-sm"
                rows={3}
                placeholder="Motivo del rechazo..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setModalRechazo(false);
                  setReporteSeleccionado(null);
                  setComentario('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <XCircleIcon className="w-4 h-4" />
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
