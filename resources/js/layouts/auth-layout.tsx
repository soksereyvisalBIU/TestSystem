import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string | ReactNode;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Left Side: Branding & Visual (Hidden on Mobile) */}
            <div className="relative hidden w-1/2 flex-col bg-zinc-900 p-10 text-white lg:flex dark:bg-zinc-950">
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent" />
                
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
                            <p className="text-lg font-light leading-relaxed text-zinc-300">
                                &ldquo;This interface is exactly what we needed to scale our operations. The attention to detail in the UX is unparalleled.&rdquo;
                            </p>
                            <footer className="text-sm font-medium text-zinc-500">
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
                    >
                        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
                        <p className="mt-2 text-muted-foreground">{description}</p>
                    </motion.div>

                    {children}
                </div>
            </div>
        </div>
    );
}