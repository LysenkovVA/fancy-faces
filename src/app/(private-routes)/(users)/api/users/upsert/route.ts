"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { validateObject } from "@/app/lib/validation/validateObject";
import { UserEntity, UserEntitySchema } from "../../../model/types/UserEntity";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";
import { getUserById } from "../[id]/actions/getUserById";
import bcrypt from "bcryptjs";

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

        const userRole = await prisma.userRole.findFirst({
            where: { name: "USER" },
        });

        // Если у существующей записи нет аватара для сохранения
        if (entityToSave.id && !entityToSave.avatar?.id) {
            const candidate = await getUserById(entityToSave.id);

            // Если до этого был другой аватар
            if (candidate.isOk && candidate.data?.avatar?.id) {
                // Удаляем его
                await prisma.photo.delete({
                    where: { id: candidate.data?.avatar?.id },
                });
            }
        }

        const upsertedData = await prisma.user.upsert({
            create: {
                ...validatedData,
                hashedPassword: bcrypt.hashSync(
                    validatedData.hashedPassword,
                    10,
                ),
                avatar: entityToSave.avatar
                    ? {
                          create: {
                              type: entityToSave.avatar?.type,
                              size: entityToSave.avatar?.size,
                              data: entityToSave.avatar?.data,
                          },
                      }
                    : undefined,
                userRole: { connect: { id: userRole?.id } },
            },
            update: {
                ...validatedData,
                avatar: entityToSave.avatar
                    ? {
                          create: {
                              type: entityToSave.avatar?.type,
                              size: entityToSave.avatar?.size,
                              data: entityToSave.avatar?.data,
                          },
                      }
                    : undefined,
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
            include: { userRole: true, avatar: true },
        });

        return ResponseData.Ok(upsertedData as UserEntity).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
