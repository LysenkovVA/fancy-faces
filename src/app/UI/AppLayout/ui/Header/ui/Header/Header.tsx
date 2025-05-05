"use client";

import React, { memo } from "react";
import { Button, Flex } from "antd";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";
import { HeaderLogo } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogo/HeaderLogo";
import { HeaderLogoutButton } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogoutButton/HeaderLogoutButton";
import { useAppSelector } from "@/app/lib/store";
import {
    getAuthUser,
    getUserAuthDataIsInitialized,
} from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { HeaderAvatar } from "@/app/UI/AppLayout/ui/Header/ui/HeaderAvatar/HeaderAvatar";
import { useRouter } from "next/navigation";
import {
    ON_PRIMARY_COLOR,
    PRIMARY_COLOR,
    PRIMARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";

export interface HeaderProps {}

export const Header = memo((props: HeaderProps) => {
    const initialized = useAppSelector(getUserAuthDataIsInitialized);
    const authUser = useAppSelector(getAuthUser);
    const isAdmin = authUser?.userRole.name === "ADMIN";

    const router = useRouter();

    return (
        <Flex
            style={{
                height: HEADER_HEIGHT,
                width: `100%`,
                border: `1px solid ${PRIMARY_VARIANT_COLOR}`,
                borderRadius: "0 0 16px 16px",
                background: PRIMARY_COLOR,
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
                            style={{ color: ON_PRIMARY_COLOR }}
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
