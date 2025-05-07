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
    getUsersList,
    getUsersListError,
    getUsersListHasMore,
    getUsersListIsInitialized,
    getUsersListIsLoading,
    getUsersListTake,
} from "../../model/selectors/usersListSelectors";
import { getUsersListThunk } from "../../model/thunks/getUsersListThunk";
import { usersListReducer } from "../../model/slices/usersListSlice";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { UserCard } from "@/app/(private-routes)/(users)/ui/UserCard/UserCard";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { UsersFilterPanel } from "@/app/(private-routes)/(users)/ui/UsersFilterPanel/UsersFilterPanel";
import { BOX_SHADOW_WIDTH } from "@/app/lib/themes/primary-theme";

export interface UsersCardListProps {
    columnsCount: 1 | 2 | 3 | 4 | 6 | 8;
}

export const UsersCardList = memo((props: UsersCardListProps) => {
    const { columnsCount } = props;
    const router = useRouter();

    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(getUsersListIsLoading);
    const error = useAppSelector(getUsersListError);
    const data = useAppSelector(getUsersList.selectAll);
    const hasMore = useAppSelector(getUsersListHasMore);
    const take = useAppSelector(getUsersListTake);
    const isInitialized = useAppSelector(getUsersListIsInitialized);

    const [notificationApi, contextHolder] = useNotification();

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getUsersListThunk({
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
                getUsersListThunk({
                    replaceData: false,
                }),
            );
        }
    }, [isInitialized, hasMore, isLoading, dispatch]);

    return (
        <DynamicModuleLoader
            reducers={{ usersListSchema: usersListReducer }}
            removeAfterUnmount={false}
        >
            {contextHolder}
            <Flex align={"start"} justify={"center"} gap={8}>
                <UsersFilterPanel />
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
                                    <UserCard user={entity} />
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
                                        <UserCard isLoading />
                                    </Col>
                                ))}
                            </>
                        )}
                    </Row>
                </InfiniteScroll>
                <FloatButton
                    type={"primary"}
                    shape={"circle"}
                    style={{ bottom: 90 }}
                    icon={<PlusOutlined />}
                    onClick={() => router.push("/users/create")}
                />
            </Flex>
        </DynamicModuleLoader>
    );
});
