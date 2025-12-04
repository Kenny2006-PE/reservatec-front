"use client";

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import axios from '@/lib/axios';

interface NotificationPreferences {
  reserva_aprobada: boolean;
  reserva_rechazada: boolean;
  recordatorio: boolean;
  material_devolver: boolean;
  suspension: boolean;
  nueva_reserva: boolean;
  material_vencido: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

export default function NotificationSettings() {
  const { isSupported, isSubscribed, permission, isLoading, subscribe, unsubscribe, sendTestNotification } = useNotifications();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  useEffect(() => {
    if (isSubscribed) {
      loadPreferences();
    }
  }, [isSubscribed]);

  const loadPreferences = async () => {
    try {
      const { data } = await axios.get('/notifications/preferences');
      setPreferences(data.preferences);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    } finally {
      setLoadingPrefs(false);
    }
  };

  const handleTogglePreference = async (key: keyof NotificationPreferences) => {
    if (!preferences) return;

    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);

    setIsSaving(true);
    try {
      await axios.put('/notifications/preferences', { [key]: newPreferences[key] });
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      // Revertir el cambio
      setPreferences(preferences);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    alert('Notificación de prueba enviada. Revisa tus notificaciones.');
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800">
          ⚠️ Tu navegador no soporta notificaciones push.
        </p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Notificaciones Push</h3>
        <p className="text-gray-600 mb-4">
          Activa las notificaciones para recibir actualizaciones en tiempo real sobre tus reservas.
        </p>
        <button
          onClick={subscribe}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Activando...' : '🔔 Activar Notificaciones'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Notificaciones Push</h3>
          <p className="text-sm text-green-600 mt-1">✅ Activas</p>
        </div>
        <button
          onClick={unsubscribe}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
        >
          Desactivar
        </button>
      </div>

      {loadingPrefs ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : preferences && (
        <>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Tipo de Notificaciones</h4>
            
            <PreferenceToggle
              label="Reserva Aprobada"
              description="Cuando tu reserva sea aprobada por un encargado"
              enabled={preferences.reserva_aprobada}
              onChange={() => handleTogglePreference('reserva_aprobada')}
              disabled={isSaving}
            />

            <PreferenceToggle
              label="Reserva Rechazada"
              description="Cuando tu reserva sea rechazada"
              enabled={preferences.reserva_rechazada}
              onChange={() => handleTogglePreference('reserva_rechazada')}
              disabled={isSaving}
            />

            <PreferenceToggle
              label="Recordatorios"
              description="Recordatorio 1 hora antes de tu reserva"
              enabled={preferences.recordatorio}
              onChange={() => handleTogglePreference('recordatorio')}
              disabled={isSaving}
            />

            <PreferenceToggle
              label="Devolución de Material"
              description="Recordatorio para devolver material deportivo"
              enabled={preferences.material_devolver}
              onChange={() => handleTogglePreference('material_devolver')}
              disabled={isSaving}
            />

            <PreferenceToggle
              label="Suspensiones"
              description="Notificaciones sobre suspensiones de cuenta"
              enabled={preferences.suspension}
              onChange={() => handleTogglePreference('suspension')}
              disabled={isSaving}
            />
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold text-gray-700">Opciones</h4>
            
            <PreferenceToggle
              label="Sonido"
              description="Reproducir sonido con las notificaciones"
              enabled={preferences.sound_enabled}
              onChange={() => handleTogglePreference('sound_enabled')}
              disabled={isSaving}
            />

            <PreferenceToggle
              label="Vibración"
              description="Vibrar al recibir notificaciones (móvil)"
              enabled={preferences.vibration_enabled}
              onChange={() => handleTogglePreference('vibration_enabled')}
              disabled={isSaving}
            />
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleTestNotification}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              📬 Enviar Notificación de Prueba
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface PreferenceToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function PreferenceToggle({ label, description, enabled, onChange, disabled }: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
