"use client";

import { ReactNode, useEffect } from "react";
import { initAuthDataThunk } from "@/app/(public-routes)/(login)/model/services/initAuthDataThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { getAuthUser } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { initCompareListThunk } from "@/app/(private-routes)/(compare-list)/model/thunks/initCompareListThunk";
import { getCompareSubjectsListIsInitialized } from "@/app/(private-routes)/(compare-list)/model/selectors/compareSubjectsListSelectors";

/**
 * Провайдер, который получает авторизованного пользователя при обновлении страницы
 * и устанавливает AuthSchema в глобальное состояние
 * @param children
 * @constructor
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    const authUser = useAppSelector(getAuthUser);
    const isCompareListInitialized = useAppSelector(
        getCompareSubjectsListIsInitialized,
    );

    useInitialEffect(() => {
        dispatch(initAuthDataThunk());
    });

    useEffect(() => {
        if (!isCompareListInitialized) {
            if (authUser?.id) {
                console.log("user authenticated... getting compare list");
                dispatch(initCompareListThunk({}));
            }
        }
    }, [authUser?.id, dispatch, isCompareListInitialized]);

    return <>{children}</>;
}
