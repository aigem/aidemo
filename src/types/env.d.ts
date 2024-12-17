/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRADIO_APP_URL: string;
  readonly VITE_GRADIO_SCRIPT_URL: string;
  readonly VITE_GRADIO_CSS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}