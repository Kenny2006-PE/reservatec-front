'use client';

import { useState, useEffect, useRef } from 'react';

export function useUserPicture() {
  const [userPicture, setUserPicture] = useState<string | undefined>(undefined);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Evitar cargas múltiples
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Intentar obtener la imagen del usuario de la cookie
    const picture = document.cookie.split('; ').find(row => row.startsWith('userPicture='));
    if (picture) {
      setUserPicture(decodeURIComponent(picture.split('=')[1]));
    }
  }, []);

  return userPicture;
}