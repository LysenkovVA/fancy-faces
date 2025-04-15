"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import { GenderEntity } from "../../../model/types/GenderEntity";
import prisma from "@/database/client";
import { Prisma } from "@prisma/client";

export async function getGenders(
    skip?: number,
    take?: number,
    search?: string,
): Promise<ResponseData<GenderEntity[] | undefined>> {
    try {
        // Поисковая строка
        const searchString: Prisma.GenderWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const filters: Prisma.GenderWhereInput = {
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.gender.findMany({
                skip,
                take,
                where: filters,
                orderBy: [{ name: "asc" }],
            }),
            prisma.gender.count({ where: filters }),
        ]);

        return ResponseData.Ok<GenderEntity[]>(entities as GenderEntity[], {
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
