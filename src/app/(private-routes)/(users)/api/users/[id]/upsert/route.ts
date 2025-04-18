"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { validateObject } from "@/app/lib/validation/validateObject";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";
import { UserEntity, UserEntitySchema } from "@/app/(private-routes)/(users)";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<UserEntity | undefined>>> {
    try {
        await checkServerAuth();
        const formData = await request.formData();
        // Получаем данные из формы
        // Идентификатор
        const entityId = formData.get("entity-id") as string;

        // Объект
        const dataString = formData.get("entity-data") as string;
        const entityToSave = JSON.parse(dataString);

        // Валидация данных
        const validatedData = await validateObject(
            UserEntitySchema,
            entityToSave,
        );

        const upsertedData = await prisma.user.upsert({
            create: {
                ...validatedData,
                userRole: entityToSave.userRole,
            },
            update: {
                ...validatedData,
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
            include: { userRole: true },
        });

        return ResponseData.Ok(upsertedData as UserEntity).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
