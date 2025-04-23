"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../../../../model/types/SubgroupEntity";
import prisma from "@/database/client";

/**
 * Получение Subgroup по Id (server)
 * @param id
 */
export async function getSubgroupById(
    id: string,
): Promise<ResponseData<SubgroupEntity | undefined>> {
    try {
        const candidate = await prisma.subgroup.findFirst({
            where: { id },
            include: {
                antropologicalType: true,
            },
        });

        if (!candidate) {
            return ResponseData.BadRequest([`Подгруппа с ID=${id} не найдена`]);
        }

        return ResponseData.Ok<SubgroupEntity>(candidate as SubgroupEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
