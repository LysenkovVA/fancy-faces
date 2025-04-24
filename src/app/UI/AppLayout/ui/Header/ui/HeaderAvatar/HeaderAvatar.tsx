"use client";

import React, { memo } from "react";
import { Picture } from "@/app/UI/Picture";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";
import { Flex, Typography } from "antd";
import { useAppSelector } from "@/app/lib/store";
import { getAuthUser } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { useRouter } from "next/navigation";
import { ON_PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

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
                    fontWeight: "bold",
                    fontSize: 14,
                    color: ON_PRIMARY_COLOR,
                }}
                type={authUser?.id ? undefined : "danger"}
            >
                {authUser?.name ?? "Ошибка"}
            </Typography.Text>
        </Flex>
    );
});
