"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "@/app/(private-routes)/(users)/model/types/UserEntity";
import { Prisma } from "@prisma/client";
import prisma from "@/database/client";

export const getUsers = async (
    skip?: number,
    take?: number,
    search?: string,
): Promise<ResponseData<UserEntity[] | undefined>> => {
    try {
        // Поисковая строка
        const searchString: Prisma.UserWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [{ name: { contains: search } }];
        }

        const filters: Prisma.UserWhereInput = {
            userRole: { name: "USER" },
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.user.findMany({
                skip,
                take,
                where: filters,
                orderBy: [{ name: "asc" }],
                include: { userRole: true },
            }),
            prisma.user.count({ where: filters }),
        ]);

        return ResponseData.Ok<UserEntity[]>(entities as UserEntity[], {
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
