"use client";

import React, { memo } from "react";
import {
    App,
    Col,
    Divider,
    Flex,
    Form,
    FormInstance,
    Row,
    Typography,
    Upload,
} from "antd";
import { Picture } from "@/app/UI/Picture";
import { PlusOutlined } from "@ant-design/icons";
import { convertFileToBase64 } from "@/app/UI/Picture/ui/Picture";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";
import { PRIMARY_VARIANT_COLOR } from "@/app/lib/themes/primary-theme";
import deletePng from "../../../lib/assets/png/delete.png";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";

export interface FormImageListProps {
    form: FormInstance;
    formId: string;
    title?: string;
    formListName: string[];
    colCount?: 1 | 2 | 3 | 4 | 6 | 8;
    imageHeight: number;
    previewImages?: boolean;
    onDelete: (id: string) => void;
}

export const FormImageList = memo((props: FormImageListProps) => {
    const {
        form,
        formId,
        title,
        formListName,
        colCount = 4,
        imageHeight = 100,
        previewImages = false,
        onDelete,
    } = props;

    const { confirm, info } = App.useApp().modal;

    return (
        <>
            {title && (
                <Divider orientation={"left"}>
                    <Typography.Text type={"secondary"}>
                        {title}
                    </Typography.Text>
                </Divider>
            )}
            <Form.List name={formListName}>
                {(fields, { add, remove }) => (
                    <>
                        <Row align={"top"} justify={"start"} gutter={[16, 16]}>
                            {fields.map(({ name: imageIndex }) => (
                                <Col key={imageIndex} span={24 / colCount}>
                                    <Form.Item
                                        name={[imageIndex]}
                                        style={{
                                            border: `solid 1px ${PRIMARY_VARIANT_COLOR}`,
                                            backgroundColor: "whitesmoke",
                                            borderRadius: 12,
                                            padding: 4,
                                            height: imageHeight + 8 + 4,
                                            margin: 0,
                                        }}
                                    >
                                        <Picture
                                            shape={"picture"}
                                            pictureWidth={"100%"}
                                            pictureHeight={imageHeight}
                                            borderWidth={0}
                                            picturePreview={previewImages}
                                        />
                                    </Form.Item>
                                    <Flex
                                        align={"center"}
                                        justify={"center"}
                                        gap={8}
                                    >
                                        <Flex
                                            align={"center"}
                                            justify={"center"}
                                            style={{
                                                marginTop: 4,
                                                cursor: "pointer",
                                            }}
                                            gap={4}
                                            onClick={() => {
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
                                                            pictureWidth={
                                                                FORM_ICON_SIZE
                                                            }
                                                            pictureHeight={
                                                                FORM_ICON_SIZE
                                                            }
                                                            borderWidth={0}
                                                            borderRadius={0}
                                                            value={
                                                                deletePng.src
                                                            }
                                                        />
                                                    ),
                                                    content: `Удалить изображение?`,
                                                    okText: "Да",
                                                    okType: "danger",
                                                    cancelText: "Нет",
                                                    onOk() {
                                                        const imgToDelete = {
                                                            ...form.getFieldValue(
                                                                [
                                                                    formListName,
                                                                    imageIndex,
                                                                ],
                                                            ),
                                                        } as PhotoEntity;

                                                        if (imgToDelete.id) {
                                                            onDelete(
                                                                imgToDelete.id,
                                                            );
                                                            remove(imageIndex);
                                                        } else {
                                                            remove(imageIndex);
                                                        }
                                                    },
                                                });
                                            }}
                                        >
                                            {/*<DeleteOutlined*/}
                                            {/*    style={{*/}
                                            {/*        color: "red",*/}
                                            {/*    }}*/}
                                            {/*/>*/}
                                            <Picture
                                                shape={"picture"}
                                                pictureWidth={FORM_ICON_SIZE}
                                                pictureHeight={FORM_ICON_SIZE}
                                                borderWidth={0}
                                                borderRadius={0}
                                                value={deletePng.src}
                                            />
                                            <Typography.Text>
                                                {"Удалить"}
                                            </Typography.Text>
                                        </Flex>
                                    </Flex>
                                </Col>
                            ))}
                            <Col span={24 / colCount}>
                                <Upload
                                    showUploadList={false}
                                    beforeUpload={async (file) => {
                                        // TODO Здесь можно проверять различные параметры файлов
                                        const arrayBufferView = new Uint8Array(
                                            await file.arrayBuffer(),
                                        );
                                        const blob = new Blob(
                                            [arrayBufferView],
                                            {
                                                type: file.type,
                                            },
                                        );
                                        const urlCreator =
                                            window.URL || window.webkitURL;
                                        const objUrl =
                                            urlCreator.createObjectURL(blob);

                                        const base64 =
                                            await convertFileToBase64(file);

                                        const newValue: PhotoEntity = {
                                            id: "",
                                            type: file.type,
                                            size: file.size,
                                            extension: "",
                                            thumbnail: "",
                                            data: base64,
                                            isDefault: false,
                                        };

                                        add(newValue);

                                        return false;
                                    }}
                                    maxCount={1}
                                >
                                    <Flex
                                        align={"center"}
                                        justify={"center"}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            border: `solid 1px ${PRIMARY_VARIANT_COLOR}`,
                                            backgroundColor: "whitesmoke",
                                            borderRadius: 12,
                                            padding: 4,
                                            height: imageHeight + 8 + 4,
                                            margin: 0,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <PlusOutlined
                                            style={{ fontSize: 24 }}
                                        />
                                    </Flex>
                                </Upload>
                            </Col>
                        </Row>
                    </>
                )}
            </Form.List>
        </>
    );
});
