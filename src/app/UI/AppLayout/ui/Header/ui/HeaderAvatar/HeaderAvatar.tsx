"use client";

import React, { memo } from "react";
import { Picture } from "@/app/UI/Picture";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";
import { Flex, Typography } from "antd";
import { useAppSelector } from "@/app/lib/store";
import { getAuthUser } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { useRouter } from "next/navigation";
import { ON_PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";
import { UserHelper } from "@/app/(private-routes)/(users)/model/helpers/UserHelper";

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
                    fontWeight: "normal",
                    fontSize: 16,
                    color: ON_PRIMARY_COLOR,
                }}
                type={authUser?.id ? undefined : "danger"}
            >
                {UserHelper.getSurnameWithInitials(authUser) ?? "Ошибка"}
            </Typography.Text>
        </Flex>
    );
});
