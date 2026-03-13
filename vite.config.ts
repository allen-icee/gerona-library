import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 1. Add this import

export default defineConfig({
    server: {
        host: true, // This does the same thing as --host
        hmr: {
            host: '192.168.10.251', // <--- REPLACE THIS WITH YOUR ACTUAL IPV4 ADDRESS
        },
    },
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        react(),
        tailwindcss(), // 2. Add this to the plugins array
    ],
});
