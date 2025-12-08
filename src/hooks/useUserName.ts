'use client';

import { useState, useEffect, useRef } from 'react';
import { getUserFullName } from '@/utils/auth';

export function useUserName() {
  const [userName, setUserName] = useState<string>('Usuario');
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Evitar cargas múltiples
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Obtener el nombre completo del usuario
    const fullName = getUserFullName();
    if (fullName) {
      setUserName(fullName);
    }
  }, []);

  return userName;
}
