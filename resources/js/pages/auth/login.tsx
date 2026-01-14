import { Form, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

export default function Login({
    canResetPassword,
    canRegister,
}: {
    canResetPassword: boolean;
    canRegister: boolean;
}) {
    const handleGoogleLogin = () => {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        // 1. Open the popup
        const popup = window.open(
            '/auth/google',
            'google-login',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`,
        );

        // 2. Define the message listener
        const messageListener = (event: MessageEvent) => {
            // Security Check: Only trust messages from our own domain
            if (event.origin !== window.location.origin) return;

            if (event.data?.source === 'google-auth') {
                if (event.data.status === 'success') {
                    // 3. Success! Sync Inertia state or redirect
                    router.visit('/dashboard');
                } else {
                    alert('Google authentication failed. Please try again.');
                }
                window.removeEventListener('message', messageListener);
            }
        };

        // 3. Listen for the message from the callback view
        window.addEventListener('message', messageListener);
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your details to access your dashboard"
        >
            <Head title="Log in" />

            <div className="grid gap-6">
                {/* Social Login Section */}
                <div className="grid grid-cols-1 gap-4">
                    <Button
                        // onClick={() => (window.location.href = '/auth/google')}
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="h-11 font-semibold shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                        <img
                            className="mr-2 h-4 w-4"
                            src="https://image.similarpng.com/file/similarpng/original-picture/2020/06/Logo-google-icon-PNG.png"
                            alt=""
                        />
                        Continue with Google
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or with email
                        </span>
                    </div>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="grid gap-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        className="h-11 pl-10"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-semibold text-primary"
                                        >
                                            Forgot?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        className="h-11 pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" name="remember" />
                                <label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm leading-none font-medium text-muted-foreground"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full text-sm font-bold shadow-lg"
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                Sign In
                            </Button>

                            {canRegister && (
                                <p className="text-center text-sm text-muted-foreground">
                                    No account?{' '}
                                    <TextLink
                                        href={register()}
                                        className="font-bold text-foreground"
                                    >
                                        Create account
                                    </TextLink>
                                </p>
                            )}
                        </motion.div>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
