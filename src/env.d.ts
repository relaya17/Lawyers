/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_WS_URL: string
    readonly VITE_DEV_MODE: string
    readonly VITE_ENABLE_ANALYTICS: string
    readonly VITE_ENABLE_WEBSOCKET: string
    // הוסף משתנים נוספים אם צריך
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
