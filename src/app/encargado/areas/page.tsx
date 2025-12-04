/**
 * @page Gestión de Áreas
 * @description Página para que el encargado gestione las áreas deportivas
 * @route /encargado/areas
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { useUserPicture } from '@/hooks/useUserPicture';
import { AreaService, AreaConfig } from '@/services/area.service';
import { ReservationService } from '@/services/reservation.service';

interface Area {
  id_area: number;
  nombre: string;
  descripcion: string;
  habilitada: boolean;
  diasDeshabilitados: string[];
  horariosDeshabilitados: number[];
  stock: number;
}

interface Horario {
  id_horario: number;
  hora_inicio: string;
  hora_fin: string;
}

export default function GestionAreasPage() {
  const userPicture = useUserPicture();
  const [areas, setAreas] = useState<Area[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArea, setEditingArea] = useState<number | null>(null);

  // Estados temporales para edición
  const [tempHabilitada, setTempHabilitada] = useState(false);
  const [tempDias, setTempDias] = useState<string[]>([]);
  const [tempHorarios, setTempHorarios] = useState<number[]>([]);
  const [tempStock, setTempStock] = useState(10);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'error' | 'warning' | 'info' | 'success'>('success');

  const diasSemana = [
    { id: 'Lunes', label: 'Lunes' },
    { id: 'Martes', label: 'Martes' },
    { id: 'Miércoles', label: 'Miércoles' },
    { id: 'Jueves', label: 'Jueves' },
    { id: 'Viernes', label: 'Viernes' }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar áreas con configuración completa desde el backend
      const areasResponse = await AreaService.getAreasConfig();
      const areasData = (areasResponse.data || []).map(area => ({
        ...area,
        diasDeshabilitados: area.diasDeshabilitados || [],
        horariosDeshabilitados: area.horariosDeshabilitados || [],
        descripcion: area.descripcion || '',
        stock: area.stock || 10
      }));
      
      setAreas(areasData);

      // Cargar horarios desde el backend
      const horariosResponse = await ReservationService.getHorarios();
      const horariosData = horariosResponse.data || [];
      
      setHorarios(horariosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setModalTitle('Error');
      setModalMessage('No se pudieron cargar las áreas. Usando datos de ejemplo.');
      setModalType('error');
      setShowModal(true);
      
      // Datos de ejemplo como fallback
      setAreas([
        {
          id_area: 1,
          nombre: 'Fútbol 1',
          descripcion: 'Cancha de fútbol principal',
          habilitada: true,
          diasDeshabilitados: [],
          horariosDeshabilitados: [],
          stock: 10
        },
        {
          id_area: 2,
          nombre: 'Fútbol 2',
          descripcion: 'Cancha de fútbol secundaria',
          habilitada: true,
          diasDeshabilitados: [],
          horariosDeshabilitados: [],
          stock: 10
        }
      ]);
      
      setHorarios([
        { id_horario: 1, hora_inicio: '08:00', hora_fin: '09:00' },
        { id_horario: 2, hora_inicio: '09:00', hora_fin: '10:00' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area.id_area);
    setTempHabilitada(area.habilitada);
    setTempDias(area.diasDeshabilitados || []);
    setTempHorarios(area.horariosDeshabilitados || []);
    setTempStock(area.stock || 10);
  };

  const handleCancelEdit = () => {
    setEditingArea(null);
    setTempDias([]);
    setTempHorarios([]);
    setTempStock(10);
  };

  const handleSaveChanges = async (areaId: number) => {
    try {
      // Guardar en el backend
      const config = {
        habilitada: tempHabilitada,
        diasDeshabilitados: tempDias,
        horariosDeshabilitados: tempHorarios,
        stock: tempStock
      };

      await AreaService.updateAreaConfig(areaId, config);

      // Actualizar estado local
      setAreas(areas.map(area => 
        area.id_area === areaId 
          ? { ...area, ...config }
          : area
      ));

      setEditingArea(null);
      
      // Mostrar modal de éxito
      setModalTitle('¡Cambios Guardados!');
      setModalMessage('La configuración del área ha sido actualizada exitosamente.');
      setModalType('success');
      setShowModal(true);

    } catch (error: any) {
      console.error('Error guardando cambios:', error);
      setModalTitle('Error');
      setModalMessage(error.message || 'No se pudieron guardar los cambios');
      setModalType('error');
      setShowModal(true);
    }
  };

  const toggleDia = (dia: string) => {
    if (tempDias.includes(dia)) {
      setTempDias(tempDias.filter(d => d !== dia));
    } else {
      setTempDias([...tempDias, dia]);
    }
  };

  const toggleHorario = (horarioId: number) => {
    if (tempHorarios.includes(horarioId)) {
      setTempHorarios(tempHorarios.filter(h => h !== horarioId));
    } else {
      setTempHorarios([...tempHorarios, horarioId]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentPath="encargado" userType="encargado" />
        <div className="flex-1 flex flex-col">
          <Header 
            title="Gestión de Áreas" 
            description="Cargando..."
            userImage={userPicture}
          />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-500">Cargando...</div>
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
          title="Gestión de Áreas" 
          description="Administra la disponibilidad de las áreas deportivas"
          userImage={userPicture}
        />
        
        <main className="flex-1 p-4 md:p-8">

          {/* Lista de áreas */}
          <div className="space-y-6">
            {areas.map((area) => {
              const isEditing = editingArea === area.id_area;
              const currentHabilitada = isEditing ? tempHabilitada : area.habilitada;
              const currentDias = isEditing ? tempDias : (area.diasDeshabilitados || []);
              const currentHorarios = isEditing ? tempHorarios : (area.horariosDeshabilitados || []);
              const currentStock = isEditing ? tempStock : (area.stock || 10);

              return (
                <div
                  key={area.id_area}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header del área */}
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {area.nombre}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {area.descripcion}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => isEditing ? handleCancelEdit() : handleEditArea(area)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          isEditing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isEditing ? 'Cancelar' : 'Editar'}
                      </button>
                      {isEditing && (
                        <button
                          onClick={() => handleSaveChanges(area.id_area)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Guardar Cambios
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contenido del área */}
                  <div className="p-6">
                    {/* Toggle de habilitación */}
                    <div className="mb-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={currentHabilitada}
                            onChange={(e) => isEditing && setTempHabilitada(e.target.checked)}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className={`w-14 h-8 rounded-full transition-colors ${
                            currentHabilitada ? 'bg-slate-900' : 'bg-gray-300'
                          } ${!isEditing && 'opacity-60'}`}></div>
                          <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            currentHabilitada ? 'translate-x-6' : ''
                          }`}></div>
                        </div>
                        <span className="text-lg font-semibold text-slate-900">
                          Área {currentHabilitada ? 'habilitada' : 'deshabilitada'}
                        </span>
                      </label>
                    </div>

                    {/* Días deshabilitados */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        Días deshabilitados:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {diasSemana.map((dia) => {
                          const isSelected = currentDias.includes(dia.id);
                          return (
                            <label
                              key={dia.id}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-slate-900 bg-slate-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => isEditing && toggleDia(dia.id)}
                                disabled={!isEditing}
                                className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-500"
                              />
                              <span className="text-sm font-medium text-slate-900">
                                {dia.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Horarios deshabilitados */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        Horarios deshabilitados:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {horarios.map((horario) => {
                          const isSelected = currentHorarios.includes(horario.id_horario);
                          return (
                            <label
                              key={horario.id_horario}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-slate-900 bg-slate-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => isEditing && toggleHorario(horario.id_horario)}
                                disabled={!isEditing}
                                className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-500"
                              />
                              <span className="text-sm font-medium text-slate-900">
                                {horario.hora_inicio.slice(0, 5)}-{horario.hora_fin.slice(0, 5)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Stock:
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={currentStock}
                          onChange={(e) => isEditing && setTempStock(parseInt(e.target.value) || 1)}
                          disabled={!isEditing}
                          className={`w-24 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            !isEditing && 'bg-gray-50 cursor-not-allowed'
                          }`}
                        />
                        <span className="text-sm text-slate-600">
                          reservas simultáneas permitidas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Modal de notificaciones */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}
