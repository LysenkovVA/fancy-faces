import { z } from "zod";

/**
 * Схема валидации
 */
export const AntropologicalTypeEntitySchema = z.object({
    name: z.string(),
});

export type AntropologicalTypeEntity = Omit<
    z.infer<typeof AntropologicalTypeEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
