"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../../../../model/types/SubjectEntity";

export async function deleteSubjectById(
    id: string,
): Promise<ResponseData<SubjectEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.subject.delete({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Субъект с ID=${id} не был удален`,
            ]);
        }

        return ResponseData.Ok<SubjectEntity>(candidate as SubjectEntity);
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
