"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../../model/types/SubgroupEntity";
import { getSubgroups } from "./actions/getSubgroups";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";
import { SubgroupFilterType } from "@/app/(private-routes)/(subgroups)/model/types/SubgroupFilterType";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SubgroupEntity[] | undefined>>> {
    await checkServerAuth();
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");
    const antropologicalTypes = searchParams.getAll("antropological-type");

    // Объект фильтров
    const filters: OptionalRecord<SubgroupFilterType, string[]> = {
        "antropological-type": antropologicalTypes,
    };

    return (
        await getSubgroups(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
            filters,
        )
    ).toNextResponse();
}
