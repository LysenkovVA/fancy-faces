import { z } from "zod";

/**
 * Схема валидации ViewTypeEntity
 */
export const ViewTypeEntitySchema = z.object({
    name: z.string(),
});

export type ViewTypeEntity = Omit<
    z.infer<typeof ViewTypeEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
