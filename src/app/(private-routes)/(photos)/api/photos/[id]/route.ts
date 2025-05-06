import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";
import { getPhotoById } from "./actions/getPhotoById";
import { PhotoEntity } from "../../../model/types/PhotoEntity";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<PhotoEntity | undefined>>> {
    await checkServerAuth();
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await getPhotoById(id)).toNextResponse();
}
