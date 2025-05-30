"use client";

import { Button, Input, Modal, Typography } from "antd";
import { memo, useState } from "react";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import {
    FORM_ICON_SIZE,
    MODAL_TITLE_MARGIN_BOTTOM,
    MODAL_WIDTH,
} from "@/app/UI/AppLayout/config/consts";
import userPng from "@/app/lib/assets/png/user.png";
import { useAppDispatch } from "@/app/lib/store";
import { changeLoginThunk } from "@/app/(private-routes)/(users)/model/thunks/changeLoginThunk";
import useNotification from "antd/es/notification/useNotification";

export interface ChangeLoginButtonProps {
    userId: string;
}

export const ChangeLoginButton = memo((props: ChangeLoginButtonProps) => {
    const { userId } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLogin, setNewLogin] = useState<string | undefined>(undefined);

    const dispatch = useAppDispatch();
    const [notificationApi, notificationContext] = useNotification();

    return (
        <>
            {notificationContext}
            <Button onClick={() => setIsModalOpen(true)}>
                <Typography.Text>{"Поменять логин"}</Typography.Text>
            </Button>
            <Modal
                title={
                    <LabelWithIcon
                        textStyle={{
                            marginBottom: MODAL_TITLE_MARGIN_BOTTOM,
                        }}
                        imageSrc={userPng.src}
                        labelText={"Смена логина"}
                        iconSize={FORM_ICON_SIZE}
                    />
                }
                okType={"primary"}
                okText={"Сохранить"}
                cancelText={"Отмена"}
                onOk={async () => {
                    try {
                        const result = await dispatch(
                            changeLoginThunk({
                                userId,
                                data: {
                                    newLogin: newLogin ?? "",
                                },
                            }),
                        ).unwrap();

                        if (result.isOk) {
                            setIsModalOpen(false);
                        } else {
                            notificationApi.error({
                                message: result.getAllErrors(),
                            });
                        }
                    } catch (e) {
                        notificationApi.error({ message: String(e) });
                    }
                }}
                onCancel={() => {
                    setNewLogin(undefined);
                    setIsModalOpen(false);
                }}
                onClose={() => {
                    setNewLogin(undefined);
                    setIsModalOpen(false);
                }}
                destroyOnClose
                open={isModalOpen}
                styles={{
                    body: {
                        maxHeight: "calc(100vh * 0.5)",
                        overflowY: "auto",
                    },
                }}
                width={MODAL_WIDTH}
            >
                <Input
                    placeholder={"Новый логин"}
                    onChange={(value) => setNewLogin(value.target.value)}
                ></Input>
            </Modal>
        </>
    );
});
