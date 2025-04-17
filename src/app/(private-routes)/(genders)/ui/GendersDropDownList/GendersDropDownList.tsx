"use client";

import { memo, useCallback, useMemo } from "react";
import { GenderEntity } from "../../model/types/GenderEntity";
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
} from "../../model/selectors/genderSimpleListSelectors";
import { Typography } from "antd";
import { getGendersSimpleListThunk } from "../../model/thunks/getGendersSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";
import { gendersSimpleListReducer } from "../../model/slices/gendersSimpleListSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

export interface GendersDropDownListProps {
    placeholder?: string;
    value?: GenderEntity | GenderEntity[];
    onChange?: (value?: GenderEntity | GenderEntity[]) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: GenderEntity;
}

export const GendersDropDownList = memo((props: GendersDropDownListProps) => {
    const { placeholder, value, onChange, mode, initialNewEntityData } = props;

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

    // Список значений
    const options = useMemo(() => {
        return data.map((value: GenderEntity): DropDownOption => {
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
                const changedValues: Array<GenderEntity> = [];

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
                const val = data.filter((entity) => entity.id === value)?.[0];

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
                gendersSimpleListSchema: gendersSimpleListReducer,
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
});
