import { z } from "zod";
import { UserRoleEntity } from "@/app/(private-routes)/(user-roles)/model/types/UserRoleEntity";

export const UserEntitySchema = z.object({
    avatar: z.string().nullish(),
    login: z.string(),
    hashedPassword: z.string(),
    surname: z.string(),
    name: z.string(),
    patronymic: z.string(),

    // createdAt: z.string().datetime({ offset: true }).optional(),
    // updatedAt: z.string().datetime({ offset: true }).optional(),
});

export type UserEntity = Omit<
    z.infer<typeof UserEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    userRole: UserRoleEntity;
    createdAt?: Date;
    updatedAt?: Date;
};
