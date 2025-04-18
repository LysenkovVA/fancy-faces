"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../../../model/types/SubjectEntity";
import { getSubjectById } from "./actions/getSubjectById";
import { deleteSubjectById } from "./actions/deleteSubjectById";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<SubjectEntity | undefined>>> {
    await checkServerAuth();
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await getSubjectById(id)).toNextResponse();
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<SubjectEntity | undefined>>> {
    await checkServerAuth();
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await deleteSubjectById(id)).toNextResponse();
}
