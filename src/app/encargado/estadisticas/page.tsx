/**
 * @page Estadísticas
 * @description Dashboard de estadísticas y métricas del sistema
 * @route /encargado/estadisticas
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUserPicture } from '@/hooks/useUserPicture';
import { DashboardService, DashboardStats } from '@/services/dashboard.service';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function EstadisticasPage() {
  const userPicture = useUserPicture();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = async () => {
    setExporting(true);
    setExportType('excel');
    try {
      const blob = await DashboardService.exportToExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estadisticas-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      alert('Error al exportar a Excel. Por favor, intenta nuevamente.');
    } finally {
      setExporting(false);
      setExportType(null);
    }
  };

  const exportarPDF = async () => {
    setExporting(true);
    setExportType('pdf');
    try {
      const blob = await DashboardService.exportToPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estadisticas-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando a PDF:', error);
      alert('Error al exportar a PDF. Por favor, intenta nuevamente.');
    } finally {
      setExporting(false);
      setExportType(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentPath="encargado" userType="encargado" />
        <div className="flex-1 flex flex-col">
          <Header 
            title="Estadísticas" 
            description="Cargando..."
            userImage={userPicture}
          />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-500">Cargando estadísticas...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentPath="encargado" userType="encargado" />
        <div className="flex-1 flex flex-col">
          <Header 
            title="Estadísticas" 
            description="Error al cargar"
            userImage={userPicture}
          />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-red-500">Error al cargar estadísticas</div>
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
          title="Estadísticas" 
          description="Análisis y métricas del sistema de reservas"
          userImage={userPicture}
        />
        
        <main className="flex-1 p-4 md:p-8">
          {/* Botones de exportación */}
          <div className="flex justify-end gap-3 mb-6">
            <button
              onClick={exportarExcel}
              disabled={exporting}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                exporting && exportType === 'excel'
                  ? 'bg-green-400 cursor-wait'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {exporting && exportType === 'excel' ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Excel
                </>
              )}
            </button>
            <button
              onClick={exportarPDF}
              disabled={exporting}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                exporting && exportType === 'pdf'
                  ? 'bg-red-400 cursor-wait'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {exporting && exportType === 'pdf' ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  PDF
                </>
              )}
            </button>
          </div>

          {/* Tarjetas de métricas principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Total Reservas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Total Reservas</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {(stats.totalReservas || 0).toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${(stats.variacionReservas || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(stats.variacionReservas || 0) >= 0 ? '+' : ''}{stats.variacionReservas || 0}% vs mes anterior
              </div>
            </div>

            {/* Usuarios Activos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Usuarios Activos</h3>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats.usuariosActivos || 0}
              </div>
              <div className={`text-sm font-medium ${(stats.variacionUsuarios || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(stats.variacionUsuarios || 0) >= 0 ? '+' : ''}{stats.variacionUsuarios || 0}% vs mes anterior
              </div>
            </div>

            {/* Área Más Popular */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Área Más Popular</h3>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats.areaMasPopular?.nombre || 'N/A'}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {stats.areaMasPopular?.porcentaje || 0}% del total
              </div>
            </div>

            {/* Reportes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Reportes</h3>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats.reportes || 0}
              </div>
              <div className={`text-sm font-medium ${(stats.variacionReportes || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(stats.variacionReportes || 0) >= 0 ? '+' : ''}{stats.variacionReportes || 0}% vs mes anterior
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reservas Semanales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reservas Semanales</h3>
              <p className="text-sm text-gray-600 mb-6">Número de reservas por día de la semana</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.reservasSemanales || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="dia" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="cantidad" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Reservas Mensuales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reservas Mensuales</h3>
              <p className="text-sm text-gray-600 mb-6">Tendencia de reservas en los últimos 6 meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.reservasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cantidad" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
