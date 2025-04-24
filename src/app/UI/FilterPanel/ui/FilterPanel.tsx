"use client";

import React, {
    CSSProperties,
    memo,
    ReactNode,
    useEffect,
    useState,
} from "react";
import { Badge, Button, Divider, Flex, Input, Typography } from "antd";
import {
    ClearOutlined,
    DoubleLeftOutlined,
    FilterOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { usePathname } from "next/navigation";
import { getFilterPanelCollapsedByPath } from "../model/selectors/filterPanelSelectors";
import { FilterPanelActions } from "../model/slices/FilterPanelSlice";
import { PRIMARY_COLOR, SURFACE_COLOR } from "@/app/lib/themes/primary-theme";

const PANEL_WIDTH = 300;
const PANEL_WIDTH_COLLAPSED = 50;

export interface FilterPanelProps {
    children?: ReactNode;
    title?: string;
    height: number | string;
    searchValue?: string;
    onSearchValueChanged?: (value: string) => void;
    totalCount?: number;
    activeFiltersCount?: number;
    clearEnabled?: boolean;
    onClearFilters?: () => void;
    isFiltering?: boolean;
}

/**
 * Базовая панель фильтров с поиском
 */
export const FilterPanel = memo((props: FilterPanelProps) => {
    const {
        children,
        title,
        height,
        searchValue,
        onSearchValueChanged,
        totalCount,
        clearEnabled,
        onClearFilters,
        activeFiltersCount,
        isFiltering,
    } = props;

    const baseStyle: CSSProperties = {
        height: height,
        borderRadius: 8,
        border: `1px solid ${PRIMARY_COLOR}`,
        background: SURFACE_COLOR,
        padding: 8,
        transition: "0.0s",
    };

    const path = usePathname();
    const dispatch = useAppDispatch();

    const collapsed = useAppSelector((state) =>
        getFilterPanelCollapsedByPath(state, path),
    );

    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setIsCollapsed(collapsed);
    }, [collapsed]);

    if (isCollapsed) {
        let PRIMARY_COLOR;
        return (
            <Flex
                vertical
                align={"center"}
                justify={"space-between"}
                style={{
                    ...baseStyle,
                    width: isCollapsed ? PANEL_WIDTH_COLLAPSED : PANEL_WIDTH,
                }}
            >
                <Flex align={"center"} justify={"start"} vertical gap={16}>
                    <Button
                        icon={<SearchOutlined />}
                        onClick={() =>
                            dispatch(
                                FilterPanelActions.setCollapsed({
                                    path,
                                    collapsed: false,
                                }),
                            )
                        }
                    />
                    {activeFiltersCount !== undefined &&
                        activeFiltersCount > 0 && (
                            <Flex
                                align={"center"}
                                justify={"center"}
                                gap={4}
                                vertical
                            >
                                <FilterOutlined />
                                <Badge
                                    count={activeFiltersCount}
                                    color={
                                        activeFiltersCount > 0
                                            ? `${PRIMARY_COLOR}`
                                            : undefined
                                    }
                                />
                            </Flex>
                        )}
                </Flex>
                <Typography.Text type={"secondary"}>
                    {totalCount}
                </Typography.Text>
            </Flex>
        );
    }

    return (
        <Flex
            vertical
            align={"center"}
            justify={"space-between"}
            style={{
                ...baseStyle,
                width: isCollapsed ? PANEL_WIDTH_COLLAPSED : PANEL_WIDTH,
            }}
        >
            <Flex
                vertical
                align={"center"}
                justify={"center"}
                gap={8}
                style={{ width: "100%" }}
            >
                <Flex
                    align={"center"}
                    justify={"space-between"}
                    gap={4}
                    style={{ width: "100%", marginBottom: 8 }}
                >
                    <Typography.Text
                        style={{
                            color: PRIMARY_COLOR,
                            fontSize: 16,
                        }}
                    >
                        {title}
                    </Typography.Text>
                    <Button
                        type={"link"}
                        icon={<DoubleLeftOutlined />}
                        onClick={() =>
                            dispatch(
                                FilterPanelActions.setCollapsed({
                                    path,
                                    collapsed: true,
                                }),
                            )
                        }
                    />
                </Flex>
                {onSearchValueChanged && (
                    <Input
                        style={{ marginBottom: 8 }}
                        placeholder={"Найти..."}
                        value={searchValue}
                        allowClear
                        onChange={(e) => {
                            onSearchValueChanged?.(e.target.value);
                        }}
                    />
                )}
                {onClearFilters && (
                    <Flex
                        align={"center"}
                        justify={"space-between"}
                        style={{ width: "100%" }}
                    >
                        <Flex align={"center"} justify={"center"} gap={4}>
                            <FilterOutlined />
                            <Typography.Text
                                style={{ color: PRIMARY_COLOR, fontSize: 14 }}
                            >
                                {"Фильтры"}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                )}
                <Flex
                    style={{
                        width: "100%",
                        height: "100%",
                        overflowY: "auto",
                    }}
                    vertical
                    gap={8}
                >
                    {children}
                </Flex>
                <Flex
                    align={"center"}
                    justify={"center"}
                    gap={4}
                    style={{ width: "100%" }}
                >
                    {onClearFilters && (
                        <Button
                            disabled={isFiltering}
                            icon={<ClearOutlined />}
                            style={{
                                width: "100%",
                            }}
                            onClick={onClearFilters}
                        />
                    )}
                </Flex>
            </Flex>
            <Divider orientation={"center"}>
                {isFiltering ? (
                    <div>{"loading..."}</div>
                ) : (
                    <Typography.Text>{`Записей: ${totalCount}`}</Typography.Text>
                )}
            </Divider>
        </Flex>
    );
});
