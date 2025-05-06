"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";

/**
 * Получение Photo по Id (server)
 * @param id
 */
export async function getPhotoById(
    id: string,
): Promise<ResponseData<PhotoEntity | undefined>> {
    try {
        const candidate = await prisma.photo.findFirst({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Изображение с ID=${id} не найдено`,
            ]);
        }

        return ResponseData.Ok<PhotoEntity>(candidate as PhotoEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
