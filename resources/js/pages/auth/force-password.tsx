import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function ForcePassword() {
    return (
        <AuthLayout
            title="Set Your Password"
            description={
                <>
                    For security, please set your{' '}
                    <span className="font-bold text-primary">new password</span>
                    .
                </>
            }
        >
            <Head title="Set Password" />

            <Form method="post" action="/force-password" className="space-y-4">
                {({ processing, errors }) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    className="h-11 pl-10"
                                    placeholder="Min. 8 characters"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <ShieldCheck className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    className="h-11 pl-10"
                                    placeholder="Repeat password"
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-11 w-full bg-primary font-bold shadow-xl"
                            disabled={processing}
                        >
                            {processing ? (
                                <Spinner className="mr-2" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Update Password
                        </Button>
                    </motion.div>
                )}
            </Form>
        </AuthLayout>
    );
}
