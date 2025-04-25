"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "@/app/(private-routes)/(subgroups)/model/types/SubgroupEntity";
import { Prisma } from "@prisma/client";
import prisma from "@/database/client";
import { SubgroupFilterType } from "@/app/(private-routes)/(subgroups)/model/types/SubgroupFilterType";

export const getSubgroups = async (
    skip?: number,
    take?: number,
    search?: string,
    filters?: OptionalRecord<SubgroupFilterType, string[]>,
): Promise<ResponseData<SubgroupEntity[] | undefined>> => {
    try {
        // Поисковая строка
        const searchString: Prisma.SubgroupWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const antropologicalTypesFilters: Prisma.AntropologicalTypeWhereInput =
            {};
        if (filters?.["antropological-type"]) {
            antropologicalTypesFilters.OR = filters?.[
                "antropological-type"
            ].map((id) => {
                return { id: { equals: id } };
            });
        }

        const whereInput: Prisma.SubgroupWhereInput = {
            AND: {
                antropologicalType:
                    filters?.["antropological-type"] &&
                    filters?.["antropological-type"]?.length > 0
                        ? antropologicalTypesFilters
                        : undefined,
            },
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.subgroup.findMany({
                skip,
                take,
                where: whereInput,
                orderBy: [{ name: "asc" }],
                include: {
                    antropologicalType: true,
                },
            }),
            prisma.subgroup.count({ where: whereInput }),
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
