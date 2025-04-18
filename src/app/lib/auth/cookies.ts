"use server";
import { cookies } from "next/headers";
import {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "./jwt";
import { UserEntity } from "@/app/(private-routes)/(users)";
import { Console } from "@/app/lib/console/consoleLog";
import dayjs from "dayjs";
import { SessionData } from "./types";

export async function getSession(refreshIfNeeded: boolean = false) {
    const session = (await cookies()).get("accessToken")?.value;
    if (!session) {
        Console.Error(
            `[${dayjs(Date.now()).format("HH:mm:ss")}][Access token невалиден]`,
        );
        if (!refreshIfNeeded) {
            Console.Error(
                `[${dayjs(Date.now()).format("HH:mm:ss")}][Обновление access token не предусматривалось]`,
            );
            return null;
        } else {
            const result = await refreshSession();

            if (!result) {
                Console.Error(
                    `[${dayjs(Date.now()).format("HH:mm:ss")}][Refresh token невалиден]`,
                );
            } else {
                Console.Success(
                    `[${dayjs(Date.now()).format("HH:mm:ss")}][Access token обновлен]`,
                );
            }

            const refreshedSession = (await cookies()).get(
                "accessToken",
            )?.value;

            if (!refreshedSession) {
                return null;
            }

            return await verifyAccessToken(refreshedSession);
        }
    } else {
        return await verifyAccessToken(session);
    }
}

export async function setSession(user: UserEntity) {
    const expiresInAccess = new Date(
        Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER),
    );

    const sessionAccess: SessionData = {
        user: { id: user.id! },
        expiresAt: expiresInAccess.toISOString(),
    };

    const encryptedSessionAccessToken = await createAccessToken(sessionAccess);

    (await cookies()).set("accessToken", encryptedSessionAccessToken, {
        expires: expiresInAccess,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });

    const expiresInRefresh = new Date(
        Date.now() + Number(process.env.REFRESH_TOKEN_LIVE_NUMBER),
    );

    const sessionRefresh: SessionData = {
        user: { id: user.id! },
        expiresAt: expiresInRefresh.toISOString(),
    };

    const encryptedSessionRefreshToken =
        await createRefreshToken(sessionRefresh);

    (await cookies()).set("refreshToken", encryptedSessionRefreshToken, {
        expires: expiresInRefresh,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });

    return {
        accessToken: encryptedSessionAccessToken,
        refreshToken: encryptedSessionRefreshToken,
    };
}

export async function clearSession() {
    // clear session
    const c = await cookies();
    c.getAll().forEach((cookie) => c.delete(cookie.name));
}

export async function refreshSession() {
    // Получаем refreshToken
    const refreshToken = (await cookies()).get("refreshToken")?.value;
    if (!refreshToken) return null;

    const sessionData = await verifyRefreshToken(refreshToken);
    if (!sessionData) return null;

    // Удаляем старый accessToken
    const c = await cookies();
    c.delete("accessToken");

    // Генерим новый access token
    const expiresIn = new Date(
        Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER),
    );
    const session: SessionData = {
        user: { id: sessionData.user.id },
        expiresAt: expiresIn.toISOString(),
    };

    const encryptedSessionAccessToken = await createAccessToken(session);

    (await cookies()).set("accessToken", encryptedSessionAccessToken, {
        expires: expiresIn,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });

    return {
        accessToken: encryptedSessionAccessToken,
        refreshToken,
    };
}
