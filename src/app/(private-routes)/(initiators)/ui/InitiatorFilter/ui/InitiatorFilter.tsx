"use client";

import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getInitiatorsSimpleList,
    getInitiatorsSimpleListError,
    getInitiatorsSimpleListIsInitialized,
    getInitiatorsSimpleListIsLoading,
} from "../../../model/selectors/initiatorsSimpleListSelectors";
import { memo, useMemo } from "react";
import { getInitiatorsSimpleListThunk } from "../../../model/thunks/getInitiatorsSimpleListThunk";
import { InitiatorEntity } from "../../../model/types/InitiatorEntity";
import { TreeDataNode } from "antd";
import { FilterTree } from "@/app/UI/FilterTree";
import { initiatorsSimpleListReducer } from "../../../model/slices/initiatorsSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface InitiatorFilterProps {
    checkedIds?: string[];
    onChangeChecked?: (checkedIds?: string[]) => void;
}

export const InitiatorFilter = memo((props: InitiatorFilterProps) => {
    const { checkedIds, onChangeChecked } = props;

    const dispatch = useAppDispatch();

    const data = useAppSelector(getInitiatorsSimpleList.selectAll);
    const isLoading = useAppSelector(getInitiatorsSimpleListIsLoading);
    const error = useAppSelector(getInitiatorsSimpleListError);
    const isInitialized = useAppSelector(getInitiatorsSimpleListIsInitialized);

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getInitiatorsSimpleListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    const treeData = useMemo(() => {
        return data.map((value: InitiatorEntity): TreeDataNode => {
            return {
                key: value.id,
                title: value.name,
            };
        });
    }, [data]);

    return (
        <DynamicModuleLoader
            reducers={{
                initiatorsSimpleListSchema: initiatorsSimpleListReducer,
            }}
            removeAfterUnmount={false}
        >
            <FilterTree
                title={"Инициатор"}
                treeData={treeData}
                value={checkedIds}
                onChangeChecked={onChangeChecked}
                isLoading={isLoading}
                error={error}
            />
        </DynamicModuleLoader>
    );
});
