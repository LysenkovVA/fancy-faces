"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../../../model/types/SubgroupEntity";
import { getSubgroupById } from "./actions/getSubgroupById";
import { deleteSubgroupById } from "./actions/deleteSubgroupById";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<SubgroupEntity | undefined>>> {
    await checkServerAuth();
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await getSubgroupById(id)).toNextResponse();
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<SubgroupEntity | undefined>>> {
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await deleteSubgroupById(id)).toNextResponse();
}
