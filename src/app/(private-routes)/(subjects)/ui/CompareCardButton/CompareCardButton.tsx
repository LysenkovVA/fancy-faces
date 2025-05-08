"use client";

import React, { memo } from "react";
import { Flex, Skeleton, Typography } from "antd";
import { Picture } from "@/app/UI/Picture";
import comparePng from "../../../../lib/assets/png/compare.png";
import {
    ON_SECONDARY_COLOR,
    WARNING_COLOR,
} from "@/app/lib/themes/primary-theme";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { getIsPresentAtCompareSubjectsList } from "@/app/(private-routes)/(compare-list)/model/selectors/compareSubjectsListSelectors";

export interface CompareCardButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
    entityId?: string;
}

export const CompareCardButton = memo((props: CompareCardButtonProps) => {
    const { onClick, isLoading, entityId } = props;

    const dispatch = useAppDispatch();
    const isPresent = useAppSelector((state) =>
        getIsPresentAtCompareSubjectsList(state, entityId),
    );

    return (
        <Flex
            align={"center"}
            justify={"center"}
            vertical
            gap={4}
            onClick={onClick}
        >
            {!isLoading ? (
                <Picture
                    value={comparePng.src}
                    shape={"picture"}
                    borderWidth={0}
                    borderRadius={0}
                    pictureWidth={16}
                    pictureHeight={16}
                />
            ) : (
                <Skeleton.Node
                    active
                    style={{
                        width: 40,
                        height: 30,
                    }}
                />
            )}
            {!isLoading ? (
                !isPresent ? (
                    <Typography.Text
                        style={{
                            fontSize: 10,
                            color: ON_SECONDARY_COLOR,
                        }}
                    >
                        {`Сравнить`}
                    </Typography.Text>
                ) : (
                    <Typography.Text
                        style={{
                            fontSize: 10,
                            color: WARNING_COLOR,
                        }}
                    >
                        {`Убрать из сравнения`}
                    </Typography.Text>
                )
            ) : null}
        </Flex>
    );
});
