"use client";

import React, { memo } from "react";
import { Flex, Typography } from "antd";
import {
    BACKGROUND_PRIMARY_COLOR,
    FOREGROUND_PRIMARY_COLOR,
    HEADER_HEIGHT,
} from "@/app/UI/AppLayout/config/consts";
import { HeaderLogo } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogo/HeaderLogo";
import { HeaderLogoutButton } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogoutButton/HeaderLogoutButton";
import { useAppSelector } from "@/app/lib/store";
import {
    getAuthUser,
    getUserAuthDataIsInitialized,
} from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { Picture } from "@/app/UI/Picture";

export interface HeaderProps {}

export const Header = memo((props: HeaderProps) => {
    const initialized = useAppSelector(getUserAuthDataIsInitialized);
    const authUser = useAppSelector(getAuthUser);

    return (
        <Flex
            style={{
                backgroundColor: BACKGROUND_PRIMARY_COLOR,
                height: HEADER_HEIGHT,
                width: `100%`,
            }}
            align={"center"}
            justify={"start"}
        >
            <Flex
                style={{ width: "100%", paddingRight: 16 }}
                align={"center"}
                justify={"space-between"}
            >
                <HeaderLogo />
                <Flex align={"center"} justify={"center"} gap={16}>
                    {initialized && (
                        <Flex align={"center"} justify={"center"} gap={8}>
                            <Picture
                                shape={"avatar"}
                                pictureWidth={"auto"}
                                pictureHeight={HEADER_HEIGHT - 20}
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
                    )}
                    <HeaderLogoutButton />
                </Flex>
            </Flex>
        </Flex>
    );
});
