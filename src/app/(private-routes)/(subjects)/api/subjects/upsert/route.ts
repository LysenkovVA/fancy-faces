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
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";
import { ConsoleColor, ConsoleLog } from "@/app/lib/console/consoleLog";
import sharp from "sharp";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SubjectEntity | undefined>>> {
    try {
        await checkServerAuth();

        const formData = await request.formData(); // <-- Pending...

        // Получаем данные из формы
        // Идентификатор
        const entityId = formData.get("entity-id") as string;

        // Объект
        const dataString = formData.get("entity-data") as string;
        const entityToSave = JSON.parse(dataString);

        // ConsoleLog("Validating data...", ConsoleColor.Yellow);

        // Валидация данных
        const validatedData = await validateObject(
            SubjectEntitySchema,
            entityToSave,
        );

        if (entityToSave.photos?.length > 0) {
            const buffer = new Buffer(entityToSave.photos[0].data, "base64");

            if (buffer) {
                const meta = await sharp(buffer).metadata();

                ConsoleLog(JSON.stringify(meta), ConsoleColor.Green);
            }
        }

        // ConsoleLog("Data validated...Upserting...", ConsoleColor.Yellow);

        // console.log(JSON.stringify(entityToSave.photosIdsToDelete));

        const upsertedData = await prisma.subject.upsert({
            create: {
                ...validatedData,
                // TODO DEBUG
                photos: entityToSave.photos
                    ? {
                          create: await Promise.all(
                              entityToSave.photos?.map((photo: PhotoEntity) => {
                                  const buffer = new Buffer(
                                      entityToSave.photos[0].data,
                                      "base64",
                                  );

                                  if (buffer) {
                                      // Возвращаем промис
                                      return sharp(buffer)
                                          .metadata()
                                          .then((metaData) => {
                                              return {
                                                  type: metaData.format,
                                                  size: metaData.size,
                                                  thumbnail: "",
                                                  data: photo.data,
                                                  extension: "todoIT",
                                              };
                                          });
                                  }
                              }),
                          ),
                      }
                    : undefined,
                // photos: entityToSave.photos
                //     ? {
                //           create: entityToSave.photos?.map(
                //               (photo: PhotoEntity) => {
                //                   return {
                //                       type: photo.type,
                //                       size: photo.size,
                //                       data: photo.data,
                //                   };
                //               },
                //           ),
                //       }
                //     : undefined,
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
                user: entityToSave.user?.id
                    ? { connect: { id: entityToSave.user?.id } }
                    : undefined,
            },
            update: {
                ...validatedData,
                photos: entityToSave.photos
                    ? {
                          // create: entityToSave.photos
                          //     ?.filter(
                          //         (photo: PhotoEntity) =>
                          //             photo.id === undefined || photo.id === "",
                          //     )
                          //     .map((photo: PhotoEntity) => {
                          //         return {
                          //             type: photo.type,
                          //             size: photo.size,
                          //             data: photo.data,
                          //         };
                          //     }),
                          create: await Promise.all(
                              entityToSave.photos
                                  ?.filter(
                                      (photo: PhotoEntity) =>
                                          photo.id === undefined ||
                                          photo.id === "",
                                  )
                                  .map((photo: PhotoEntity) => {
                                      const buffer = new Buffer(
                                          entityToSave.photos[0].data,
                                          "base64",
                                      );

                                      if (buffer) {
                                          // Возвращаем промис
                                          return sharp(buffer)
                                              .metadata()
                                              .then((metaData) => {
                                                  return sharp(buffer)
                                                      .resize({ width: 30 })
                                                      .blur()
                                                      .toBuffer()
                                                      .then((resizedData) => {
                                                          return {
                                                              type: metaData.format,
                                                              size: metaData.size,
                                                              thumbnail:
                                                                  resizedData.toString(
                                                                      "base64",
                                                                  ),
                                                              data: photo.data,
                                                              extension:
                                                                  "todoIT",
                                                          };
                                                      });
                                              });
                                      }
                                  }),
                          ),
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
                user: entityToSave.user?.id
                    ? { connect: { id: entityToSave.user?.id } }
                    : { disconnect: true },
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
            include: {
                photos: true,
                initiator: true,
                antropologicalType: true,
                subgroup: { include: { antropologicalType: true } },
                gender: true,
                viewType: true,
                user: { include: { userRole: true } },
            },
        });

        // ConsoleLog("Data upserted...", ConsoleColor.Yellow);

        return ResponseData.Ok(upsertedData as SubjectEntity).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
