"use client";

import { ReactNode } from "react";
import {
    getAuthUser,
    getUserAuthDataIsInitialized,
} from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { initAuthDataThunk } from "@/app/(public-routes)/(login)/model/services/initAuthDataThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { UserEntity } from "@/app/(private-routes)/(users)";
import { authActions } from "@/app/(public-routes)/(login)";

/**
 * Провайдер, который получает авторизованного пользователя при обновлении страницы
 * и устанавливает AuthSchema в глобальное состояние
 * @param children
 * @constructor
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    console.log("AuthProvider render");
    const dispatch = useAppDispatch();
    const userData = useAppSelector(getAuthUser);
    const isInitialized = useAppSelector(getUserAuthDataIsInitialized);

    useInitialEffect(() => {
        console.log("dispatching initAuthDataThunk");
        dispatch(initAuthDataThunk()).then((resolve) => {
            if (resolve.meta.requestStatus === "fulfilled") {
                const payload = resolve.payload as UserEntity;

                if (payload) {
                    console.log(
                        "initAuthDataThunk dispatch payload",
                        JSON.stringify(payload),
                    );
                    dispatch(authActions.setAuthData(payload));
                }
            }
        });
    });

    return (
        <div>
            {JSON.stringify(userData)}
            {children}
        </div>
    );
}
