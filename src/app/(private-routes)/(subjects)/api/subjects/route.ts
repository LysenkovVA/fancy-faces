"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import { getSubjects } from "./actions/getSubjects";
import { SubjectFilterType } from "@/app/(private-routes)/(subjects)/model/types/SubjectFilterType";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SubjectEntity[] | undefined>>> {
    await checkServerAuth();
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    const initiators = searchParams.getAll("initiator");
    const genders = searchParams.getAll("gender");
    const antropologicalTypes = searchParams.getAll("antropological-type");
    const subgroups = searchParams.getAll("subgroup");
    const viewTypes = searchParams.getAll("view-type");

    // Объект фильтров
    const filters: OptionalRecord<SubjectFilterType, string[]> = {
        initiator: initiators,
        gender: genders,
        "antropological-type": antropologicalTypes,
        subgroup: subgroups,
        "view-type": viewTypes,
    };

    return (
        await getSubjects(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
            filters,
        )
    ).toNextResponse();
}
