"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "@/app/(private-routes)/(subjects)/model/types/SubjectEntity";
import { Prisma } from "@prisma/client";
import prisma from "@/database/client";
import { SubjectFilterType } from "@/app/(private-routes)/(subjects)/model/types/SubjectFilterType";

export const getSubjects = async (
    skip?: number,
    take?: number,
    search?: string,
    filters?: OptionalRecord<SubjectFilterType, string[]>,
): Promise<ResponseData<SubjectEntity[] | undefined>> => {
    try {
        // Поисковая строка
        const searchString: Prisma.SubjectWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [
                {
                    initiator: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                { objectNumber: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
                {
                    antropologicalType: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    subgroup: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                { gender: { name: { contains: search, mode: "insensitive" } } },
                { age: { contains: search, mode: "insensitive" } },
                {
                    durationOfObservation: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                { lastObservation: { contains: search, mode: "insensitive" } },
                {
                    viewType: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    eyewitnessCharacteristics: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    anatomicCharacteristics: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    functionalCharacteristics: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                { face: { contains: search, mode: "insensitive" } },
                { forehead: { contains: search, mode: "insensitive" } },
                { eyes: { contains: search, mode: "insensitive" } },
                { mouth: { contains: search, mode: "insensitive" } },
                { scars: { contains: search, mode: "insensitive" } },
                { hear: { contains: search, mode: "insensitive" } },
                { eyebrow: { contains: search, mode: "insensitive" } },
                { nose: { contains: search, mode: "insensitive" } },
                { chin: { contains: search, mode: "insensitive" } },
                { ears: { contains: search, mode: "insensitive" } },
                { portraitMatch: { contains: search, mode: "insensitive" } },
                { notes: { contains: search, mode: "insensitive" } },
            ];
        }

        const initiatorFilters: Prisma.InitiatorWhereInput = {};
        if (filters?.["initiator"]) {
            initiatorFilters.OR = filters?.["initiator"].map((id) => {
                return { id: { equals: id } };
            });
        }

        const genderFilters: Prisma.GenderWhereInput = {};
        if (filters?.["gender"]) {
            genderFilters.OR = filters?.["gender"].map((id) => {
                return { id: { equals: id } };
            });
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

        const subgroupFilters: Prisma.SubgroupWhereInput = {};
        if (filters?.["subgroup"]) {
            subgroupFilters.OR = filters?.["subgroup"].map((id) => {
                return { id: { equals: id } };
            });
        }

        const viewTypeFilters: Prisma.ViewTypeWhereInput = {};
        if (filters?.["view-type"]) {
            viewTypeFilters.OR = filters?.["view-type"].map((id) => {
                return { id: { equals: id } };
            });
        }

        const whereInput: Prisma.SubjectWhereInput = {
            AND: {
                initiator:
                    filters?.["initiator"] && filters?.["initiator"]?.length > 0
                        ? initiatorFilters
                        : undefined,
                gender:
                    filters?.["gender"] && filters?.["gender"]?.length > 0
                        ? genderFilters
                        : undefined,
                antropologicalType:
                    filters?.["antropological-type"] &&
                    filters?.["antropological-type"]?.length > 0
                        ? antropologicalTypesFilters
                        : undefined,
                subgroup:
                    filters?.["subgroup"] && filters?.["subgroup"]?.length > 0
                        ? subgroupFilters
                        : undefined,
                viewType:
                    filters?.["view-type"] && filters?.["view-type"]?.length > 0
                        ? viewTypeFilters
                        : undefined,
            },
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.subject.findMany({
                skip,
                take,
                where: whereInput,
                orderBy: [{ name: "asc" }],
                include: {
                    initiator: true,
                    antropologicalType: true,
                    subgroup: { include: { antropologicalType: true } },
                    gender: true,
                    user: { include: { userRole: true } },
                    viewType: true,
                    photos: true,
                },
            }),
            prisma.subject.count({ where: whereInput }),
        ]);

        return ResponseData.Ok<SubjectEntity[]>(entities as SubjectEntity[], {
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
