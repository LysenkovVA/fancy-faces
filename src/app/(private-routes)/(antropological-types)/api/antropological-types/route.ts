"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../../model/types/AntropologicalTypeEntity";
import { getAntropologicalTypes } from "./actions/getAntropologicalTypes";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<AntropologicalTypeEntity[] | undefined>>> {
    await checkServerAuth();

    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    return (
        await getAntropologicalTypes(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
            undefined,
        )
    ).toNextResponse();
}
