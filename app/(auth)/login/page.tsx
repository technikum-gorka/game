'use client';

import { useSession } from "@/hooks/use-session";
import { signIn } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function LoginPage() {
    const { user, isLoading } = useSession();

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    if (!user) {
        return signIn();
    }

    return redirect('/');
}