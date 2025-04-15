"use client";

import { memo, useCallback, useMemo } from "react";
import { ViewTypeEntity } from "../../model/types/ViewTypeEntity";
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
} from "../../model/selectors/viewTypeSimpleListSelectors";
import { Typography } from "antd";
import { getViewTypesSimpleListThunk } from "../../model/thunks/getViewTypesSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";
import { viewTypesSimpleListReducer } from "../../model/slices/viewTypesSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface ViewTypesDropDownListProps {
    placeholder?: string;
    value?: ViewTypeEntity | ViewTypeEntity[];
    onChange?: (value?: ViewTypeEntity | ViewTypeEntity[]) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: ViewTypeEntity;
}

export const ViewTypesDropDownList = memo(
    (props: ViewTypesDropDownListProps) => {
        const { placeholder, value, onChange, mode, initialNewEntityData } =
            props;

        const dispatch = useAppDispatch();
        const data = useAppSelector(getViewTypesSimpleList.selectAll);
        const isLoading = useAppSelector(getViewTypesSimpleListIsLoading);
        const error = useAppSelector(getViewTypesSimpleListError);

        const isInitialized = useAppSelector(
            getViewTypesSimpleListIsInitialized,
        );

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getViewTypesSimpleListThunk({
                        replaceData: true,
                    }),
                );
            }
        });

        // Список значений
        const options = useMemo(() => {
            return data.map((value: ViewTypeEntity): DropDownOption => {
                return {
                    value: value.id,
                    label: value.name,
                };
            });
        }, [data]);

        // Выбранное значение
        const selectedValue = useMemo(() => {
            if (!value) return undefined;

            if (value instanceof Array) {
                return value?.map((val) => val?.id);
            } else {
                return value?.id;
            }
        }, [value]);

        const onChangeCallback = useCallback(
            (value?: string | string[]) => {
                if (!value) {
                    onChange?.(undefined);
                }

                if (value instanceof Array) {
                    const changedValues: Array<ViewTypeEntity> = [];

                    value?.map((val) => {
                        changedValues.push(
                            data?.filter((entity) => entity.id === val)?.[0],
                        );
                    });

                    if (mode === "single") {
                        onChange?.(changedValues?.[0]);
                    } else {
                        onChange?.(changedValues);
                    }
                } else {
                    const val = data.filter(
                        (entity) => entity.id === value,
                    )?.[0];

                    if (mode === "single") {
                        onChange?.(val);
                    } else {
                        onChange?.([val]);
                    }
                }
            },
            [data, mode, onChange],
        );

        return (
            <DynamicModuleLoader
                reducers={{
                    viewTypesSimpleListSchema: viewTypesSimpleListReducer,
                }}
                removeAfterUnmount={false}
            >
                <DropDownList
                    placeholder={placeholder}
                    isLoading={isLoading}
                    mode={mode}
                    options={options}
                    value={selectedValue}
                    onChange={onChangeCallback}
                />
                {error && (
                    <Typography.Text type={"danger"}>{error}</Typography.Text>
                )}
            </DynamicModuleLoader>
        );
    },
);
