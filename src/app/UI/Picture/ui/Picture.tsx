"use client";

import React, {
    CSSProperties,
    memo,
    useCallback,
    useEffect,
    useState,
} from "react";
import { App, Flex, Image, Typography, Upload } from "antd";
import noImage from "../assets/no-image.png";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";
import { PRIMARY_VARIANT_COLOR } from "@/app/lib/themes/primary-theme";
import { useAppDispatch } from "@/app/lib/store";
import { getPhotoByIdThunk } from "@/app/(private-routes)/(photos)/model/thunks/getPhotoByIdThunk";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import deletePng from "@/app/lib/assets/png/delete.png";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { ClientFiles } from "@/app/lib/utils/clientFiles";

const DEFAULT_BORDER_WIDTH = 0;
const DEFAULT_BORDER_RADIUS = 12;

function wrapperPictureStyle(
    borderWidth: number,
    borderRadius: number,
    size: { width: number | string; height: number },
    shape: "picture" | "avatar",
): CSSProperties {
    return {
        border: `solid ${borderWidth}px ${PRIMARY_VARIANT_COLOR}`,
        borderRadius: shape === "picture" ? borderRadius : "50%",
        width: `calc(${size.width} + 2 * ${borderWidth})`,
        // height: size.height + 2 * borderWidth,
        height: `calc(${size.height} + 2 * ${borderWidth})`,
        lineHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
    };
}

function pictureStyle(
    borderWidth: number,
    borderRadius: number,
    shape: "picture" | "avatar",
): CSSProperties {
    return {
        borderRadius: shape === "picture" ? borderRadius - borderWidth : "50%",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        lineHeight: 0,
    };
}

export interface PictureProps {
    style?: CSSProperties;
    value?: string | PhotoEntity;
    onChange?: (value?: PhotoEntity) => void;
    shape: "picture" | "avatar";
    pictureWidth?: number | string;
    pictureHeight: number | undefined;
    picturePreview?: boolean;
    borderWidth?: number;
    borderRadius?: number;
    isEditable?: boolean;
}

export const Picture = memo((props: PictureProps) => {
    const {
        style,
        value,
        onChange,
        shape = "picture",
        pictureWidth = 50,
        pictureHeight = 50,
        picturePreview = false,
        borderWidth = DEFAULT_BORDER_WIDTH,
        borderRadius = DEFAULT_BORDER_RADIUS,
        isEditable = false,
    } = props;

    const [srcValue, setSrcValue] = useState<string | undefined>(undefined);

    const dispatch = useAppDispatch();
    const { confirm } = App.useApp().modal;

    useEffect(() => {
        if (value) {
            // Стринговое значение
            if (typeof value === "string") {
                setSrcValue(value);
            } else {
                // Если объект (значит PhotoEntity)
                if (typeof value === "object") {
                    const photo = value as PhotoEntity;
                    // Если есть идентификатор
                    if (photo?.id) {
                        // Если данные оригинала есть
                        if (photo?.data !== undefined && photo.data !== "") {
                            const url = ClientFiles.convertBase64ToUrl(
                                photo.data!,
                            );
                            setSrcValue(url);
                        } else {
                            // Если есть предпросмотр изображения
                            if (
                                photo?.thumbnail !== undefined &&
                                photo?.thumbnail !== ""
                            ) {
                                const url = ClientFiles.convertBase64ToUrl(
                                    photo.thumbnail,
                                );
                                setSrcValue(url);

                                dispatch(
                                    getPhotoByIdThunk({ id: photo.id }),
                                ).then((result) => {
                                    if (
                                        result.meta.requestStatus ===
                                        "fulfilled"
                                    ) {
                                        const loadedPhoto =
                                            result.payload as ResponseData<PhotoEntity>;

                                        if (
                                            loadedPhoto.isOk &&
                                            loadedPhoto.data.data
                                        ) {
                                            const url =
                                                ClientFiles.convertBase64ToUrl(
                                                    loadedPhoto.data.data,
                                                );
                                            setSrcValue(url);
                                        }
                                    }
                                });
                            }
                        }
                    }
                    // Если идентификатора нет
                    else {
                        // Если есть оригинал изображения
                        if (photo?.data !== undefined && photo.data !== "") {
                            const url = ClientFiles.convertBase64ToUrl(
                                photo.data!,
                            );
                            setSrcValue(url);
                        } else {
                            // Если есть предпросмотр изображения
                            if (
                                photo?.thumbnail !== undefined &&
                                photo?.thumbnail !== ""
                            ) {
                                const url = ClientFiles.convertBase64ToUrl(
                                    photo.thumbnail,
                                );
                                setSrcValue(url);
                            }
                        }
                    }
                }
            }
        } else {
            setSrcValue(undefined);
        }
    }, [dispatch, value]);

    const onClear = useCallback(() => {
        confirm({
            title: (
                <Flex align={"center"} justify={"start"} gap={4}>
                    <Typography.Text>{"Очистить"}</Typography.Text>
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
            content: `Очистить изображение?`,
            okText: "Да",
            okType: "danger",
            cancelText: "Нет",
            onOk() {
                setSrcValue(undefined);
                onChange?.(undefined);
            },
        });
    }, [confirm, onChange]);

    const pictureContent = () => {
        return (
            <div
                style={{
                    ...wrapperPictureStyle(
                        borderWidth,
                        borderRadius,
                        {
                            width: pictureWidth,
                            height: pictureHeight,
                        },
                        shape,
                    ),
                    ...style,
                }}
            >
                <Image
                    wrapperStyle={{
                        width: pictureWidth,
                        height: pictureHeight,
                    }}
                    style={pictureStyle(borderWidth, borderRadius, shape)}
                    alt={shape}
                    fallback={noImage.src}
                    src={srcValue ?? noImage.src}
                    preview={picturePreview}
                />
            </div>
        );
    };

    return (
        <Flex align={"center"} justify={"center"} vertical gap={4}>
            {isEditable ? (
                <Upload
                    showUploadList={false}
                    beforeUpload={async (file) => {
                        const newValue =
                            await ClientFiles.convertFileToPhotoEntity(file);
                        const objUrl = ClientFiles.convertBase64ToUrl(
                            newValue.data!,
                        );
                        setSrcValue(objUrl);
                        onChange?.(newValue);

                        return false;
                    }}
                    maxCount={1}
                >
                    {pictureContent()}
                </Upload>
            ) : (
                pictureContent()
            )}
            {isEditable && srcValue && (
                <Flex
                    style={{ cursor: "pointer" }}
                    align={"center"}
                    justify={"center"}
                    gap={4}
                    onClick={onClear}
                >
                    <Picture
                        value={deletePng.src}
                        shape={"picture"}
                        borderWidth={0}
                        borderRadius={0}
                        pictureWidth={16}
                        pictureHeight={16}
                    />
                    <Typography.Text>{"Очистить"}</Typography.Text>
                </Flex>
            )}
        </Flex>
    );
});
