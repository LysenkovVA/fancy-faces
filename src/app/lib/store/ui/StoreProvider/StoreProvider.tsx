"use client";

import { ReactNode, useRef } from "react";
import { AppStore, createReduxStore } from "@/app/lib/store/model/store";
import { Provider } from "react-redux";

export interface StoreProviderProps {
    children?: ReactNode;
}

export const StoreProvider = (props: StoreProviderProps) => {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = createReduxStore();
    }

    return <Provider store={storeRef.current}>{props.children}</Provider>;
};

export default StoreProvider;
