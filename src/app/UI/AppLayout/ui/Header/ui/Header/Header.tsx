"use client";

import React, { memo } from "react";
import { Button, Flex } from "antd";
import {
    BACKGROUND_PRIMARY_COLOR,
    HEADER_HEIGHT,
} from "@/app/UI/AppLayout/config/consts";
import { HeaderLogo } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogo/HeaderLogo";
import { HeaderLogoutButton } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogoutButton/HeaderLogoutButton";
import { useAppSelector } from "@/app/lib/store";
import {
    getAuthUser,
    getUserAuthDataIsInitialized,
} from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { HeaderAvatar } from "@/app/UI/AppLayout/ui/Header/ui/HeaderAvatar/HeaderAvatar";
import { useRouter } from "next/navigation";

export interface HeaderProps {}

export const Header = memo((props: HeaderProps) => {
    const initialized = useAppSelector(getUserAuthDataIsInitialized);
    const authUser = useAppSelector(getAuthUser);
    const isAdmin = authUser?.userRole.name === "ADMIN";

    const router = useRouter();

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
                    {isAdmin && (
                        <Button
                            type={"link"}
                            onClick={() => router.push("/users")}
                        >
                            {"Управление пользователями"}
                        </Button>
                    )}
                    {initialized && <HeaderAvatar />}
                    <HeaderLogoutButton />
                </Flex>
            </Flex>
        </Flex>
    );
});
