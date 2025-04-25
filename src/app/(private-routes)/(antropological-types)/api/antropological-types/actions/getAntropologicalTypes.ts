"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../../../model/types/AntropologicalTypeEntity";
import prisma from "@/database/client";
import { Prisma } from "@prisma/client";
import { AntropologicalTypeFilterType } from "@/app/(private-routes)/(antropological-types)/model/types/AntropologicalTypeFilterType";

export async function getAntropologicalTypes(
    skip?: number,
    take?: number,
    search?: string,
    filters?: OptionalRecord<AntropologicalTypeFilterType, string[]>,
): Promise<ResponseData<AntropologicalTypeEntity[] | undefined>> {
    try {
        // Поисковая строка
        const searchString: Prisma.AntropologicalTypeWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const whereInput: Prisma.AntropologicalTypeWhereInput = {
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.antropologicalType.findMany({
                skip,
                take,
                where: whereInput,
                orderBy: [{ name: "asc" }],
            }),
            prisma.antropologicalType.count({ where: whereInput }),
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
