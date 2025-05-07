"use client";

import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getAntropologicalTypesSimpleList,
    getAntropologicalTypesSimpleListError,
    getAntropologicalTypesSimpleListIsInitialized,
    getAntropologicalTypesSimpleListIsLoading,
} from "../../../model/selectors/antropologicalTypesSimpleListSelectors";
import { memo, useMemo } from "react";
import { getAntropologicalTypesSimpleListThunk } from "../../../model/thunks/getAntropologicalTypesSimpleListThunk";
import { AntropologicalTypeEntity } from "../../../model/types/AntropologicalTypeEntity";
import { TreeDataNode } from "antd";
import { FilterTree } from "@/app/UI/FilterTree";
import { antropologicalTypesSimpleListReducer } from "../../../model/slices/antropologicalTypesSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface AntropologicalTypeFilterProps {
    checkedIds?: string[];
    onChangeChecked?: (checkedIds?: string[]) => void;
}

export const AntropologicalTypeFilter = memo(
    (props: AntropologicalTypeFilterProps) => {
        const { checkedIds, onChangeChecked } = props;

        const dispatch = useAppDispatch();

        const data = useAppSelector(getAntropologicalTypesSimpleList.selectAll);
        const isLoading = useAppSelector(
            getAntropologicalTypesSimpleListIsLoading,
        );
        const error = useAppSelector(getAntropologicalTypesSimpleListError);
        const isInitialized = useAppSelector(
            getAntropologicalTypesSimpleListIsInitialized,
        );

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getAntropologicalTypesSimpleListThunk({
                        replaceData: true,
                    }),
                );
            }
        });

        const treeData = useMemo(() => {
            return data.map((value: AntropologicalTypeEntity): TreeDataNode => {
                return {
                    key: value.id,
                    title: value.name,
                };
            });
        }, [data]);

        return (
            <DynamicModuleLoader
                reducers={{
                    antropologicalTypesSimpleListSchema:
                        antropologicalTypesSimpleListReducer,
                }}
                removeAfterUnmount={false}
            >
                <FilterTree
                    title={"Антропологический тип"}
                    treeData={treeData}
                    value={checkedIds}
                    onChangeChecked={onChangeChecked}
                    isLoading={isLoading}
                    error={error}
                />
            </DynamicModuleLoader>
        );
    },
);
