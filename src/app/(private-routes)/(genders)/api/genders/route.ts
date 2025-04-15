"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { GenderEntity } from "../../model/types/GenderEntity";
import { getGenders } from "./actions/getGenders";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<GenderEntity[] | undefined>>> {
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    return (
        await getGenders(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
        )
    ).toNextResponse();
}
