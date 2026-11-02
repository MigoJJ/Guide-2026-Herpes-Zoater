import { useEncounterStore } from '../../store';
import type { SessionPatientPayload } from '../../store/types';

export interface EmrSetPatientMessage {
  type: 'HZ_SET_PATIENT';
  patientSessionKey: string;
  payload?: SessionPatientPayload;
}

export interface EmrClearPatientMessage {
  type: 'HZ_CLEAR_PATIENT';
}

export interface EmrRequestNoteMessage {
  type: 'HZ_REQUEST_NOTE';
  patientSessionKey?: string;
}

export type EmrInboundMessage =
  | EmrSetPatientMessage
  | EmrClearPatientMessage
  | EmrRequestNoteMessage;

export interface EmrOutboundSaveNote {
  type: 'HZ_SAVE_NOTE';
  patientSessionKey: string | null;
  timestamp: string;
  soapNote: string;
}

export interface EmrOutboundSessionError {
  type: 'HZ_SESSION_MISMATCH_ERROR';
  patientSessionKey: string | null;
  requestedSessionKey?: string;
  error: string;
}

/**
 * Initializes bidirectional EMR postMessage communication.
 * Listens for patient switch events from host EMR and guarantees complete state reset.
 */
export function initEmrBridge(allowedOrigins: string[] = ['*']): () => void {
  const handleMessage = (event: MessageEvent) => {
    // Basic origin check (can be configured in production)
    if (!allowedOrigins.includes('*') && !allowedOrigins.includes(event.origin)) {
      return;
    }

    const data = event.data as EmrInboundMessage;
    if (!data || typeof data !== 'object' || !data.type) {
      return;
    }

    switch (data.type) {
      case 'HZ_SET_PATIENT': {
        if (!data.patientSessionKey) {
          console.warn('[HZ EMR Bridge] Missing patientSessionKey in HZ_SET_PATIENT. Ignored for safety.');
          return;
        }

        // Automatic purge of prior patient state and load of new patient
        useEncounterStore.getState().setPatientSession(data.patientSessionKey, data.payload);

        // Acknowledge back to host EMR
        postMessageToHost({
          type: 'HZ_PATIENT_LOADED',
          patientSessionKey: data.patientSessionKey,
          timestamp: new Date().toISOString(),
        });
        break;
      }

      case 'HZ_CLEAR_PATIENT': {
        useEncounterStore.getState().clearPatientSession();
        postMessageToHost({
          type: 'HZ_PATIENT_CLEARED',
          timestamp: new Date().toISOString(),
        });
        break;
      }

      case 'HZ_REQUEST_NOTE': {
        const currentSession = useEncounterStore.getState().patientSessionKey;
        // Verify session key integrity before returning chart data
        if (data.patientSessionKey && data.patientSessionKey !== currentSession) {
          postMessageToHost({
            type: 'HZ_SESSION_MISMATCH_ERROR',
            patientSessionKey: currentSession,
            requestedSessionKey: data.patientSessionKey,
            error: 'CRITICAL: Patient session key mismatch. Note request rejected to prevent cross-patient documentation.',
          });
          return;
        }

        // Return note with matching session key
        postMessageToHost({
          type: 'HZ_NOTE_RESPONSE',
          patientSessionKey: currentSession,
          timestamp: new Date().toISOString(),
        });
        break;
      }

      default:
        break;
    }
  };

  window.addEventListener('message', handleMessage);

  // Notify host EMR that widget is mounted and ready
  postMessageToHost({
    type: 'HZ_WIDGET_READY',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

/**
 * Sends a message to parent window (if in iframe) or opener window (if popup).
 */
export function postMessageToHost(message: Record<string, unknown>, targetOrigin = '*'): void {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, targetOrigin);
    } else if (window.opener) {
      window.opener.postMessage(message, targetOrigin);
    } else {
      window.postMessage(message, targetOrigin);
    }
  } catch (err) {
    console.error('[HZ EMR Bridge] Failed to postMessage to host EMR:', err);
  }
}

/**
 * Dispatches current SOAP note to host EMR, accompanied by the active patient session key.
 */
export function dispatchNoteToEmr(soapNote: string): boolean {
  const sessionKey = useEncounterStore.getState().patientSessionKey;

  postMessageToHost({
    type: 'HZ_SAVE_NOTE',
    patientSessionKey: sessionKey,
    timestamp: new Date().toISOString(),
    soapNote,
  });

  return true;
}
