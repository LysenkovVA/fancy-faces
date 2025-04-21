"use client";

import { CSSProperties, memo } from "react";
import { UserEntity } from "../../model/types/UserEntity";
import { Card, Flex, Skeleton, Typography } from "antd";
import { useRouter } from "next/navigation";
import { showDeleteConfirm } from "@/app/UI/showDeleteConfirm";
import { deleteUserByIdThunk } from "../../model/thunks/deleteUserByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { Picture } from "@/app/UI/Picture";

export interface UserCardProps {
    style?: CSSProperties;
    user?: UserEntity;
    isLoading?: boolean;
}

export const UserCard = memo((props: UserCardProps) => {
    const { style, user, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <Card
            style={{
                borderWidth: 2,
                width: "100%",
                ...style,
            }}
            title={
                !isLoading ? (
                    <Flex align={"center"} justify={"center"}>
                        {"Пользователь"}
                    </Flex>
                ) : (
                    <Flex align={"center"} justify={"center"}>
                        <Skeleton.Node
                            style={{ width: 50, height: 15 }}
                            active
                        />
                    </Flex>
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
                    pictureHeight={50}
                    pictureWidth={50}
                    borderWidth={2}
                    value={user?.avatar}
                />
                {!isLoading ? (
                    <Flex align={"center"} justify={"start"} gap={4}>
                        <Typography.Text style={{ fontSize: 14 }}>
                            {user?.name ?? " "}
                        </Typography.Text>
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
            </Flex>
        </Card>
    );
});
