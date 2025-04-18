"use server";

import { NextRequest } from "next/server";
import { getUserById } from "./actions/getUserById";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
) {
    const { id } = await props.params;
    return (await getUserById(id)).toNextResponse();
}
