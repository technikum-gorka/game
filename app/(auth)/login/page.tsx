'use client';

import { Loader } from "@/components/loader";
import { useSession } from "@/hooks/use-session";
import { signIn } from "@/lib/auth-client";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, isLoading } = useSession();

    useEffect(() => {
        if (!user && !isLoading) {
            signIn();
        }
    }, [user, isLoading]);

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <h1>You are already logged in.</h1>
        </div>
    )
}