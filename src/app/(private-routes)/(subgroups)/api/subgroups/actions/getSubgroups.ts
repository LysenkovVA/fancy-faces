"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "@/app/(private-routes)/(subgroups)/model/types/SubgroupEntity";
import { Prisma } from "@prisma/client";
import prisma from "@/database/client";

export const getSubgroups = async (
    skip?: number,
    take?: number,
    search?: string,
): Promise<ResponseData<SubgroupEntity[] | undefined>> => {
    try {
        // Поисковая строка
        const searchString: Prisma.SubgroupWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const filters: Prisma.SubgroupWhereInput = {
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.subgroup.findMany({
                skip,
                take,
                where: filters,
                orderBy: [{ name: "asc" }],
                include: {
                    antropologicalType: true,
                },
            }),
            prisma.subgroup.count({ where: filters }),
        ]);

        return ResponseData.Ok<SubgroupEntity[]>(entities as SubgroupEntity[], {
            take,
            skip,
            search,
            total: totalCount,
        });
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
};
