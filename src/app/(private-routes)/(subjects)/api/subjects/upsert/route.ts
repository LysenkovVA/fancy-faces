"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { validateObject } from "@/app/lib/validation/validateObject";
import {
    SubjectEntity,
    SubjectEntitySchema,
} from "../../../model/types/SubjectEntity";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SubjectEntity | undefined>>> {
    try {
        const formData = await request.formData();
        // Получаем данные из формы
        // Идентификатор
        const entityId = formData.get("entity-id") as string;

        // Объект
        const dataString = formData.get("entity-data") as string;
        const entityToSave = JSON.parse(dataString);

        // Валидация данных
        const validatedData = await validateObject(
            SubjectEntitySchema,
            entityToSave,
        );

        console.log(JSON.stringify(entityToSave.photosIdsToDelete));

        const upsertedData = await prisma.subject.upsert({
            create: {
                ...validatedData,
                photos: entityToSave.photos
                    ? {
                          create: entityToSave.photos?.map(
                              (photo: PhotoEntity) => {
                                  return {
                                      type: photo.type,
                                      size: photo.size,
                                      data: photo.data,
                                  };
                              },
                          ),
                      }
                    : undefined,
                initiator: entityToSave.initiator?.id
                    ? { connect: { id: entityToSave.initiator?.id } }
                    : undefined,
                antropologicalType: entityToSave.antropologicalType?.id
                    ? { connect: { id: entityToSave.antropologicalType?.id } }
                    : undefined,
                subgroup: entityToSave.subgroup?.id
                    ? { connect: { id: entityToSave.subgroup?.id } }
                    : undefined,
                gender: entityToSave.gender?.id
                    ? { connect: { id: entityToSave.gender?.id } }
                    : undefined,
                viewType: entityToSave.viewType?.id
                    ? { connect: { id: entityToSave.viewType?.id } }
                    : undefined,
            },
            update: {
                ...validatedData,
                photos: entityToSave.photos
                    ? {
                          create: entityToSave.photos
                              ?.filter(
                                  (photo: PhotoEntity) =>
                                      photo.id === undefined || photo.id === "",
                              )
                              .map((photo: PhotoEntity) => {
                                  return {
                                      type: photo.type,
                                      size: photo.size,
                                      data: photo.data,
                                  };
                              }),
                          delete: entityToSave.photosIdsToDelete?.map(
                              (id: string) => {
                                  return { id: id };
                              },
                          ),
                      }
                    : undefined,
                initiator: entityToSave.initiator?.id
                    ? { connect: { id: entityToSave.initiator?.id } }
                    : { disconnect: true },
                antropologicalType: entityToSave.antropologicalType?.id
                    ? { connect: { id: entityToSave.antropologicalType?.id } }
                    : { disconnect: true },
                subgroup: entityToSave.subgroup?.id
                    ? { connect: { id: entityToSave.subgroup?.id } }
                    : { disconnect: true },
                gender: entityToSave.gender?.id
                    ? { connect: { id: entityToSave.gender?.id } }
                    : { disconnect: true },
                viewType: entityToSave.viewType?.id
                    ? { connect: { id: entityToSave.viewType?.id } }
                    : { disconnect: true },
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
        });

        return ResponseData.Ok(upsertedData as SubjectEntity).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
