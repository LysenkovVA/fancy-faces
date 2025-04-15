"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../../../../model/types/AntropologicalTypeEntity";

export async function deleteAntropologicalTypeById(
    id: string,
): Promise<ResponseData<AntropologicalTypeEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.antropologicalType.delete({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Антропологический тип с ID=${id} не был удален`,
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
