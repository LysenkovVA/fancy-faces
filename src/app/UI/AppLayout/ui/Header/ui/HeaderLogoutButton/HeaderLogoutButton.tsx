"use client";

import React, { memo } from "react";
import { Button } from "antd";
import { clearSession } from "@/app/lib/auth/cookies";
import { authActions } from "@/app/(public-routes)/(login)";
import { useAppDispatch, useAppStore } from "@/app/lib/store";
import { useRouter } from "next/navigation";
import { Picture } from "@/app/UI/Picture";
import logoutPng from "../../../../../../lib/assets/png/logout.png";

export interface LogoutButtonProps {
    style?: React.CSSProperties;
}

export const HeaderLogoutButton = memo((props: LogoutButtonProps) => {
    const { style } = props;

    const router = useRouter();
    const dispatch = useAppDispatch();
    const store = useAppStore();

    return (
        <Button
            style={{
                // background: SECONDARY_COLOR,
                // color: ON_SECONDARY_COLOR,
                ...style,
            }}
            type="primary"
            variant={"outlined"}
            // danger
            shape={"default"}
            icon={
                <Picture
                    shape={"picture"}
                    value={logoutPng.src}
                    pictureHeight={20}
                    pictureWidth={20}
                    borderWidth={0}
                />
            }
            onClick={async () => {
                // Удаляем все редюсеры
                // TODO - внести все редюсеры сюда!!!
                store.reducerManager.remove("subjectsListSchema");

                await clearSession();
                dispatch(authActions.logout());
                router.replace("/login");
            }}
        />
    );
});
