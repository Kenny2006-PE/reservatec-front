"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import jsPDF from 'jspdf';

interface FormularioInforme {
  tipoInforme: string;
  autores: string;
  dni: string;
  codigoInstitucional: string;
  motivo: string;
  descripcion: string;
}

export default function FormularioInformePage() {
  const [formulario, setFormulario] = useState<FormularioInforme>({
    tipoInforme: '',
    autores: '',
    dni: '',
    codigoInstitucional: '',
    motivo: '',
    descripcion: ''
  });

  const [generandoPDF, setGenerandoPDF] = useState(false);

  const tiposInforme = [
    'Incidente en instalaciones',
    'Daño a equipamiento',
    'Comportamiento inapropiado',
    'Reporte de mantenimiento',
    'Sugerencia de mejora',
    'Otros'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generarPDF = () => {
    if (!formulario.tipoInforme || !formulario.autores || !formulario.motivo || !formulario.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setGenerandoPDF(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('FORMULARIO DE INFORME', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Subtítulo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Crea un informe detallado de incidentes o situaciones', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Tipo de Informe
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Tipo de Informe:', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(formulario.tipoInforme, margin, yPosition);
      yPosition += 10;

      // Autores
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Autores o Involucrados:', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(formulario.autores, margin, yPosition);
      yPosition += 10;

      // DNI y Código (si están presentes)
      if (formulario.dni || formulario.codigoInstitucional) {
        const detalles = [];
        if (formulario.dni) detalles.push(`DNI: ${formulario.dni}`);
        if (formulario.codigoInstitucional) detalles.push(`Código: ${formulario.codigoInstitucional}`);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(detalles.join(' | '), margin, yPosition);
        yPosition += 10;
      }

      // Motivo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Motivo:', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const motivoLines = doc.splitTextToSize(formulario.motivo, maxWidth);
      doc.text(motivoLines, margin, yPosition);
      yPosition += motivoLines.length * 7 + 5;

      // Descripción
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Descripción de lo Ocurrido:', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const descripcionLines = doc.splitTextToSize(formulario.descripcion, maxWidth);
      doc.text(descripcionLines, margin, yPosition);
      yPosition += descripcionLines.length * 7 + 15;

      // Fecha de generación
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const fechaGeneracion = new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Documento generado el: ${fechaGeneracion}`, margin, yPosition);

      // Pie de página
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('ReservaTec - Sistema de Gestión de Reservas Deportivas', pageWidth / 2, footerY, { align: 'center' });

      // Guardar PDF
      const fileName = `Informe_${formulario.tipoInforme.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      doc.save(fileName);

      alert('PDF generado exitosamente');
      
      // Limpiar formulario
      setFormulario({
        tipoInforme: '',
        autores: '',
        dni: '',
        codigoInstitucional: '',
        motivo: '',
        descripcion: ''
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="formulario-informe" userType="encargado" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Formulario de Informe"
          description="Crea un informe detallado de incidentes o situaciones"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Header del formulario */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-poppins">Nuevo Informe</h2>
              </div>

              {/* Formulario */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  {/* Tipo de Informe */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Tipo de Informe <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoInforme"
                      value={formulario.tipoInforme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona el tipo de informe</option>
                      {tiposInforme.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Autores o Involucrados */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Autores o Involucrados <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="autores"
                      value={formulario.autores}
                      onChange={handleInputChange}
                      placeholder="Nombres completos separados por comas"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* DNI */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      DNI
                    </label>
                    <input
                      type="text"
                      name="dni"
                      value={formulario.dni}
                      onChange={handleInputChange}
                      placeholder="Documento de identidad"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Código Institucional */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Código Institucional
                    </label>
                    <input
                      type="text"
                      name="codigoInstitucional"
                      value={formulario.codigoInstitucional}
                      onChange={handleInputChange}
                      placeholder="Código del estudiante"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Motivo */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Motivo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motivo"
                    value={formulario.motivo}
                    onChange={handleInputChange}
                    placeholder="Razón principal del informe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Descripción */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Descripción de lo Ocurrido <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describe detalladamente lo sucedido..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Botón Guardar PDF */}
                <div className="flex justify-end">
                  <button
                    onClick={generarPDF}
                    disabled={generandoPDF}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                      generandoPDF
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black'
                    }`}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    <span>{generandoPDF ? 'Generando PDF...' : 'Guardar PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}