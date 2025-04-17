import { z } from "zod";

/**
 * Схема валидации
 */
export const InitiatorEntitySchema = z.object({
    name: z.string(),
});

export type InitiatorEntity = Omit<
    z.infer<typeof InitiatorEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
