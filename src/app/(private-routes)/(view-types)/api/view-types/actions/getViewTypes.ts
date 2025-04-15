"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ViewTypeEntity } from "../../../model/types/ViewTypeEntity";
import prisma from "@/database/client";
import { Prisma } from "@prisma/client";

export async function getViewTypes(
    skip?: number,
    take?: number,
    search?: string,
): Promise<ResponseData<ViewTypeEntity[] | undefined>> {
    try {
        // Поисковая строка
        const searchString: Prisma.ViewTypeWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const filters: Prisma.ViewTypeWhereInput = {
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.viewType.findMany({
                skip,
                take,
                where: filters,
                orderBy: [{ name: "asc" }],
            }),
            prisma.viewType.count({ where: filters }),
        ]);

        return ResponseData.Ok<ViewTypeEntity[]>(entities as ViewTypeEntity[], {
            take,
            skip,
            search,
            total: totalCount,
        });
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
