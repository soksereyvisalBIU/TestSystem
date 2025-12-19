import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],

    // server: {
    //     host: '0.0.0.0',     // IMPORTANT
    //     port: 5174,          // match your port
    //     strictPort: true,
    //     cors: true,
    //     hmr: {
    //         protocol: 'wss', // HTTPS websocket
    //         host: '133e1459ee87.ngrok-free.app',
    //         port: 443,
    //     },
    // },
    
    esbuild: {
        jsx: 'automatic',
    },
});
