"use client";

import React, { memo } from "react";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import { App, Card, Flex, Skeleton, Typography } from "antd";
import { useRouter } from "next/navigation";
import { deleteSubjectByIdThunk } from "../../model/thunks/deleteSubjectByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { useSubjectFilters } from "@/app/(private-routes)/(subjects)/ui/SubjectsFilterPanel/hooks/useSubjectFilters";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";
import { Picture } from "@/app/UI/Picture";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import {
    CARD_ICON_SIZE,
    FORM_ICON_SIZE,
} from "@/app/UI/AppLayout/config/consts";
import percentPng from "../../../../lib/assets/png/percent.png";
import agePng from "../../../../lib/assets/png/age.png";
import genderPng from "../../../../lib/assets/png/gender.png";
import { BOX_SHADOW, BOX_SHADOW_WIDTH } from "@/app/lib/themes/primary-theme";
import deletePng from "@/app/lib/assets/png/delete.png";

export interface SubjectCardProps {
    subject?: SubjectEntity;
    isLoading?: boolean;
}

export const SubjectCard = memo((props: SubjectCardProps) => {
    const { subject, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { confirm } = App.useApp().modal;

    const { highlightedSearch } = useSubjectFilters();

    return (
        <Card
            style={{
                width: "100%",
                margin: BOX_SHADOW_WIDTH,
                boxShadow: BOX_SHADOW,
            }}
            title={
                !isLoading ? (
                    <Flex align={"center"} justify={"center"}>
                        <HighlightedText
                            style={{
                                fontSize: 16,
                            }}
                            text={subject?.name ?? ""}
                            search={highlightedSearch}
                        />
                    </Flex>
                ) : (
                    <Flex align={"center"} justify={"center"}>
                        <Skeleton.Node
                            style={{
                                width: 50,
                                height: 15,
                            }}
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
                                content: `Удалить "${subject?.name}"?`,
                                okText: "Да",
                                okType: "danger",
                                cancelText: "Нет",
                                onOk() {
                                    dispatch(
                                        deleteSubjectByIdThunk({
                                            id: subject?.id,
                                        }),
                                    );
                                },
                            });
                        }
                    }}
                />,
            ]}
        >
            <Flex
                align={"start"}
                justify={"start"}
                gap={16}
                vertical
                style={{ width: "100%" }}
            >
                <Flex
                    align={"start"}
                    justify={"start"}
                    gap={16}
                    style={{ width: "100%" }}
                >
                    <Picture
                        shape={"picture"}
                        pictureWidth={150}
                        pictureHeight={150}
                        value={
                            !subject?.photos || subject.photos.length === 0
                                ? undefined
                                : subject?.photos[0]
                        }
                    />
                    <Flex
                        style={{
                            width: "100%",
                        }}
                        align={"start"}
                        justify={"start"}
                        gap={4}
                        vertical
                    >
                        <HighlightedText
                            style={{ fontSize: 20, fontWeight: "bold" }}
                            text={subject?.antropologicalType?.name}
                            search={highlightedSearch}
                        />
                        <HighlightedText
                            style={{ fontSize: 18 }}
                            text={subject?.subgroup?.name}
                            search={highlightedSearch}
                        />
                        <LabelWithIcon
                            imageSrc={genderPng.src}
                            labelText={subject?.gender?.name[0] ?? ""}
                            iconSize={CARD_ICON_SIZE}
                            textStyle={{ color: "navy", fontSize: 16 }}
                            search={highlightedSearch}
                        />
                        <LabelWithIcon
                            imageSrc={agePng.src}
                            labelText={subject?.age ?? ""}
                            iconSize={CARD_ICON_SIZE}
                            textStyle={{ color: "gray", fontSize: 16 }}
                            search={highlightedSearch}
                        />
                        <Flex
                            style={{ width: "100%" }}
                            align={"center"}
                            justify={"start"}
                            gap={8}
                        >
                            <LabelWithIcon
                                imageSrc={percentPng.src}
                                labelText={subject?.portraitMatch ?? ""}
                                iconSize={CARD_ICON_SIZE}
                                textStyle={{ color: "indianred", fontSize: 16 }}
                                search={highlightedSearch}
                            />
                        </Flex>
                    </Flex>
                </Flex>
                <HighlightedText
                    style={{ fontSize: 12, color: "gray" }}
                    text={subject?.notes ?? ""}
                    rowsCount={2}
                    search={highlightedSearch}
                />
            </Flex>
        </Card>
    );
});
