"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { checkServerAuth } from "@/app/lib/auth/AuthenticatedUser";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<boolean | undefined>>> {
    try {
        const { id } = await props.params;

        await checkServerAuth();
        const formData = await request.formData();

        // Объект
        const stringData = formData.get("data") as string;
        const data = JSON.parse(stringData);

        const { newLogin } = data;

        if (newLogin !== undefined || newLogin !== "") {
            const found = await prisma.user.findFirst({
                where: { login: newLogin },
            });

            if (found) {
                return ResponseData.Error(
                    `Пользователь с логином ${newLogin} уже существует!`,
                ).toNextResponse();
            } else {
                const candidate = await prisma.user.findFirst({
                    where: { id: id },
                });

                if (candidate) {
                    const result = await prisma.user.update({
                        data: {
                            ...candidate,
                            login: newLogin,
                        },
                        include: { userRole: true },
                        where: { id: candidate.id },
                    });

                    return ResponseData.Ok<boolean>(true).toNextResponse();
                }
            }
        }

        return ResponseData.Ok<boolean>(false).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
