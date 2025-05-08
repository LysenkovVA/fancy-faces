"use client";

import React, { memo, useCallback, useEffect } from "react";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { Col, Empty, Flex, FloatButton, Row } from "antd";
import { InfiniteScroll } from "@/app/UI/InfiniteScroll/ui/InfiniteScroll";
import {
    getSubjectsList,
    getSubjectsListError,
    getSubjectsListHasMore,
    getSubjectsListIsInitialized,
    getSubjectsListIsLoading,
    getSubjectsListTake,
} from "../../model/selectors/subjectsListSelectors";
import { getSubjectsListThunk } from "../../model/thunks/getSubjectsListThunk";
import { subjectsListReducer } from "../../model/slices/subjectsListSlice";
import { useRouter } from "next/navigation";
import { SubjectCard } from "@/app/(private-routes)/(subjects)/ui/SubjectCard/SubjectCard";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { SubjectsFilterPanel } from "@/app/(private-routes)/(subjects)/ui/SubjectsFilterPanel/SubjectsFilterPanel";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    BOX_SHADOW_WIDTH,
    ON_SECONDARY_COLOR,
    SECONDARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";
import { PlusOutlined } from "@ant-design/icons";

export interface SubjectsCardListProps {
    columnsCount: 1 | 2 | 3 | 4 | 6 | 8;
}

export const SubjectsCardList = memo((props: SubjectsCardListProps) => {
    const { columnsCount } = props;
    const router = useRouter();

    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(getSubjectsListIsLoading);
    const error = useAppSelector(getSubjectsListError);
    const data = useAppSelector(getSubjectsList.selectAll);
    const hasMore = useAppSelector(getSubjectsListHasMore);
    const take = useAppSelector(getSubjectsListTake);
    const isInitialized = useAppSelector(getSubjectsListIsInitialized);

    const [notificationApi, contextHolder] = useNotification();

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getSubjectsListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    useEffect(() => {
        if (error) {
            notificationApi.error({ message: "Ошибка", description: error });
        }
    }, [error, notificationApi]);

    const loadNextPart = useCallback(() => {
        if (isInitialized && hasMore && !isLoading) {
            dispatch(
                getSubjectsListThunk({
                    replaceData: false,
                }),
            );
        }
    }, [isInitialized, hasMore, isLoading, dispatch]);

    return (
        <DynamicModuleLoader
            reducers={{ subjectsListSchema: subjectsListReducer }}
            removeAfterUnmount={false}
        >
            {contextHolder}
            <Flex align={"start"} justify={"center"} gap={8}>
                <SubjectsFilterPanel />
                <InfiniteScroll
                    onScrollEnd={loadNextPart}
                    height={`calc(${CONTENT_HEIGHT} + ${BOX_SHADOW_WIDTH * 2}px)`}
                    style={{
                        marginTop: `-${BOX_SHADOW_WIDTH}px`,
                        marginBottom: `-${BOX_SHADOW_WIDTH}px`,
                    }}
                >
                    {isInitialized && !isLoading && data.length === 0 && (
                        <Empty />
                    )}
                    <Row
                        align={"top"}
                        justify={"start"}
                        gutter={[16, 8]}
                        style={{ width: "100%" }}
                    >
                        {data?.map((entity) => {
                            return (
                                <Col
                                    key={entity.id}
                                    span={Number(24 / columnsCount)}
                                >
                                    <SubjectCard subject={entity} />
                                </Col>
                            );
                        })}
                        {isLoading && (
                            <>
                                {/*Показываем скелетоны карточек*/}
                                {new Array(take).fill(0).map((_, index) => (
                                    <Col
                                        key={index}
                                        span={Number(24 / columnsCount)}
                                    >
                                        <SubjectCard isLoading />
                                    </Col>
                                ))}
                            </>
                        )}
                    </Row>
                </InfiniteScroll>
                <FloatButton
                    type={"primary"}
                    shape={"circle"}
                    style={{
                        border: `1px solid ${SECONDARY_VARIANT_COLOR}`,
                        bottom: 90,
                    }}
                    icon={
                        <PlusOutlined style={{ color: ON_SECONDARY_COLOR }} />
                    }
                    onClick={() => router.push("/subjects/create")}
                />
            </Flex>
        </DynamicModuleLoader>
    );
});
