/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: 'development' | 'production' | 'staging';
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_FEATURE_FLAGS?: string;
  readonly VITE_WS_URL?: string;
  readonly VITE_AI_API_URL?: string;
  readonly VITE_ANALYTICS_ENABLED?: string;
  readonly VITE_REALTIME_ENABLED?: string;
  readonly VITE_AI_ASSISTANT_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

// Module declarations for non-TypeScript files (e.g., images, fonts, JSON)
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.txt' {
  const content: string;
  export default content;
}

declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.eot' {
  const content: string;
  export default content;
}

declare module '*.otf' {
  const content: string;
  export default content;
}
