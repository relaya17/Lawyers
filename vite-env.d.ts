/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_WS_URL: string
    // תוסיף כאן משתנים נוספים שמתחילים ב־VITE_ לפי הצורך
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}