"use client";

import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getViewTypesSimpleList,
    getViewTypesSimpleListError,
    getViewTypesSimpleListIsInitialized,
    getViewTypesSimpleListIsLoading,
} from "../../../model/selectors/viewTypeSimpleListSelectors";
import { memo, useMemo } from "react";
import { getViewTypesSimpleListThunk } from "../../../model/thunks/getViewTypesSimpleListThunk";
import { ViewTypeEntity } from "../../../model/types/ViewTypeEntity";
import { TreeDataNode } from "antd";
import { FilterTree } from "@/app/UI/FilterTree";
import { viewTypesSimpleListReducer } from "../../../model/slices/viewTypesSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface ViewTypeFilterProps {
    checkedIds?: string[];
    onChangeChecked?: (checkedIds?: string[]) => void;
}

export const ViewTypeFilter = memo((props: ViewTypeFilterProps) => {
    const { checkedIds, onChangeChecked } = props;

    const dispatch = useAppDispatch();

    const data = useAppSelector(getViewTypesSimpleList.selectAll);
    const isLoading = useAppSelector(getViewTypesSimpleListIsLoading);
    const error = useAppSelector(getViewTypesSimpleListError);
    const isInitialized = useAppSelector(getViewTypesSimpleListIsInitialized);

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getViewTypesSimpleListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    const treeData = useMemo(() => {
        return data.map((value: ViewTypeEntity): TreeDataNode => {
            return {
                key: value.id,
                title: value.name,
            };
        });
    }, [data]);

    return (
        <DynamicModuleLoader
            reducers={{
                viewTypesSimpleListSchema: viewTypesSimpleListReducer,
            }}
            removeAfterUnmount={false}
        >
            <FilterTree
                title={"Вид"}
                treeData={treeData}
                value={checkedIds}
                onChangeChecked={onChangeChecked}
                isLoading={isLoading}
                error={error}
            />
        </DynamicModuleLoader>
    );
});
