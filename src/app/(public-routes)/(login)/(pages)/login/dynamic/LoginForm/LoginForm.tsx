"use client";

import { CSSProperties, memo, useCallback, useEffect } from "react";
import { Button, Flex, Form, Image, Typography } from "antd";
import { logoPNG } from "@/app/lib/assets";
import useNotification from "antd/es/notification/useNotification";
import { useRouter } from "next/navigation";
import {
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store/model/hooks/hooks";
import { loginThunk } from "@/app/(public-routes)/(login)/model/services/loginThunk";
import { getUserAuthDataError } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { Version } from "@/app/UI/Version";
import {
    ON_PRIMARY_COLOR,
    PRIMARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";
import { FormItemInput } from "@/app/UI/FormItemInput";
import userPng from "../../../../../../lib/assets/png/user.png";
import passwordPng from "../../../../../../lib/assets/png/password.png";

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
                gap={4}
            >
                <Image
                    preview={false}
                    src={logoPNG.src}
                    alt={"logo"}
                    height={80}
                    width={"auto"}
                />
                <Typography.Text
                    style={{
                        fontSize: 30,
                        textAlign: "center",
                        color: ON_PRIMARY_COLOR,
                    }}
                >
                    {"Фотопортрет"}
                </Typography.Text>
                <Flex
                    style={{
                        borderRadius: 12,
                        border: `solid 1px ${PRIMARY_VARIANT_COLOR}`,
                        padding: 16,
                        width: "100%",
                    }}
                    vertical
                    align={"center"}
                    justify={"center"}
                    gap={16}
                >
                    <Form
                        id={"loginForm"}
                        colon={false}
                        requiredMark={false}
                        style={{ width: "100%" }}
                        form={form}
                        onFinish={onSubmitForm}
                    >
                        <FormItemInput
                            labelText={""}
                            imageSrc={userPng.src}
                            namePath={["login"]}
                            isLoading={false}
                            placeholder={"Логин"}
                            required
                            requiredMessage={"Не указан логин"}
                        />
                        <FormItemInput
                            labelText={""}
                            imageSrc={passwordPng.src}
                            type={"password"}
                            namePath={["password"]}
                            isLoading={false}
                            placeholder={"Пароль"}
                            required
                            requiredMessage={"Не указан пароль"}
                        />
                        <Form.Item noStyle>
                            <Flex
                                style={{ width: "100%" }}
                                align={"center"}
                                justify={"center"}
                                vertical
                                gap={12}
                            >
                                <Button
                                    style={{ width: "100%" }}
                                    htmlType={"submit"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.submit();
                                    }}
                                >
                                    {"Войти"}
                                </Button>
                                <Version />
                            </Flex>
                        </Form.Item>
                    </Form>
                </Flex>
            </Flex>
        </>
    );
});
