import { z } from "zod";
import {
    AUTH_ENTITY_REQUIRED_LOGIN_ERROR,
    AUTH_ENTITY_REQUIRED_PASSWORD_ERROR,
    AUTH_ENTITY_STRING_LOGIN_ERROR,
    AUTH_ENTITY_STRING_PASSWORD_ERROR,
} from "../consts/errorMessages";

export const AuthEntitySchema = z.object({
    login: z.string({
        required_error: AUTH_ENTITY_REQUIRED_LOGIN_ERROR,
        invalid_type_error: AUTH_ENTITY_STRING_LOGIN_ERROR,
    }),
    password: z.string({
        required_error: AUTH_ENTITY_REQUIRED_PASSWORD_ERROR,
        invalid_type_error: AUTH_ENTITY_STRING_PASSWORD_ERROR,
    }),
});

export type AuthEntity = z.infer<typeof AuthEntitySchema>;
