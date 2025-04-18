"use client";

import { CSSProperties, memo, useCallback, useEffect } from "react";
import { Button, Flex, Form, Image, Input, Typography } from "antd";
import { logoPNG } from "@/app/lib/assets";
import useNotification from "antd/es/notification/useNotification";
import { useRouter } from "next/navigation";
import {
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store/model/hooks/hooks";
import { loginThunk } from "@/app/(public-routes)/(login)/model/services/loginThunk";
import { getUserAuthDataError } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";

export interface LoginFormProps {
    style?: CSSProperties;
}

export const LoginForm = memo((props: LoginFormProps) => {
    const { style } = props;
    const [notificationApi, contextHolder] = useNotification();

    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const error = useAppSelector(getUserAuthDataError);

    console.log("LoginForm error", JSON.stringify(error));

    useEffect(() => {
        if (error) {
            notificationApi.error({
                message: error,
            });
        }
    }, [error, notificationApi]);

    const onSubmitForm = useCallback(
        async (values: any) => {
            try {
                dispatch(loginThunk({ ...values })).then((result) => {
                    if (result.meta.requestStatus === "fulfilled") {
                        router.push("/subjects");
                    }
                });
            } catch (error) {
                if (error instanceof Error)
                    notificationApi.error({ message: error.message });
            }
        },
        [dispatch, notificationApi, router],
    );

    return (
        <>
            {contextHolder}
            <Flex
                style={{ width: "30%", ...style }}
                vertical
                align={"center"}
                justify={"center"}
                gap={16}
            >
                <Image
                    preview={false}
                    src={logoPNG.src}
                    alt={"logo"}
                    height={150}
                    width={"auto"}
                />
                <Flex
                    style={{
                        borderRadius: 12,
                        border: "solid lightgray 1px",
                        padding: 16,
                        width: "100%",
                    }}
                    vertical
                    align={"center"}
                    justify={"center"}
                    gap={16}
                >
                    <Typography.Text
                        style={{ fontSize: 16, textAlign: "center" }}
                        type={"secondary"}
                    >
                        {"АВТОРИЗАЦИЯ"}
                    </Typography.Text>
                    <Form
                        id={"loginForm"}
                        style={{ width: "100%" }}
                        form={form}
                        onFinish={onSubmitForm}
                    >
                        <Form.Item
                            name={["login"]}
                            rules={[
                                { required: true, message: "Не указан логин" },
                            ]}
                        >
                            <Input placeholder={"Логин"} />
                        </Form.Item>
                        <Form.Item
                            name={["password"]}
                            rules={[
                                { required: true, message: "Не указан пароль" },
                            ]}
                        >
                            <Input placeholder={"Пароль"} type={"password"} />
                        </Form.Item>
                        <Form.Item
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                htmlType={"submit"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.submit();
                                }}
                            >
                                {"Войти"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Flex>
        </>
    );
});
