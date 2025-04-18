"use server";

import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "./actions/getUserById";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "@/app/(private-routes)/(users)";
import { deleteUserById } from "@/app/(private-routes)/(users)/api/users/[id]/actions/deleteUserById";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
) {
    const { id } = await props.params;
    return (await getUserById(id)).toNextResponse();
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<UserEntity | undefined>>> {
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await deleteUserById(id)).toNextResponse();
}
