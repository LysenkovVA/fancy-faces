"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../../model/types/SubgroupEntity";
import { getSubgroups } from "./actions/getSubgroups";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SubgroupEntity[] | undefined>>> {
    await checkServerAuth();
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    return (
        await getSubgroups(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
        )
    ).toNextResponse();
}
