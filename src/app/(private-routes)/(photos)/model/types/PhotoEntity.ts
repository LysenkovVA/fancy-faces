import { z } from "zod";
import { UserEntity } from "@/app/(private-routes)/(users)";

/**
 * Схема валидации PhotoEntity
 */
export const PhotoEntitySchema = z.object({
    type: z.string().nullish(),
    size: z.number().nullish(),
    data: z.string({ required_error: "Данные изображения не загружены" }),
    isDefault: z.boolean(),
});

export type PhotoEntity = Omit<
    z.infer<typeof PhotoEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    user?: UserEntity;
    createdAt?: Date;
    updatedAt?: Date;
};
