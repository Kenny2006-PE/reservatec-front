import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
}

export default function Modal({ isOpen, onClose, title, message, type = 'warning' }: ModalProps) {
  if (!isOpen) return null;

  const iconColors = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    success: 'text-green-500'
  };

  const borderColors = {
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500',
    success: 'border-green-500'
  };

  const bgColors = {
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
    success: 'bg-green-50'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideUp">
        {/* Header con icono */}
        <div className={`${bgColors[type]} border-b-4 ${borderColors[type]} p-6`}>
          <div className="flex items-center space-x-4">
            <div className={`flex-shrink-0 ${iconColors[type]}`}>
              {type === 'warning' && (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {type === 'error' && (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {type === 'info' && (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {type === 'success' && (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-poppins">{title}</h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-slate-700 text-base leading-relaxed">{message}</p>
        </div>

        {/* Footer con botón */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

// Export named adicional por compatibilidad
export { Modal };
