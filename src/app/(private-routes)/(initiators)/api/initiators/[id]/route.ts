"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { InitiatorEntity } from "../../../model/types/InitiatorEntity";
import { getInitiatorById } from "./actions/getInitiatorById";
import { deleteInitiatorById } from "./actions/deleteInitiatorById";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<InitiatorEntity | undefined>>> {
    await checkServerAuth();
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await getInitiatorById(id)).toNextResponse();
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<InitiatorEntity | undefined>>> {
    await checkServerAuth();
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await deleteInitiatorById(id)).toNextResponse();
}
