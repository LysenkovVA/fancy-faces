"use server";

import { NextRequest, NextResponse } from "next/server";
import { validateObject } from "@/app/lib/validation/validateObject";
import prisma from "@/database/client";
import bcrypt from "bcryptjs";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { setSession } from "@/app/lib/auth/cookies";
import { AuthEntitySchema } from "@/app/(public-routes)/(login)";
import { UserEntity } from "@/app/(private-routes)/(users)";

export async function POST(request: NextRequest): Promise<
    NextResponse<
        ResponseData<
            | {
                  user: { id: string };
                  accessToken: string;
                  refreshToken: string;
              }
            | undefined
        >
    >
> {
    try {
        // Получение данных из запроса
        const data = await request.json();

        // Валидация
        const validatedData = await validateObject(AuthEntitySchema, data);

        // Получение пользователя
        const user = await prisma.user.findFirst({
            where: { login: validatedData.login },
            include: { userRole: true },
        });

        if (!user) {
            return ResponseData.BadRequest([
                "Пользователь не найден",
            ]).toNextResponse();
        }

        if (!bcrypt.compareSync(validatedData.password, user.hashedPassword)) {
            return ResponseData.BadRequest([
                "Неправильный пароль",
            ]).toNextResponse();
        }

        // Убираем пароль пользователя из user
        // const { hashedPassword, ...userData } = user;

        // Устанавливаем cookie и получаем токены
        const { accessToken, refreshToken } = await setSession(
            user as UserEntity,
        );

        return ResponseData.Ok({
            user: { id: user.id },
            accessToken,
            refreshToken,
        }).toNextResponse();
    } catch (error) {
        return ResponseData.Error(error).toNextResponse();
    }
}
