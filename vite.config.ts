import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'; // Pull in Node's path resolution core module

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            // FIXED: Dynamically resolves the absolute path to your local workspace directory
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});