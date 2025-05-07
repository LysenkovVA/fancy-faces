"use client";

import React, { memo } from "react";
import { UserEntity } from "../../model/types/UserEntity";
import { App, Card, Flex, Skeleton, Typography } from "antd";
import { useRouter } from "next/navigation";
import { deleteUserByIdThunk } from "../../model/thunks/deleteUserByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { Picture } from "@/app/UI/Picture";
import { useUserFilters } from "@/app/(private-routes)/(users)/ui/UsersFilterPanel/hooks/useUserFilters";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import deletePng from "@/app/lib/assets/png/delete.png";
import { BOX_SHADOW, BOX_SHADOW_WIDTH } from "@/app/lib/themes/primary-theme";

export interface UserCardProps {
    user?: UserEntity;
    isLoading?: boolean;
}

export const UserCard = memo((props: UserCardProps) => {
    const { user, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { confirm } = App.useApp().modal;

    const { highlightedSearch } = useUserFilters();

    return (
        <Card
            style={{
                width: "100%",
                margin: BOX_SHADOW_WIDTH,
                boxShadow: BOX_SHADOW,
            }}
            title={
                !isLoading ? (
                    <HighlightedText
                        style={{ fontSize: 16, fontWeight: "bold" }}
                        text={user?.login ?? ""}
                        search={highlightedSearch}
                    />
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )
            }
            size={"small"}
            actions={[
                <EditCardButton
                    key={"edit"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (user?.id) {
                            router.push(`/users/${user?.id}`);
                        }
                    }}
                />,
                <DeleteCardButton
                    key={"delete"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (user?.id) {
                            confirm({
                                title: (
                                    <Flex
                                        align={"center"}
                                        justify={"start"}
                                        gap={4}
                                    >
                                        <Typography.Text>
                                            {"Удаление"}
                                        </Typography.Text>
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
                                content: `Удалить "${user?.name}"?`,
                                okText: "Да",
                                okType: "danger",
                                cancelText: "Нет",
                                onOk() {
                                    dispatch(
                                        deleteUserByIdThunk({
                                            id: user?.id,
                                        }),
                                    );
                                },
                            });
                        }
                    }}
                />,
            ]}
        >
            <Flex align={"center"} justify={"start"} gap={16}>
                <Picture
                    shape={"avatar"}
                    pictureHeight={100}
                    pictureWidth={100}
                    borderWidth={2}
                    value={user?.avatar}
                />
                <Flex align={"start"} justify={"start"} gap={4} vertical>
                    {!isLoading ? (
                        <HighlightedText
                            style={{ fontSize: 16 }}
                            text={user?.surname ?? ""}
                            search={highlightedSearch}
                        />
                    ) : (
                        <Skeleton.Node
                            style={{ width: 150, height: 20 }}
                            active
                        />
                    )}
                    {!isLoading ? (
                        <HighlightedText
                            style={{ fontSize: 16 }}
                            text={user?.name ?? ""}
                            search={highlightedSearch}
                        />
                    ) : (
                        <Skeleton.Node
                            style={{ width: 150, height: 20 }}
                            active
                        />
                    )}
                    {!isLoading ? (
                        <HighlightedText
                            style={{ fontSize: 16 }}
                            text={user?.patronymic ?? ""}
                            search={highlightedSearch}
                        />
                    ) : (
                        <Skeleton.Node
                            style={{ width: 150, height: 20 }}
                            active
                        />
                    )}
                </Flex>
            </Flex>
        </Card>
    );
});
