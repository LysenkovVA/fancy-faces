import { z } from "zod";
import { AntropologicalTypeEntity } from "@/app/(private-routes)/(antropological-types)";

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
    antropologicalType: AntropologicalTypeEntity;
    createdAt?: Date;
    updatedAt?: Date;
};
