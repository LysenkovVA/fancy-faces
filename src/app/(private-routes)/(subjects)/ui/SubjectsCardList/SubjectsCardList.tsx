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
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { SubjectCard } from "@/app/(private-routes)/(subjects)/ui/SubjectCard/SubjectCard";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { SubjectsFilterPanel } from "@/app/(private-routes)/(subjects)/ui/SubjectsFilterPanel/SubjectsFilterPanel";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

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
            <Flex align={"start"} justify={"center"} gap={16}>
                <SubjectsFilterPanel />
                <FloatButton
                    type={"primary"}
                    shape={"circle"}
                    style={{ bottom: 90 }}
                    icon={<PlusOutlined />}
                    onClick={() => router.push("/subjects/create")}
                />
                <InfiniteScroll
                    onScrollEnd={loadNextPart}
                    height={CONTENT_HEIGHT}
                >
                    {isInitialized && !isLoading && data.length === 0 && (
                        <Empty />
                    )}
                    <Row align={"top"} justify={"start"} gutter={[16, 16]}>
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
            </Flex>
        </DynamicModuleLoader>
    );
});
