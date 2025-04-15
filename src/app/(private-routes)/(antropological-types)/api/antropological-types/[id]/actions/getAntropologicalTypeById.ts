"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../../../../model/types/AntropologicalTypeEntity";
import prisma from "@/database/client";

/**
 * Получение AntropologicalType по Id (server)
 * @param id
 */
export async function getAntropologicalTypeById(
    id: string,
): Promise<ResponseData<AntropologicalTypeEntity | undefined>> {
    try {
        const candidate = await prisma.antropologicalType.findFirst({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Тип должности с ID=${id} не найден`,
            ]);
        }

        return ResponseData.Ok<AntropologicalTypeEntity>(
            candidate as AntropologicalTypeEntity,
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
