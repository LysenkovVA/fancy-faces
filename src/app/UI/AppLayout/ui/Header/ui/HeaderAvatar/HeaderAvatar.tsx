"use client";

import React, { memo } from "react";
import { Picture } from "@/app/UI/Picture";
import {
    FOREGROUND_PRIMARY_COLOR,
    HEADER_HEIGHT,
} from "@/app/UI/AppLayout/config/consts";
import { Flex, Typography } from "antd";
import { useAppSelector } from "@/app/lib/store";
import { getAuthUser } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { useRouter } from "next/navigation";

export const HeaderAvatar = memo(() => {
    const authUser = useAppSelector(getAuthUser);
    const router = useRouter();

    return (
        <Flex
            style={{ cursor: "pointer" }}
            align={"center"}
            justify={"center"}
            gap={8}
            onClick={() => router.push(`/users/${authUser?.id}`)}
        >
            <Picture
                shape={"avatar"}
                pictureWidth={HEADER_HEIGHT - 20}
                pictureHeight={HEADER_HEIGHT - 20}
                value={authUser?.avatar ?? undefined}
            />
            <Typography.Text
                style={{
                    color: FOREGROUND_PRIMARY_COLOR,
                    fontWeight: "bold",
                    fontSize: 14,
                }}
                type={authUser?.id ? undefined : "danger"}
            >
                {authUser?.name ?? "Ошибка"}
            </Typography.Text>
        </Flex>
    );
});
