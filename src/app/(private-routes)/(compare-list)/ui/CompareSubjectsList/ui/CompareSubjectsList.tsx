"use client";

import React, { memo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { getCompareSubjectsListCount } from "@/app/(private-routes)/(compare-list)/model/selectors/compareSubjectsListSelectors";
import { App, Badge, Flex, Tag, Typography } from "antd";
import {
    ON_PRIMARY_COLOR,
    PRIMARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";
import { useRouter } from "next/navigation";
import { Picture } from "@/app/UI/Picture";
import deletePng from "@/assets/delete.png";
import { compareSubjectsListActions } from "@/app/(private-routes)/(compare-list)/model/slices/compareSubjectsListSlice";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";

export const CompareSubjectsList = memo(() => {
    const itemsCount = useAppSelector(getCompareSubjectsListCount);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { confirm } = App.useApp().modal;

    const onClear = useCallback(() => {
        confirm({
            title: (
                <Flex align={"center"} justify={"start"} gap={4}>
                    <Typography.Text>{"Очистить"}</Typography.Text>
                </Flex>
            ),
            icon: (
                <Picture
                    shape={"picture"}
                    pictureWidth={FORM_ICON_SIZE}
                    pictureHeight={FORM_ICON_SIZE}
                    borderWidth={0}
                    borderRadius={0}
                    value={deletePng.src}
                />
            ),
            content: `Очистить список?`,
            okText: "Да",
            okType: "danger",
            cancelText: "Нет",
            onOk() {
                dispatch(compareSubjectsListActions.clearAll());
            },
        });
    }, [confirm, dispatch]);

    if (itemsCount === 0) {
        return null;
    }

    return (
        <Flex align={"center"} justify={"center"} gap={4}>
            <div style={{ cursor: "pointer" }} onClick={onClear}>
                <Picture
                    shape={"picture"}
                    pictureHeight={24}
                    pictureWidth={24}
                    borderRadius={0}
                    value={deletePng.src}
                />
            </div>
            <Tag
                color={PRIMARY_VARIANT_COLOR}
                style={{ padding: 8, cursor: "pointer" }}
                onClick={() => router.push("/compare-list")}
            >
                <Flex align={"center"} justify={"center"} gap={8}>
                    <Typography.Text style={{ color: ON_PRIMARY_COLOR }}>
                        {"Список сравнения"}
                    </Typography.Text>
                    <Badge count={itemsCount} />
                </Flex>
            </Tag>
        </Flex>
    );
});
