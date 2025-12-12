import { ThemeProvider } from '@/components/theme-provider';
import { createInertiaApp, router } from '@inertiajs/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const Root = () => {
            const [isPageLoading, setIsPageLoading] = useState(false);

            useEffect(() => {
                // Inertia navigation events
                router.on('start', () => setIsPageLoading(true));
                router.on('finish', () => setIsPageLoading(false));
                router.on('error', () => setIsPageLoading(false));
            }, []);

            return (
                <>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider
                            defaultTheme="system"
                            storageKey="vite-ui-theme"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    // key={props.initialPage.component} // use component name as key
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}

                                    // initial={{ opacity: 0 }}
                                    // animate={{ opacity: 1 }}
                                    // exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                >
                                    <App {...props} />
                                </motion.div>
                            </AnimatePresence>
                            <Toaster richColors position="top-right" />
                        </ThemeProvider>
                    </QueryClientProvider>
                </>
            );
        };

        root.render(
            <StrictMode>
                <Root />
            </StrictMode>
        );
    },
    progress: { color: '#4B5563', showSpinner: true },
});

initializeTheme();
