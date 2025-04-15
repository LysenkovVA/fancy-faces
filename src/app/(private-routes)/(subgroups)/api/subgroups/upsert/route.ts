"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { validateObject } from "@/app/lib/validation/validateObject";
import {
    SubgroupEntity,
    SubgroupEntitySchema,
} from "../../../model/types/SubgroupEntity";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SubgroupEntity | undefined>>> {
    try {
        const formData = await request.formData();
        // Получаем данные из формы
        // Идентификатор
        const entityId = formData.get("entity-id") as string;

        // Объект
        const dataString = formData.get("entity-data") as string;
        const entityToSave = JSON.parse(dataString);

        // Валидация данных
        const validatedData = await validateObject(
            SubgroupEntitySchema,
            entityToSave,
        );

        const upsertedData = await prisma.subgroup.upsert({
            create: {
                ...validatedData,
            },
            update: {
                ...validatedData,
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
        });

        return ResponseData.Ok(upsertedData as SubgroupEntity).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
