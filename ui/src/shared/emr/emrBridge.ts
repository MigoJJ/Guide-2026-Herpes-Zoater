import { useEncounterStore } from '../../store';
import type { SessionPatientPayload } from '../../store/types';
import { generateNote } from '../../domain/noteGenerator';

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
  patientSessionKey: string;
}

export type EmrInboundMessage =
  | EmrSetPatientMessage
  | EmrClearPatientMessage
  | EmrRequestNoteMessage;

export interface EmrOutboundSaveNote {
  type: 'HZ_SAVE_NOTE';
  patientSessionKey: string;
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
 * Reads the trusted EMR origins from VITE_EMR_ALLOWED_ORIGINS (comma-separated).
 * The wildcard '*' is never accepted: PHI must only travel to an explicitly configured EMR.
 */
export function getConfiguredEmrOrigins(
  raw: string | undefined = import.meta.env.VITE_EMR_ALLOWED_ORIGINS
): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o !== '' && o !== '*');
}

// Connected host EMR (set only after a message from a trusted origin is received)
let hostWindow: MessageEventSource | null = null;
let hostOrigin: string | null = null;

// Supplies the note currently shown to the doctor (including manual edits)
let noteProvider: (() => string) | null = null;

/**
 * Registers the function returning the note as currently displayed (NotePanel).
 * Returns an unregister function.
 */
export function registerNoteProvider(provider: () => string): () => void {
  noteProvider = provider;
  return () => {
    if (noteProvider === provider) noteProvider = null;
  };
}

function getCurrentNote(): string {
  if (noteProvider) return noteProvider();
  const { history, lesions, treatments } = useEncounterStore.getState();
  return generateNote({ history, lesions, treatments });
}

export function isEmrConnected(): boolean {
  return hostWindow !== null && hostOrigin !== null;
}

function getHostCandidate(): Window | null {
  if (window.parent && window.parent !== window) return window.parent;
  if (window.opener) return window.opener as Window;
  return null;
}

/**
 * Sends a message to the connected host EMR, addressed to its exact origin.
 * Returns false (and sends nothing) when no trusted host is connected.
 */
export function postMessageToHost(message: Record<string, unknown>): boolean {
  if (!hostWindow || !hostOrigin) return false;
  try {
    (hostWindow as Window).postMessage(message, hostOrigin);
    return true;
  } catch (err) {
    console.error('[HZ EMR Bridge] Failed to postMessage to host EMR:', err);
    return false;
  }
}

/**
 * Initializes bidirectional EMR postMessage communication.
 * Only messages from the configured origins are accepted, and replies are sent only to that origin.
 * With no configured origin, the bridge stays disabled (clipboard copy remains available).
 */
export function initEmrBridge(
  allowedOrigins: string[] = getConfiguredEmrOrigins()
): () => void {
  const trustedOrigins = allowedOrigins.filter((o) => o !== '*');
  if (trustedOrigins.length === 0) {
    return () => {};
  }

  const handleMessage = (event: MessageEvent) => {
    if (!trustedOrigins.includes(event.origin) || !event.source) {
      return;
    }

    const data = event.data as EmrInboundMessage;
    if (!data || typeof data !== 'object' || !data.type) {
      return;
    }

    hostWindow = event.source;
    hostOrigin = event.origin;

    switch (data.type) {
      case 'HZ_SET_PATIENT': {
        if (!data.patientSessionKey) {
          console.warn('[HZ EMR Bridge] Missing patientSessionKey in HZ_SET_PATIENT. Ignored for safety.');
          return;
        }

        // Automatic purge of prior patient state and load of new patient
        useEncounterStore.getState().setPatientSession(data.patientSessionKey, data.payload);

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
        // The key is mandatory: a request without it cannot be checked against the active patient
        if (!data.patientSessionKey || !currentSession || data.patientSessionKey !== currentSession) {
          postMessageToHost({
            type: 'HZ_SESSION_MISMATCH_ERROR',
            patientSessionKey: currentSession,
            requestedSessionKey: data.patientSessionKey,
            error: 'CRITICAL: Patient session key missing or mismatched. Note request rejected to prevent cross-patient documentation.',
          });
          return;
        }

        postMessageToHost({
          type: 'HZ_NOTE_RESPONSE',
          patientSessionKey: currentSession,
          timestamp: new Date().toISOString(),
          soapNote: getCurrentNote(),
        });
        break;
      }

      default:
        break;
    }
  };

  window.addEventListener('message', handleMessage);

  // Announce readiness to the embedding window; the browser drops it unless the origin matches
  const candidate = getHostCandidate();
  if (candidate) {
    for (const origin of trustedOrigins) {
      try {
        candidate.postMessage(
          { type: 'HZ_WIDGET_READY', version: '0.1.0', timestamp: new Date().toISOString() },
          origin
        );
      } catch (err) {
        console.error('[HZ EMR Bridge] Failed to announce readiness:', err);
      }
    }
  }

  return () => {
    window.removeEventListener('message', handleMessage);
    hostWindow = null;
    hostOrigin = null;
  };
}

/**
 * Dispatches the SOAP note to the connected host EMR with the active patient session key.
 * Returns false when no trusted EMR is connected or no patient session is active.
 */
export function dispatchNoteToEmr(soapNote: string): boolean {
  const sessionKey = useEncounterStore.getState().patientSessionKey;
  if (!sessionKey) return false;

  const message: EmrOutboundSaveNote = {
    type: 'HZ_SAVE_NOTE',
    patientSessionKey: sessionKey,
    timestamp: new Date().toISOString(),
    soapNote,
  };
  return postMessageToHost({ ...message });
}
