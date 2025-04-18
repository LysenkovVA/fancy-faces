"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "../../model/types/UserEntity";
import { getUsers } from "./actions/getUsers";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<UserEntity[] | undefined>>> {
    await checkServerAuth();
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    return (
        await getUsers(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
        )
    ).toNextResponse();
}
