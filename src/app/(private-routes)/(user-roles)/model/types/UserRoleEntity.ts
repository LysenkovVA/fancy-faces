import { z } from "zod";

export const UserRoleEntitySchema = z.object({
    name: z.string(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
});

export type UserRoleEntity = Omit<
    z.infer<typeof UserRoleEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
