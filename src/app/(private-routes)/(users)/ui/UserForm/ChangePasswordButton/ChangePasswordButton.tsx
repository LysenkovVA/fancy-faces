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
import { changePasswordThunk } from "@/app/(private-routes)/(users)/model/thunks/changePasswordThunk";

export interface ChangePasswordButtonProps {
    userId: string;
}

export const ChangePasswordButton = memo((props: ChangePasswordButtonProps) => {
    const { userId } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState<string | undefined>(
        undefined,
    );

    const dispatch = useAppDispatch();

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                <Typography.Text>{"Поменять пароль"}</Typography.Text>
            </Button>
            <Modal
                title={
                    <LabelWithIcon
                        style={{
                            marginBottom: MODAL_TITLE_MARGIN_BOTTOM,
                        }}
                        imageSrc={userPng.src}
                        labelText={"Смена пароля"}
                        iconSize={FORM_ICON_SIZE}
                    />
                }
                okType={"primary"}
                okText={"Сохранить"}
                cancelText={"Отмена"}
                onOk={async () => {
                    const result = await dispatch(
                        changePasswordThunk({
                            userId,
                            data: {
                                oldPassword: "",
                                newPassword: newPassword ?? "",
                            },
                        }),
                    ).unwrap();

                    if (result.isOk) {
                        setIsModalOpen(false);
                    } else {
                        alert("Ошибка при смене пароля!");
                    }
                }}
                onCancel={() => {
                    setNewPassword(undefined);
                    setIsModalOpen(false);
                }}
                onClose={() => {
                    setNewPassword(undefined);
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
                    placeholder={"Новый пароль"}
                    onChange={(value) => setNewPassword(value.target.value)}
                ></Input>
            </Modal>
        </>
    );
});
