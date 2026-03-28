import { useEffect, useRef } from 'react';
import { checkJobStatus } from '../services/api.js';
import { POLL_INTERVAL_MS, POLL_TIMEOUT_MS } from '../utils/constants.js';

/**
 * useJobStatus — Polls the backend every POLL_INTERVAL_MS until the job is done.
 *
 * @param {string|null}  jobId      - The job to poll (null = no polling)
 * @param {string|null}  userId
 * @param {Function}     onComplete - Called with downloadUrl when status === 'completed'
 * @param {Function}     onError    - Called with an error message string
 */
export function useJobStatus(jobId, userId, onComplete, onError) {
  const intervalRef  = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!jobId || !userId) return;

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(async () => {
      // Global timeout guard
      if (Date.now() - startTimeRef.current > POLL_TIMEOUT_MS) {
        clearInterval(intervalRef.current);
        onError('Processing timed out. Please try again.');
        return;
      }

      try {
        const status = await checkJobStatus(jobId, userId);

        if (status.status === 'completed') {
          clearInterval(intervalRef.current);
          onComplete(status.downloadUrl);
        } else if (status.status === 'failed') {
          clearInterval(intervalRef.current);
          onError(status.errorMessage || 'Processing failed. Please try again.');
        }
        // 'processing' → keep polling
      } catch (err) {
        // Network hiccup — keep polling rather than failing immediately
        console.warn('[useJobStatus] poll error (will retry):', err.message);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [jobId, userId, onComplete, onError]);
}
