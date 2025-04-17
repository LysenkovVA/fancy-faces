"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { InitiatorEntity } from "../../../../model/types/InitiatorEntity";

export async function deleteInitiatorById(
    id: string,
): Promise<ResponseData<InitiatorEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.initiator.delete({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Инициатор с ID=${id} не был удален`,
            ]);
        }

        return ResponseData.Ok<InitiatorEntity>(candidate as InitiatorEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
