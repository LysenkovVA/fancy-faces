"use client";

import { CSSProperties, memo } from "react";
import { UserEntity } from "../../model/types/UserEntity";
import { Card, Flex, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { showDeleteConfirm } from "@/app/UI/showDeleteConfirm";
import { deleteUserByIdThunk } from "../../model/thunks/deleteUserByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { Picture } from "@/app/UI/Picture";
import { useUserFilters } from "@/app/(private-routes)/(users)/ui/UsersFilterPanel/hooks/useUserFilters";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";

export interface UserCardProps {
    style?: CSSProperties;
    user?: UserEntity;
    isLoading?: boolean;
}

export const UserCard = memo((props: UserCardProps) => {
    const { style, user, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { search } = useUserFilters();

    return (
        <Card
            style={{
                borderWidth: 2,
                width: "100%",
                ...style,
            }}
            title={
                !isLoading ? (
                    <HighlightedText
                        style={{ fontSize: 16, fontWeight: "bold" }}
                        text={user?.login ?? ""}
                        search={search}
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
                            showDeleteConfirm(
                                "Удаление",
                                `Удалить "${user?.name}"?`,
                                () =>
                                    dispatch(
                                        deleteUserByIdThunk({
                                            id: user?.id,
                                        }),
                                    ),
                            );
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
                            search={search}
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
                            search={search}
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
                            search={search}
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
