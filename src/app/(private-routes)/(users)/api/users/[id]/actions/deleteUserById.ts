"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "../../../../model/types/UserEntity";

export async function deleteUserById(
    id: string,
): Promise<ResponseData<UserEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.user.delete({
            where: { id },
            include: { userRole: true },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Пользователь с ID=${id} не была удален`,
            ]);
        }

        return ResponseData.Ok<UserEntity>(candidate as UserEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
