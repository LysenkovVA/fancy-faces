"use client";

import { memo } from "react";
import { Divider, Flex, Typography } from "antd";
import { SECONDARY_VARIANT_COLOR } from "@/app/lib/themes/primary-theme";

export interface CompareListItemProps {
    itemName: string;
    children?: React.ReactNode;
}

export const CompareListItem = memo((props: CompareListItemProps) => {
    const { itemName, children } = props;
    return (
        <Flex
            style={{ paddingBottom: 16 }}
            align={"start"}
            justify={"center"}
            gap={4}
            vertical
        >
            {itemName !== undefined && itemName !== "" && (
                <Typography.Text style={{ color: SECONDARY_VARIANT_COLOR }}>
                    {itemName}
                </Typography.Text>
            )}
            {children}
            <Divider style={{ marginTop: 16, marginBottom: 0 }} />
        </Flex>
    );
});
