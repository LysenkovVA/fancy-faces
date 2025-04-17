"use client";

import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getSubgroupsSimpleList,
    getSubgroupsSimpleListError,
    getSubgroupsSimpleListIsInitialized,
    getSubgroupsSimpleListIsLoading,
} from "../../../model/selectors/subgroupsSimpleListSelectors";
import { memo, useMemo } from "react";
import { getSubgroupsSimpleListThunk } from "../../../model/thunks/getSubgroupsSimpleListThunk";
import { SubgroupEntity } from "../../../model/types/SubgroupEntity";
import { TreeDataNode } from "antd";
import { FilterTree } from "@/app/UI/FilterTree";
import { subgroupsSimpleListReducer } from "../../../model/slices/subgroupsSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface SubgroupFilterProps {
    checkedIds?: string[];
    onChangeChecked?: (checkedIds?: string[]) => void;
}

export const SubgroupFilter = memo((props: SubgroupFilterProps) => {
    const { checkedIds, onChangeChecked } = props;

    const dispatch = useAppDispatch();

    const data = useAppSelector(getSubgroupsSimpleList.selectAll);
    const isLoading = useAppSelector(getSubgroupsSimpleListIsLoading);
    const error = useAppSelector(getSubgroupsSimpleListError);
    const isInitialized = useAppSelector(getSubgroupsSimpleListIsInitialized);

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getSubgroupsSimpleListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    const treeData = useMemo(() => {
        return data.map((value: SubgroupEntity): TreeDataNode => {
            return {
                key: value.id,
                title: value.name,
            };
        });
    }, [data]);

    return (
        <DynamicModuleLoader
            reducers={{
                subgroupsSimpleListSchema: subgroupsSimpleListReducer,
            }}
            removeAfterUnmount={false}
        >
            <FilterTree
                title={"Подгруппа"}
                treeData={treeData}
                value={checkedIds}
                onChangeChecked={onChangeChecked}
                isLoading={isLoading}
                error={error}
            />
        </DynamicModuleLoader>
    );
});
