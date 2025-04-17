"use client";

import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getGendersSimpleList,
    getGendersSimpleListError,
    getGendersSimpleListIsInitialized,
    getGendersSimpleListIsLoading,
} from "../../../model/selectors/genderSimpleListSelectors";
import { memo, useMemo } from "react";
import { getGendersSimpleListThunk } from "../../../model/thunks/getGendersSimpleListThunk";
import { GenderEntity } from "../../../model/types/GenderEntity";
import { TreeDataNode } from "antd";
import { FilterTree } from "@/app/UI/FilterTree";
import { gendersSimpleListReducer } from "../../../model/slices/gendersSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface GenderFilterProps {
    checkedIds?: string[];
    onChangeChecked?: (checkedIds?: string[]) => void;
}

export const GenderFilter = memo((props: GenderFilterProps) => {
    const { checkedIds, onChangeChecked } = props;

    const dispatch = useAppDispatch();

    const data = useAppSelector(getGendersSimpleList.selectAll);
    const isLoading = useAppSelector(getGendersSimpleListIsLoading);
    const error = useAppSelector(getGendersSimpleListError);
    const isInitialized = useAppSelector(getGendersSimpleListIsInitialized);

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getGendersSimpleListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    const treeData = useMemo(() => {
        return data.map((value: GenderEntity): TreeDataNode => {
            return {
                key: value.id,
                title: value.name,
            };
        });
    }, [data]);

    return (
        <DynamicModuleLoader
            reducers={{
                gendersSimpleListSchema: gendersSimpleListReducer,
            }}
            removeAfterUnmount={false}
        >
            <FilterTree
                title={"Пол"}
                treeData={treeData}
                value={checkedIds}
                onChangeChecked={onChangeChecked}
                isLoading={isLoading}
                error={error}
            />
        </DynamicModuleLoader>
    );
});
