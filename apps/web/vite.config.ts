import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        ...(process.env.ANALYZE ? [visualizer({ open: false, filename: "dist/stats.html", gzipSize: true })] : []),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@shared": path.resolve(__dirname, "../../packages/shared/src"),
        },
    },
    server: {
        port: 5852,
        host: true,
        strictPort: true,
        hmr: {
            port: 5852,
            host: "localhost",
        },
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    mui: ["@mui/material", "@mui/icons-material"],
                    utils: ["axios", "date-fns", "zod"],
                },
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
    },
});





