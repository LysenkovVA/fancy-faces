"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "../../../../model/types/UserEntity";

export async function getUserById(
    id: string,
): Promise<ResponseData<UserEntity | undefined>> {
    try {
        if (!id) {
            return ResponseData.BadRequest([`ID пользователя не найден`]);
        }

        const candidate = await prisma.user.findFirst({
            where: { id },
            include: { userRole: true },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Пользователь с ID=${id} не найден`,
            ]);
        }

        return ResponseData.Ok<UserEntity>(candidate as UserEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
