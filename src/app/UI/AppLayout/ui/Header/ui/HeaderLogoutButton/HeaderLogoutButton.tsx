"use client";

import React, { memo } from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { clearSession } from "@/app/lib/auth/cookies";
import { authActions } from "@/app/(public-routes)/(login)";
import { useAppDispatch } from "@/app/lib/store";
import { useRouter } from "next/navigation";

export interface LogoutButtonProps {
    style?: React.CSSProperties;
}

export const HeaderLogoutButton = memo((props: LogoutButtonProps) => {
    const { style } = props;

    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <Button
            style={{ ...style }}
            type="primary"
            variant={"outlined"}
            danger
            shape={"round"}
            icon={<LogoutOutlined />}
            onClick={async () => {
                await clearSession();
                dispatch(authActions.logout());
                router.push("/login");
            }}
        >
            {"Выйти"}
        </Button>
    );
});
