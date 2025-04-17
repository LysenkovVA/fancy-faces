"use client";

import { memo } from "react";
import {
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
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { convertFileToBase64 } from "@/app/UI/Picture/ui/Picture";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";
import { showDeleteConfirm } from "@/app/UI/showDeleteConfirm";

export interface FormImageListProps {
    form: FormInstance;
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
        title,
        formListName,
        colCount = 4,
        imageHeight = 100,
        previewImages = false,
        onDelete,
    } = props;

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
                                            border: "solid 2px gray",
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
                                        style={{
                                            marginTop: 4,
                                            cursor: "pointer",
                                        }}
                                        gap={4}
                                        onClick={() => {
                                            showDeleteConfirm(
                                                "Удаление?",
                                                "Удалить изображение?",
                                                () => {
                                                    const imgToDelete = {
                                                        ...form.getFieldValue([
                                                            formListName,
                                                            imageIndex,
                                                        ]),
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
                                            );
                                        }}
                                    >
                                        <DeleteOutlined
                                            style={{
                                                color: "red",
                                            }}
                                        />
                                        <Typography.Text type={"danger"}>
                                            {"Удалить"}
                                        </Typography.Text>
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
                                            data: base64,
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
                                            border: "solid 2px gray",
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
