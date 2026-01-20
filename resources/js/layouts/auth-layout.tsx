'use client';

import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string | ReactNode;
}

const backgroundImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    // "https://images.unsplash.com/photo-1614850523296-e8c0a9ee32a1?q=80&w=2670&auto=format&fit=crop",
    'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop',
];

export default function AuthLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Left Side: Branding & Visual */}
            <div className="relative hidden w-1/2 flex-col overflow-hidden bg-zinc-900 p-10 text-white lg:flex dark:bg-zinc-950">
                {/* Image Slideshow */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${backgroundImages[currentImage]})`,
                            }}
                        />
                    </AnimatePresence>
                </div>

                {/* Overlays: Grain & Gradient */}
                <div className="absolute inset-0 z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay brightness-50" />
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-600/40 via-zinc-900/60 to-zinc-900/90" />

                <div className="relative z-20 flex items-center text-lg font-bold tracking-tight">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        A
                    </div>
                    Acme Dash
                </div>

                <div className="relative z-20 mt-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <blockquote className="space-y-2">
                            <p className="text-lg leading-relaxed font-light text-zinc-100">
                                &ldquo;This interface is exactly what we needed
                                to scale our operations. The attention to detail
                                in the UX is unparalleled.&rdquo;
                            </p>
                            <footer className="text-sm font-medium text-zinc-400">
                                — Alex Rivera, Lead Designer at Vercel
                            </footer>
                        </blockquote>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
                <div className="mx-auto w-full max-w-[400px] space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center space-y-2"
                    >
                        <Link className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition-shadow group-hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800" href={'/'}>
                            <AppLogoIcon className="h-8 w-8 fill-current text-zinc-900 dark:text-white" />
                        </Link>

                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {title}
                        </h1>
                        <div className="mt-2 text-muted-foreground">
                            {description}
                        </div>
                    </motion.div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
