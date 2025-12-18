import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        // Added a subtle radial gradient for depth
        <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50/50 p-6 dark:bg-zinc-950 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
                        >
                            {/* Enhanced Logo Container with a subtle glow/border */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition-shadow group-hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800">
                                <AppLogoIcon className="h-8 w-8 fill-current text-zinc-900 dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {title}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    {/* The Card Wrapper */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}