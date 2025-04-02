import { db } from "@/lib/database";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = (await params).id;
    const user = await db.selectFrom("user").selectAll().where("id", "=", userId).executeTakeFirst();

    if (!user) {
        return new Response(null, { status: 404 });
    }

    if (!user.skin) {
        await db.updateTable("user").set({ skin: "red" }).where("id", "=", userId).execute();
    }

    return redirect(`${process.env.NEXT_PUBLIC_BASE}/skins/${user.skin || "red"}.webp`);
}