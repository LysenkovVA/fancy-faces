import { z } from "zod";

/**
 * Схема валидации GenderEntity
 */
export const GenderEntitySchema = z.object({
    name: z.string(),
});

export type GenderEntity = Omit<
    z.infer<typeof GenderEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
