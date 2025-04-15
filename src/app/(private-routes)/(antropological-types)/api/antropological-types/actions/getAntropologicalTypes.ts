"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../../../model/types/AntropologicalTypeEntity";
import prisma from "@/database/client";
import { Prisma } from "@prisma/client";

export async function getAntropologicalTypes(
    skip?: number,
    take?: number,
    search?: string,
): Promise<ResponseData<AntropologicalTypeEntity[] | undefined>> {
    try {
        // Поисковая строка
        const searchString: Prisma.AntropologicalTypeWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const filters: Prisma.AntropologicalTypeWhereInput = {
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.antropologicalType.findMany({
                skip,
                take,
                where: filters,
                orderBy: [{ name: "asc" }],
            }),
            prisma.antropologicalType.count({ where: filters }),
        ]);

        return ResponseData.Ok<AntropologicalTypeEntity[]>(
            entities as AntropologicalTypeEntity[],
            {
                take,
                skip,
                search,
                total: totalCount,
            },
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
