import { validateObject } from "@/app/lib/validation/validateObject";
import { ZodError } from "zod";
import {
    AUTH_ENTITY_REQUIRED_LOGIN_ERROR,
    AUTH_ENTITY_REQUIRED_PASSWORD_ERROR,
    AUTH_ENTITY_STRING_LOGIN_ERROR,
    AUTH_ENTITY_STRING_PASSWORD_ERROR,
} from "../consts/errorMessages";
import { AuthEntitySchema } from "./AuthEntity";

describe("Валидация (Zod) AuthEntity", () => {
    test("Валидные данные успешно провалидировались", () => {
        const testData: any = {
            login: "user",
            password: "password",
        };

        validateObject(AuthEntitySchema, testData).then((validatedData) => {
            expect(validatedData.login).toBe("user");
            expect(validatedData.password).toBe("password");
        });
    });

    test("Выдается ошибка об отсутствующем поле login", () => {
        const testData: any = {
            password: "password",
        };

        validateObject(AuthEntitySchema, testData).catch((error) => {
            if (error instanceof ZodError) {
                const messages = error.errors.map((issue) => issue.message);
                expect(messages).toContain(AUTH_ENTITY_REQUIRED_LOGIN_ERROR);
            }
        });
    });

    test("Выдается ошибка о том, что поле login должно быть строкой", () => {
        const testData: any = {
            login: 1234,
            password: "password",
        };

        validateObject(AuthEntitySchema, testData).catch((error) => {
            if (error instanceof ZodError) {
                const messages = error.errors.map((issue) => issue.message);
                expect(messages).toContain(AUTH_ENTITY_STRING_LOGIN_ERROR);
            }
        });
    });

    test("Выдается ошибка об отсутствующем поле password", () => {
        const testData: any = {
            login: "user",
        };

        validateObject(AuthEntitySchema, testData).catch((error) => {
            if (error instanceof ZodError) {
                const messages = error.errors.map((issue) => issue.message);
                expect(messages).toContain(AUTH_ENTITY_REQUIRED_PASSWORD_ERROR);
            }
        });
    });

    test("Выдается ошибка о том, что поле password должно быть строкой", () => {
        const testData: any = {
            login: "user",
            password: 1234,
        };

        validateObject(AuthEntitySchema, testData).catch((error) => {
            if (error instanceof ZodError) {
                const messages = error.errors.map((issue) => issue.message);
                expect(messages).toContain(AUTH_ENTITY_STRING_PASSWORD_ERROR);
            }
        });
    });
});
