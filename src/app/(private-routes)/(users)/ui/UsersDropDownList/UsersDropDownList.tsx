"use client";

import { memo, useCallback, useMemo } from "react";
import { UserEntity } from "../../model/types/UserEntity";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getUsersSimpleList,
    getUsersSimpleListError,
    getUsersSimpleListIsInitialized,
    getUsersSimpleListIsLoading,
} from "../../model/selectors/usersSimpleListSelectors";
import { Typography } from "antd";
import { getUsersSimpleListThunk } from "../../model/thunks/getUsersSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { usersSimpleListReducer } from "@/app/(private-routes)/(users)/model/slices/usersSimpleListSlice";
import { UserHelper } from "@/app/(private-routes)/(users)/model/helpers/UserHelper";

export interface UsersDropDownListProps {
    placeholder?: string;
    value?: UserEntity | UserEntity[];
    onChange?: (value?: UserEntity | UserEntity[]) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: UserEntity;
}

export const UsersDropDownList = memo((props: UsersDropDownListProps) => {
    const { placeholder, value, onChange, mode, initialNewEntityData } = props;

    const dispatch = useAppDispatch();
    const data = useAppSelector(getUsersSimpleList.selectAll);
    const isLoading = useAppSelector(getUsersSimpleListIsLoading);
    const error = useAppSelector(getUsersSimpleListError);
    const isInitialized = useAppSelector(getUsersSimpleListIsInitialized);

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getUsersSimpleListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    // Список значений
    const options = useMemo(() => {
        return data.map((value: UserEntity): DropDownOption => {
            return {
                value: value.id,
                label: UserHelper.getSurnameWithInitials(value),
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
                const changedValues: Array<UserEntity> = [];

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
                usersSimpleListSchema: usersSimpleListReducer,
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
