"use client";

import { CSSProperties, memo } from "react";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import { Card, Flex, Skeleton, Typography } from "antd";
import { useRouter } from "next/navigation";
import { showDeleteConfirm } from "@/app/UI/showDeleteConfirm";
import { deleteSubjectByIdThunk } from "../../model/thunks/deleteSubjectByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";

export interface SubjectCardProps {
    style?: CSSProperties;
    subject?: SubjectEntity;
    isLoading?: boolean;
}

export const SubjectCard = memo((props: SubjectCardProps) => {
    const { style, subject, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <Card
            style={{ borderWidth: 2, width: "100%", ...style }}
            title={
                !isLoading ? (
                    <Flex align={"center"} justify={"center"}>
                        {"Субъект"}
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
                        if (subject?.id) {
                            router.push(`/subjects/${subject?.id}`);
                        }
                    }}
                />,
                <DeleteCardButton
                    key={"delete"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (subject?.id) {
                            showDeleteConfirm(
                                "Удаление",
                                `Удалить "${subject?.name}"?`,
                                () =>
                                    dispatch(
                                        deleteSubjectByIdThunk({
                                            id: subject?.id,
                                        }),
                                    ),
                            );
                        }
                    }}
                />,
            ]}
        >
            <Flex align={"center"} justify={"start"} gap={16}>
                {!isLoading ? (
                    <Flex align={"center"} justify={"start"} gap={4}>
                        <Typography.Text style={{ fontSize: 14 }}>
                            {subject?.name ?? " "}
                        </Typography.Text>
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
            </Flex>
        </Card>
    );
});
