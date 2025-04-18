"use server";

import { UserEntity } from "@/app/(private-routes)/(users)";
import { getSession } from "@/app/lib/auth/cookies";
import { getUserById } from "./getUserById";
import { Console } from "@/app/lib/console/consoleLog";
import dayjs from "dayjs";
import { ResponseData } from "@/app/lib/responses/ResponseData";

/**
 * Получение текущего авторизованного пользователя
 * из файлов cookie
 */
export async function getSessionUser(
    refreshIfNeeded: boolean = false,
): Promise<UserEntity | undefined> {
    try {
        const sessionData = await getSession(refreshIfNeeded);

        if (!sessionData) {
            return undefined;
        }

        const data = await getUserById(sessionData.user.id);

        if (!data.isOk) {
            return undefined;
        } else {
            return data.data;
        }
    } catch (error) {
        // Неизвестная ошибка
        Console.Error(
            `[${dayjs(Date.now()).format("HH:mm:ss")}][${ResponseData.Error(error).getAllErrors()}]`,
        );
        return undefined;
    }
}
