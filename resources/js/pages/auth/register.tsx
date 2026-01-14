import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout 
            title="Get started" 
            description={<>Join 10k+ users and start your <span className="text-primary font-bold">14-day free trial</span>.</>}
        >
            <Head title="Register" />

            <Form {...store.form()} resetOnSuccess={['password', 'password_confirmation']} className="space-y-4">
                {({ processing, errors }) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input id="name" name="name" required className="h-11 pl-10" placeholder="Alex Rivera" />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input id="email" type="email" name="email" required className="h-11 pl-10" placeholder="alex@example.com" />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input id="password" type="password" name="password" required className="h-11 pl-10" placeholder="Min. 8 characters" />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input id="password_confirmation" type="password" name="password_confirmation" required className="h-11 pl-10" placeholder="Repeat password" />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" className="mt-2 h-11 w-full bg-primary font-bold shadow-xl" disabled={processing}>
                            {processing ? <Spinner className="mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Create Account
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account? <TextLink href={login()} className="font-bold text-foreground">Log in</TextLink>
                        </p>
                    </motion.div>
                )}
            </Form>
        </AuthLayout>
    );
}