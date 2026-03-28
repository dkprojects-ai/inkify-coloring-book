import { useState, useEffect } from 'react';

/**
 * useAuth — Generates/restores a persistent anonymous user ID.
 * Can be upgraded to Google Sign-In in a future phase.
 */
export function useAuth() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('inkify_userId');
    if (!id) {
      id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem('inkify_userId', id);
    }
    setUserId(id);
  }, []);

  return { userId };
}
