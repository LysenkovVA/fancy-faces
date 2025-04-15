"use client";

import { Key, memo, useCallback } from "react";
import {
    Badge,
    Collapse,
    CollapseProps,
    Flex,
    Skeleton,
    Tree,
    TreeDataNode,
    Typography,
} from "antd";
import cls from "./FilterTree.module.css";
import { ClearOutlined } from "@ant-design/icons";

export interface FilterTreeProps {
    title?: string;
    treeData: TreeDataNode[];
    isLoading?: boolean;
    error?: string;
    value?: Key[];
    onChangeChecked?: (checkedIds?: string[]) => void;
}

export const FilterTree = memo((props: FilterTreeProps) => {
    const {
        treeData,
        value,
        onChangeChecked,
        isLoading = false,
        error = "",
        title = "Фильтр",
    } = props;

    const onCheckedChanged = useCallback(
        (checked: { checked: Key[]; halfChecked: Key[] } | Key[]) => {
            const keys = checked as Key[];

            if (keys) {
                const checkedKeys = keys.map((key) => key.toString());
                onChangeChecked?.(checkedKeys);
            }
        },
        [onChangeChecked],
    );

    if (isLoading) {
        return (
            <>
                <Skeleton.Input active block />
                <div className={cls.FilterTree} style={{ height: 200 }}>
                    <Skeleton.Input active block />
                    <Skeleton.Input active block />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Typography.Text>{title}</Typography.Text>
                <div className={cls.FilterTree} style={{ height: 200 }}>
                    <Typography.Text type={"danger"}>{error}</Typography.Text>
                </div>
            </>
        );
    }

    const genExtra = () => (
        <ClearOutlined
            onClick={(event) => {
                // Чтобы не триггерить сворачивание/разворачивание панели
                event.stopPropagation();

                if (value?.length && value.length > 0) {
                    onChangeChecked?.([]);
                }
            }}
        />
    );

    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: (
                <Flex align={"center"} justify={"start"} gap={4}>
                    <Typography.Text type={"secondary"}>
                        {title}
                    </Typography.Text>
                    <Badge
                        count={value?.length}
                        color={value?.length ? "orange" : undefined}
                    />
                </Flex>
            ),
            children: (
                <Tree
                    style={{ width: "100%", maxHeight: 100, overflowY: "auto" }}
                    treeData={treeData}
                    checkable
                    selectable={false}
                    defaultExpandAll
                    checkedKeys={value}
                    onCheck={onCheckedChanged}
                />
            ),
            extra: genExtra(),
        },
    ];

    return (
        <Collapse
            defaultActiveKey={"1"}
            style={{ width: "100%" }}
            items={items}
            size={"small"}
        />
    );
});
