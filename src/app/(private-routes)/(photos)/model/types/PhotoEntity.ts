import { z } from "zod";
import { UserEntity } from "@/app/(private-routes)/(users)";
import { SubjectEntity } from "@/app/(private-routes)/(subjects)";

/**
 * Схема валидации PhotoEntity
 */
export const PhotoEntitySchema = z.object({
    type: z.string({ required_error: "Тип файла изображения отсутствует" }),
    size: z.number({ required_error: "Размер файла изображения отсутствует" }),
    extension: z.string({
        required_error: "Расширение файла изображения отсутствует",
    }),
    thumbnail: z.string({
        required_error: "Данные предпросмотра изображения отсутствуют",
    }),
    data: z.string().nullish(),
    isDefault: z.boolean({
        required_error: "Флаг изображения по умолчанию отсутствует",
    }),
});

export type PhotoEntity = Omit<
    z.infer<typeof PhotoEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    user?: UserEntity;
    subject?: SubjectEntity;
    createdAt?: Date;
    updatedAt?: Date;
};
