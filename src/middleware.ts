/**
 * Middleware - Защита всех маршрутов в приложении
 * https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
import { NextRequest, NextResponse } from "next/server";
import { Console } from "@/app/lib/console/consoleLog";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import dayjs from "dayjs";
import { getSession } from "@/app/lib/auth/cookies";

export async function middleware(request: NextRequest) {
    // Публичные маршруты
    if (
        request.nextUrl.pathname === "/" ||
        // request.nextUrl.pathname === "/denied" ||
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname.startsWith("/api/login") ||
        request.nextUrl.pathname.startsWith("/api/users/") // Маршрут получения пользователя по id
    ) {
        Console.Log(
            `[${dayjs(Date.now()).format("HH:mm:ss")}][middleware][${request.method}][Публичный маршрут][${request.nextUrl.pathname}][${request.nextUrl.searchParams.toString()}]`,
        );
        return NextResponse.next({ request });
    }
    // Защищенные маршруты
    else {
        Console.Warning(
            `[${dayjs(Date.now()).format("HH:mm:ss")}][middleware][${request.method}][Защищенный маршрут][${request.nextUrl.pathname}][${request.nextUrl.searchParams.toString()}]`,
        );

        const session = await getSession(true);

        // Если пользователь не авторизован
        if (!session) {
            if (request.nextUrl.pathname.startsWith("/api/")) {
                return ResponseData.NotAuthorized([
                    "Пользователь не авторизован",
                ]).toNextResponse();
            } else {
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_PATH}/login`,
                );
            }
        }
        // Пользователь авторизован
        else {
            // На странице /login перенаправляем на /subject
            if (request.nextUrl.pathname.startsWith("/login")) {
                // Перенаправляем на /subjects
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_PATH}/subjects`,
                );
            }
            // Остальные защищенные маршруты пропускаем, поскольку пользователь авторизован
            else {
                Console.Success(
                    `[${dayjs(Date.now()).format("HH:mm:ss")}][middleware][${request.method}][Маршрут разрешен][${request.nextUrl.pathname}][${request.nextUrl.searchParams.toString()}]`,
                );
                return NextResponse.next({ request });
            }
        }
    }
}

export const config = {
    matcher: [
        /*
         * Проверка всех маршрутов за исключением:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
        // "/api",
    ],
};
