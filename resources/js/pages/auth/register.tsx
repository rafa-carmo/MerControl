import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { trans } from '@/composables/translate';

export default function Register() {
    return (
        <AuthLayout title={trans("Create an account")} description={trans("Enter your details below to create your account")}>
            <Head title={trans("Register")} />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{trans("Name")}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{trans("Email address")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@email.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{trans("Password")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={trans("Password")}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{trans("Confirm password")}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={trans("Confirm password")}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {trans("Register")}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground space-x-2">
                            <span>{trans("Already have an account?")}</span>
                            <TextLink href={login()} tabIndex={6}>
                                {trans("Log in")}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
