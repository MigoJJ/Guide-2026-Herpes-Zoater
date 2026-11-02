/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Comma-separated trusted EMR origins for the postMessage bridge, e.g. https://emr.hospital.local */
  readonly VITE_EMR_ALLOWED_ORIGINS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
