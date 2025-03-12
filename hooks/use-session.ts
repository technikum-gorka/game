'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import type { Session } from 'better-auth/types';
import type { User } from '@/lib/types';

export function useSession() {
    const [session, setSession] = useState<Session>();
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            try {
                const currentSession = await authClient.getSession();
                setSession(currentSession.data?.session);
                setUser(currentSession.data?.user as any);
                console.log(currentSession.data?.user);
            } catch (error) {
                setSession(undefined);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSession();
    }, []);

    return { session, user, isLoading };
}
