import { z } from "zod";

/**
 * Схема валидации
 */
export const SubgroupEntitySchema = z.object({
    name: z.string(),
});

export type SubgroupEntity = Omit<
    z.infer<typeof SubgroupEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
