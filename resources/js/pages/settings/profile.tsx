import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { ApiToken, type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { trans } from '@/composables/translate';
import { TokenGenerate } from './_TokenGenerate';
import { useState } from 'react';
import { toast } from 'sonner';
import { fetchWithCsrf } from '@/utils/fetch';
import { revokeToken } from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

async function handleRevokeToken(id: number) {
    return await fetchWithCsrf().delete(revokeToken(id).url)
}


export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [tokens, setTokens] = useState<ApiToken[]>(auth.user.tokens || []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={trans("Profile information")} description={trans("Update your name and email address")} />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{trans("Name")}</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder={trans("Full name")}
                                    />

                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{trans("Email address")}</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder={trans("Email address")}
                                    />

                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            {trans("Your email address is unverified.")}{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                {trans("Click here to resend the verification email.")}
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                {trans("A new verification link has been sent to your email address.")}
                                            </div>
                                        )}
                                    </div>
                                )}


                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>{trans("Save")}</Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">{trans("Saved.")}</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
                <div className='space-y-6'>
                    <HeadingSmall title={trans("API Tokens")} description={trans("Manage your API tokens here. You can create, revoke, and regenerate tokens.")} />
                    <TokenGenerate updateTokens={(token: ApiToken) => {
                        setTokens((prev) => [...prev, token])
                        toast.success(trans("Token created successfully."));
                    }}
                    />
                    <div className="rounded-lg border border-border bg-card p-6">
                        {
                            tokens.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {tokens.map((token) => (
                                        <li key={token.id} className="text-sm text-foreground flex flex-col gap-1 p-2 border border-border rounded relative">
                                            {token.name}
                                            <span className="text-xs text-muted-foreground">
                                                Created at: {new Date(token.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Expires at: {token.expires_at ? new Date(token.expires_at).toLocaleDateString() : 'Never'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Last used: {token.last_used_at ? new Date(token.last_used_at).toLocaleDateString() : 'Never'}
                                            </span>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className='absolute right-2 top-2 text-sm text-muted-foreground hover:text-foreground' >
                                                        <span className='sr-only'>{trans("Revoke")}</span>
                                                        <Trash className='size-4 pointer-events-auto' />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{trans("Revoke API Token")}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {trans("Are you sure you want to revoke this API token?")}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>{trans("Cancel")}</AlertDialogCancel>
                                                        <AlertDialogAction asChild>
                                                            <Button variant="destructive" onClick={() => {
                                                                handleRevokeToken(token.id).then(() => {
                                                                    setTokens((prev) => prev.filter(t => t.id !== token.id));
                                                                });
                                                            }}>
                                                                {trans("Revoke")}
                                                            </Button>
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">{trans("No API tokens found.")}</p>
                            )}
                    </div>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
