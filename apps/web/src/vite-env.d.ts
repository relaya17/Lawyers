/// <reference types="vite/client" />

/**
 * Central Vite/TypeScript env + asset module declarations.
 * Keep this file in `src/` so it is included by `tsconfig.json` ("include": ["src", ...]).
 */

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WS_URL?: string;

  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_ENVIRONMENT?: 'development' | 'production' | 'staging';

  readonly VITE_DEV_MODE?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_WEBSOCKET?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_FEATURE_FLAGS?: string;

  readonly VITE_AI_API_URL?: string;
  readonly VITE_ANALYTICS_ENABLED?: string;
  readonly VITE_REALTIME_ENABLED?: string;
  readonly VITE_AI_ASSISTANT_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: unknown;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
  }
}

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
  const content: unknown;
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


