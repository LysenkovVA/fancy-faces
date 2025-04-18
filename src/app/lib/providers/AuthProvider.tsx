"use client";

import { ReactNode } from "react";
import { initAuthDataThunk } from "@/app/(public-routes)/(login)/model/services/initAuthDataThunk";
import { useAppDispatch } from "@/app/lib/store";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

/**
 * Провайдер, который получает авторизованного пользователя при обновлении страницы
 * и устанавливает AuthSchema в глобальное состояние
 * @param children
 * @constructor
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    // console.log("AuthProvider render");
    const dispatch = useAppDispatch();
    // const userData = useAppSelector(getAuthUser);
    // const isInitialized = useAppSelector(getUserAuthDataIsInitialized);

    useInitialEffect(() => {
        dispatch(initAuthDataThunk());
        // console.log("dispatching initAuthDataThunk");
        // dispatch(initAuthDataThunk()).then((resolve) => {
        //     if (resolve.meta.requestStatus === "fulfilled") {
        //         const payload = resolve.payload as UserEntity;
        //
        //         if (payload) {
        //             console.log(
        //                 "initAuthDataThunk dispatch payload",
        //                 JSON.stringify(payload),
        //             );
        //             dispatch(authActions.setAuthData(payload));
        //         }
        //     }
        // });
    });

    return <>{children}</>;
}
