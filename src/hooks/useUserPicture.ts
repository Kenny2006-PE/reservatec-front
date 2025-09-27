'use client';

import { useState, useEffect } from 'react';

export function useUserPicture() {
  const [userPicture, setUserPicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Intentar obtener la imagen del usuario de la cookie
    const picture = document.cookie.split('; ').find(row => row.startsWith('userPicture='));
    if (picture) {
      setUserPicture(decodeURIComponent(picture.split('=')[1]));
    }
  }, []);

  return userPicture;
}