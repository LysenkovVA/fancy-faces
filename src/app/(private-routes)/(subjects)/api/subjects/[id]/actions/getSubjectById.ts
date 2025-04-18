"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../../../../model/types/SubjectEntity";
import prisma from "@/database/client";

/**
 * Получение Subject по Id (server)
 * @param id
 */
export async function getSubjectById(
    id: string,
): Promise<ResponseData<SubjectEntity | undefined>> {
    try {
        const candidate = await prisma.subject.findFirst({
            where: { id },
            include: {
                photos: true,
                initiator: true,
                antropologicalType: true,
                subgroup: true,
                gender: true,
                viewType: true,
                user: { include: { userRole: true } },
            },
        });

        if (!candidate) {
            return ResponseData.BadRequest([`Субъект с ID=${id} не найден`]);
        }

        return ResponseData.Ok<SubjectEntity>(candidate as SubjectEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
