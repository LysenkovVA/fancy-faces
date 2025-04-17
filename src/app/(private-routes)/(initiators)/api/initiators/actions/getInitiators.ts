"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { InitiatorEntity } from "@/app/(private-routes)/(initiators)/model/types/InitiatorEntity";
import { Prisma } from "@prisma/client";
import prisma from "@/database/client";

export const getInitiators = async (
    skip?: number,
    take?: number,
    search?: string,
): Promise<ResponseData<InitiatorEntity[] | undefined>> => {
    try {
        // Поисковая строка
        const searchString: Prisma.InitiatorWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const filters: Prisma.InitiatorWhereInput = {
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.initiator.findMany({
                skip,
                take,
                where: filters,
                orderBy: [{ name: "asc" }],
            }),
            prisma.initiator.count({ where: filters }),
        ]);

        return ResponseData.Ok<InitiatorEntity[]>(
            entities as InitiatorEntity[],
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
};
