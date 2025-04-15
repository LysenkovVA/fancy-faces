"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ViewTypeEntity } from "../../model/types/ViewTypeEntity";
import { getViewTypes } from "./actions/getViewTypes";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<ViewTypeEntity[] | undefined>>> {
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    return (
        await getViewTypes(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
        )
    ).toNextResponse();
}
