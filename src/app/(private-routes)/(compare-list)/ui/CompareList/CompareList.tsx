"use client";

import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { getCompareSubjectsList } from "@/app/(private-routes)/(compare-list)/model/selectors/compareSubjectsListSelectors";
import { App, CollapseProps, Empty, Flex, Typography } from "antd";
import { CompareListItem } from "@/app/(private-routes)/(compare-list)/ui/CompareList/CompareListItem";
import dayjs from "dayjs";
import { UserHelper } from "@/app/(private-routes)/(users)/model/helpers/UserHelper";
import { PicturesCarousel } from "@/app/UI/PicturesCarousel";
import { InfiniteScroll } from "@/app/UI/InfiniteScroll";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import {
    ON_SURFACE_COLOR,
    ON_SURFACE_SECONDARY_COLOR,
} from "@/app/lib/themes/primary-theme";
import { useRouter } from "next/navigation";
import { Picture } from "@/app/UI/Picture";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import deletePng from "@/assets/delete.png";
import { compareSubjectsListActions } from "@/app/(private-routes)/(compare-list)/model/slices/compareSubjectsListSlice";

export interface CompareListProps {
    carouselHeight?: number;
    carouselWidth?: number;
    columnWidth?: number;
}

export const CompareList = memo((props: CompareListProps) => {
    const { carouselHeight, carouselWidth, columnWidth = 200 } = props;

    const dispatch = useAppDispatch();
    const subjects = useAppSelector(getCompareSubjectsList);
    const router = useRouter();
    const { confirm } = App.useApp().modal;

    useEffect(() => {
        if (!subjects || subjects.length === 0) {
            router.push("/subjects");
        }
    }, [router, subjects]);

    const onClear = useCallback(
        (id: string) => {
            confirm({
                title: (
                    <Flex align={"center"} justify={"start"} gap={4}>
                        <Typography.Text>
                            {"Убрать из сравнения"}
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
                content: `Убрать объект из сравнения?`,
                okText: "Да",
                okType: "danger",
                cancelText: "Нет",
                onOk() {
                    dispatch(compareSubjectsListActions.removeSubject(id));
                },
            });
        },
        [confirm, dispatch],
    );

    const infoContent = useMemo(
        () => (
            <Flex align={"start"} justify={"center"} gap={8} vertical>
                <CompareListItem itemName={"Дата"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.date
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.date
                                    ? dayjs(subject.date).format("DD.MM.YYYY")
                                    : "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Специалист"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.user?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {UserHelper.getSurnameWithInitials(
                                    subject.user,
                                ) ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Инициатор"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.initiator?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.initiator?.name ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Номер"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.objectNumber
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.objectNumber ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Название"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.name ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Место"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.location
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.location ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Антропологический тип"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.antropologicalType?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.antropologicalType?.name ??
                                    "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Подгруппа"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.subgroup?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.subgroup?.name ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Пол"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.gender?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.gender?.name ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Возраст"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.age
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.age ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Длительность наблюдения"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.durationOfObservation
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.durationOfObservation ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Давность наблюдения"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.lastObservation
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.lastObservation ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Степень схожести"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.portraitMatch
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.portraitMatch ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Дополнительно"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.initiator?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.notes ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
            </Flex>
        ),
        [columnWidth, subjects],
    );

    const watchContent = useMemo(
        () => (
            <Flex align={"start"} justify={"center"} gap={8} vertical>
                <CompareListItem itemName={"Вид"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.viewType?.name
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.viewType?.name ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Анатомические признаки объекта"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.anatomicCharacteristics
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.anatomicCharacteristics ??
                                    "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Функциональные признаки объекта"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.functionalCharacteristics
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.functionalCharacteristics ??
                                    "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Особенности запоминания очевидца"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.eyewitnessCharacteristics
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.eyewitnessCharacteristics ??
                                    "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
            </Flex>
        ),
        [columnWidth, subjects],
    );

    const elementsContent = useMemo(
        () => (
            <Flex align={"start"} justify={"center"} gap={8} vertical>
                <CompareListItem itemName={"Лицо"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.face
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.face ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Волосяной покров"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.hear
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.hear ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Лоб"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.forehead
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.forehead ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Брови"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.eyebrow
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.eyebrow ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Глаза"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.eyes
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.eyes ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Нос"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.nose
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.nose ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Рот"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.mouth
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.mouth ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Подбородок"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.chin
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.chin ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Морщины, шрамы, родинки"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.scars
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.scars ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
                <CompareListItem itemName={"Уши"}>
                    <Flex align={"start"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Typography.Text
                                key={subject.id}
                                style={{
                                    fontSize: 16,
                                    width: columnWidth,
                                    color: subject.ears
                                        ? ON_SURFACE_COLOR
                                        : ON_SURFACE_SECONDARY_COLOR,
                                }}
                            >
                                {subject.ears ?? "Отсутствует"}
                            </Typography.Text>
                        ))}
                    </Flex>
                </CompareListItem>
            </Flex>
        ),
        [columnWidth, subjects],
    );

    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: "Информация",
            children: infoContent,
        },
        {
            key: "2",
            label: "Наблюдения",
            children: watchContent,
        },
        {
            key: "3",
            label: "Описание внешности",
            children: elementsContent,
        },
    ];

    if (!subjects || subjects.length === 0) {
        return <Empty />;
    }

    return (
        <div style={{ overflowX: "scroll" }}>
            <Flex align={"start"} justify={"center"} gap={8} vertical>
                <CompareListItem itemName={""}>
                    <Flex align={"center"} justify={"center"} gap={32}>
                        {subjects.map((subject) => (
                            <Flex
                                key={subject.id}
                                style={{ width: columnWidth }}
                                align={"start"}
                                justify={"center"}
                                gap={8}
                                vertical
                            >
                                <Flex
                                    align={"center"}
                                    justify={"start"}
                                    gap={8}
                                    style={{ width: "100%", cursor: "pointer" }}
                                    onClick={() => onClear(subject.id)}
                                >
                                    <Picture
                                        shape={"picture"}
                                        pictureWidth={FORM_ICON_SIZE}
                                        pictureHeight={FORM_ICON_SIZE}
                                        value={deletePng.src}
                                    />
                                    <Typography.Text>
                                        {"Удалить из сравнения"}
                                    </Typography.Text>
                                </Flex>
                                <PicturesCarousel
                                    pictureWidth={columnWidth - 50}
                                    pictureHeight={carouselHeight}
                                    entities={subject.photos}
                                    picturePreview={true}
                                />
                            </Flex>
                        ))}
                    </Flex>
                </CompareListItem>
                <InfiniteScroll
                    height={`calc(${CONTENT_HEIGHT} - ${carouselHeight}px - 80px`}
                    style={{ width: "auto" }}
                    // style={{ background: "red" }}
                >
                    {infoContent}
                    {watchContent}
                    {elementsContent}
                    {/*<Collapse items={items} defaultActiveKey={["1", "2", "3"]} />*/}
                </InfiniteScroll>
            </Flex>
        </div>
    );
});
