import React, { memo } from "react";
import { Button, Card, Flex, Typography } from "antd";
import {
    ON_SECONDARY_COLOR,
    PRIMARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";
import backArrow from "../../../lib/assets/png/left.png";
import savePng from "../../../lib/assets/png/save.png";
import { Picture } from "@/app/UI/Picture";

export interface EditableCardWrapperProps {
    children?: React.ReactNode;
    title?: string;
    additionalTitle?: string;
    onSave?: () => void;
    onCancel?: () => void;
    height: number | string;
}

export const EditablePageWrapper = memo((props: EditableCardWrapperProps) => {
    const { children, title, additionalTitle, onSave, onCancel, height } =
        props;

    const extraContent = (
        <Flex gap={8}>
            <Button
                icon={
                    <Picture
                        value={savePng.src}
                        shape={"picture"}
                        borderWidth={0}
                        pictureWidth={24}
                        pictureHeight={24}
                    />
                }
                type={"primary"}
                onClick={onSave}
            >
                {"Сохранить"}
            </Button>
        </Flex>
    );

    const titleContent = (
        <Flex
            style={{ cursor: "pointer" }}
            align={"center"}
            justify={"start"}
            gap={4}
            onClick={onCancel}
        >
            <Button
                type={"text"}
                icon={
                    <Picture
                        value={backArrow.src}
                        shape={"picture"}
                        borderWidth={0}
                        pictureWidth={24}
                        pictureHeight={24}
                    />
                }
            />
            <Typography.Text
                style={{ fontSize: 16, color: ON_SECONDARY_COLOR }}
            >
                {"Назад"}
            </Typography.Text>
            {/*<Flex align={"center"} gap={8}>*/}
            {/*    <Typography.Text style={{ fontSize: 16 }} type={"danger"}>*/}
            {/*        {title}*/}
            {/*    </Typography.Text>*/}
            {/*    {additionalTitle && (*/}
            {/*        <Typography.Text*/}
            {/*            style={{ fontSize: 16 }}*/}
            {/*            type={"secondary"}*/}
            {/*        >*/}
            {/*            {`"${additionalTitle}"`}*/}
            {/*        </Typography.Text>*/}
            {/*    )}*/}
            {/*</Flex>*/}
        </Flex>
    );

    return (
        <Card
            styles={{
                body: {
                    width: "100%",
                    height: `calc(${height} - 54px)`,
                    overflowY: "auto",
                },
            }}
            style={{ boxShadow: `0px 0px 5px ${PRIMARY_VARIANT_COLOR}` }}
            title={titleContent}
            extra={extraContent}
        >
            {children}
        </Card>
    );
});
