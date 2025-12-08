'use client';

import { useState, useRef } from 'react';
import { subirExcelFechasProhibidas } from '@/services/fechasProhibidas';
import type { ResultadoProcesamiento } from '@/types/fechasProhibidas';

interface UploadExcelProps {
  onUploadSuccess: (resultado: ResultadoProcesamiento) => void;
}

export default function UploadExcel({ onUploadSuccess }: UploadExcelProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validarArchivo = (file: File): boolean => {
    // Validar tipo de archivo
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];

    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten archivos Excel (.xlsx o .xls)');
      return false;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('El archivo no debe superar los 5MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  const procesarArchivo = (file: File) => {
    setError(null);
    
    if (validarArchivo(file)) {
      setArchivo(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  const handleUpload = async () => {
    if (!archivo) return;

    setIsUploading(true);
    setError(null);

    try {
      const resultado = await subirExcelFechasProhibidas(archivo);
      onUploadSuccess(resultado);
      
      // Limpiar estado después del éxito
      setArchivo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error al procesar el archivo';
      console.error('Mensaje de error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setArchivo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Área de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${archivo ? 'bg-green-50 border-green-300' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClickUploadArea}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {!archivo ? (
          <>
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1.5 text-sm text-gray-600">
              <span className="font-semibold">Haz clic para seleccionar</span> o arrastra tu archivo aquí
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Solo archivos Excel (.xlsx, .xls) hasta 5MB
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{archivo.name}</p>
              <p className="text-xs text-gray-500">
                {(archivo.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botón de procesar */}
      {archivo && !error && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`
              px-6 py-2 rounded-lg font-medium text-white
              ${isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </span>
            ) : (
              'Procesar archivo'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
