import { z } from "zod";

/**
 * Схема валидации PhotoEntity
 */
export const PhotoEntitySchema = z.object({
    type: z.string().nullish(),
    size: z.number().nullish(),
    data: z.string({ required_error: "Данные изображения не загружены" }),
});

export type PhotoEntity = Omit<
    z.infer<typeof PhotoEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
