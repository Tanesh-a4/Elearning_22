import { useRef, useCallback } from 'react';

/**
 * Custom hook to manage API requests with retry limits and exponential backoff
 * Prevents infinite request loops when backend is unavailable
 */
export const useApiRequest = (maxRetries = 3, retryDelay = 5000) => {
  const retryCount = useRef(0);
  const lastRetryTime = useRef(0);
  const isRequesting = useRef(false);

  const canMakeRequest = useCallback(() => {
    if (isRequesting.current) {
      return false; // Already requesting
    }

    const now = Date.now();
    if (retryCount.current >= maxRetries) {
      const timeSinceLastRetry = now - lastRetryTime.current;
      if (timeSinceLastRetry < retryDelay) {
        return false; // Still in cooldown period
      }
      // Reset retry count after cooldown
      retryCount.current = 0;
    }

    return true;
  }, [maxRetries, retryDelay]);

  const markRequestStart = useCallback(() => {
    isRequesting.current = true;
  }, []);

  const markRequestEnd = useCallback((success = false) => {
    isRequesting.current = false;
    if (success) {
      retryCount.current = 0; // Reset on success
    } else {
      retryCount.current++;
      lastRetryTime.current = Date.now();
    }
  }, []);

  const reset = useCallback(() => {
    retryCount.current = 0;
    lastRetryTime.current = 0;
    isRequesting.current = false;
  }, []);

  return {
    canMakeRequest,
    markRequestStart,
    markRequestEnd,
    reset,
  };
};
