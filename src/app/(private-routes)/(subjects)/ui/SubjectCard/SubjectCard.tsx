"use client";

import React, { memo } from "react";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import { App, Card, Flex, Typography } from "antd";
import { useRouter } from "next/navigation";
import { deleteSubjectByIdThunk } from "../../model/thunks/deleteSubjectByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { useSubjectFilters } from "@/app/(private-routes)/(subjects)/ui/SubjectsFilterPanel/hooks/useSubjectFilters";
import { Picture } from "@/app/UI/Picture";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import {
    CARD_ICON_SIZE,
    FORM_ICON_SIZE,
} from "@/app/UI/AppLayout/config/consts";
import agePng from "../../../../lib/assets/png/age.png";
import textPng from "../../../../lib/assets/png/textField.png";
import subgroupPng from "../../../../lib/assets/png/subgroup.png";
import calendarPng from "../../../../lib/assets/png/calendar.png";
import userPng from "../../../../lib/assets/png/user.png";
import { BOX_SHADOW, BOX_SHADOW_WIDTH } from "@/app/lib/themes/primary-theme";
import deletePng from "@/app/lib/assets/png/delete.png";
import dayjs from "dayjs";
import { UserHelper } from "@/app/(private-routes)/(users)/model/helpers/UserHelper";
import { PicturesCarousel } from "@/app/UI/PicturesCarousel";

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
            // title={
            //     !isLoading ? (
            //         <Flex align={"center"} justify={"center"}>
            //             <HighlightedText
            //                 style={{
            //                     fontSize: 16,
            //                 }}
            //                 text={subject?.name ?? ""}
            //                 search={highlightedSearch}
            //             />
            //         </Flex>
            //     ) : (
            //         <Flex align={"center"} justify={"center"}>
            //             <Skeleton.Node
            //                 style={{
            //                     width: 50,
            //                     height: 15,
            //                 }}
            //                 active
            //             />
            //         </Flex>
            //     )
            // }
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
                style={{ width: "100%" }}
            >
                {/*<Picture*/}
                {/*    shape={"picture"}*/}
                {/*    pictureWidth={150}*/}
                {/*    pictureHeight={150}*/}
                {/*    value={*/}
                {/*        !subject?.photos || subject.photos.length === 0*/}
                {/*            ? undefined*/}
                {/*            : subject?.photos[0]*/}
                {/*    }*/}
                {/*/>*/}
                <PicturesCarousel
                    pictureWidth={200}
                    pictureHeight={200}
                    entities={subject?.photos}
                />
                <Flex
                    style={{
                        width: "100%",
                    }}
                    align={"center"}
                    justify={"space-between"}
                    gap={32}
                    vertical
                >
                    <Flex
                        style={{
                            width: "100%",
                        }}
                        align={"start"}
                        justify={"start"}
                        gap={4}
                        vertical
                    >
                        <LabelWithIcon
                            imageSrc={textPng.src}
                            labelText={subject?.name ?? "-"}
                            iconSize={CARD_ICON_SIZE}
                            search={highlightedSearch}
                        />
                        <LabelWithIcon
                            imageSrc={subgroupPng.src}
                            labelText={subject?.subgroup?.name ?? "-"}
                            iconSize={CARD_ICON_SIZE}
                            search={highlightedSearch}
                        />
                        <LabelWithIcon
                            imageSrc={agePng.src}
                            labelText={subject?.age ?? ""}
                            iconSize={CARD_ICON_SIZE}
                            search={highlightedSearch}
                        />
                    </Flex>
                    <Flex
                        style={{
                            width: "100%",
                        }}
                        align={"start"}
                        justify={"start"}
                        gap={4}
                        vertical
                    >
                        <LabelWithIcon
                            imageSrc={calendarPng.src}
                            labelText={
                                subject?.date
                                    ? dayjs(subject.date).format("DD.MM.YYYY")
                                    : "-"
                            }
                            iconSize={CARD_ICON_SIZE}
                            search={highlightedSearch}
                        />
                        <LabelWithIcon
                            imageSrc={userPng.src}
                            labelText={
                                subject?.user
                                    ? UserHelper.getSurnameWithInitials(
                                          subject.user,
                                      )
                                    : "-"
                            }
                            iconSize={CARD_ICON_SIZE}
                            search={highlightedSearch}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
});
