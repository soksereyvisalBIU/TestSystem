import { Form, Head } from '@inertiajs/react';
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
import { route } from 'ziggy-js';

export default function Login({
    canResetPassword,
    canRegister,
}: {
    canResetPassword: boolean;
    canRegister: boolean;
}) {
    // const [googleLoading, setGoogleLoading] = useState(false);
    // const [googleError, setGoogleError] = useState('');

    // const handleGoogleLogin = () => {
    //     setGoogleLoading(true);
    //     setGoogleError('');

    //     const width = 500;
    //     const height = 600;
    //     const left = window.screen.width / 2 - width / 2;
    //     const top = window.screen.height / 2 - height / 2;

    //     const popup = window.open(
    //         '/auth/google',
    //         'google-login',
    //         `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`
    //     );

    //     const messageListener = (event: MessageEvent) => {
    //         if (event.origin !== window.location.origin) return;

    //         if (event.data?.source === 'google-auth') {
    //             setGoogleLoading(false);

    //             if (event.data.status === 'success') {
    //                 router.visit('/dashboard');
    //             } else {
    //                 setGoogleError('Google authentication failed. Please try again.');
    //             }

    //             window.removeEventListener('message', messageListener);
    //         }
    //     };

    //     window.addEventListener('message', messageListener);
    // };

    // Simply redirect the whole page
    const handleGoogleLogin = () => {
        window.location.href = route('google.login');
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your details to access your dashboard"
        >
            <Head title="Log in" />

            <div className="grid gap-4">
                {/* Social Login Section */}
                {/* <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-4"
                >
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        variant="outline"
                        className="
                            flex items-center justify-center gap-3
                            h-11 w-full rounded-md border border-zinc-300
                            bg-white text-sm font-semibold text-zinc-700
                            shadow-sm transition-all hover:bg-zinc-50
                            dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700
                            dark:hover:bg-zinc-800
                        "
                    >
                        {googleLoading ? (
                            <Spinner className="h-5 w-5 mr-2" />
                        ) : (
                            <img
                                className="h-5 w-5"
                                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                alt="Google Logo"
                            />
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </Button>
                    {googleError && (
                        <p className="text-xs text-red-500 text-center">{googleError}</p>
                    )}
                </motion.div> */}

                <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                    <img
                        className="h-5 w-5"
                        src="/assets/img/logo/google.png"
                        alt="Google Logo"
                    />
                    Continue with Google
                    {/* {googleLoading ? (
                            <Spinner className="h-5 w-5 mr-2" />
                        ) : (
                            <img
                                className="h-5 w-5"
                                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                alt="Google Logo"
                            />
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'} */}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t dark:border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or with email
                        </span>
                    </div>
                </div>

                {/* Email Login Form */}
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
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
