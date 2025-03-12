'use client';

import { Loader } from '@/components/loader';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/');
                },
            },
        });
    }, []);

    return (
        <Loader />
    );
}