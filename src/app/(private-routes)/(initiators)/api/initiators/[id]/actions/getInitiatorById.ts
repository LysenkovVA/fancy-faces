"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { InitiatorEntity } from "../../../../model/types/InitiatorEntity";
import prisma from "@/database/client";

/**
 * Получение Initiator по Id (server)
 * @param id
 */
export async function getInitiatorById(
    id: string,
): Promise<ResponseData<InitiatorEntity | undefined>> {
    try {
        const candidate = await prisma.initiator.findFirst({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([`Инициатор с ID=${id} не найден`]);
        }

        return ResponseData.Ok<InitiatorEntity>(candidate as InitiatorEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
