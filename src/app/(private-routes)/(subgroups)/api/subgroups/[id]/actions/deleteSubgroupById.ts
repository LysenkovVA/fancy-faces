"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../../../../model/types/SubgroupEntity";

export async function deleteSubgroupById(
    id: string,
): Promise<ResponseData<SubgroupEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.subgroup.delete({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Подгруппа с ID=${id} не была удален`,
            ]);
        }

        return ResponseData.Ok<SubgroupEntity>(candidate as SubgroupEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
