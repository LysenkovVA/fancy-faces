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

const BORDER_RADIUS = 12;

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
    pictureHeight?: number;
    picturePreview?: boolean;
    borderWidth?: number;
    borderRadius?: number;
    isEditable?: boolean;
}

// Convert File to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,")
            // We can either keep it or remove it based on your needs
            const base64String = reader.result as string;
            const base64WithoutPrefix = base64String.split(",")[1];
            resolve(base64WithoutPrefix);
        };
        reader.onerror = (error) => reject(error);
    });
};

// Convert base64 to URL
export const convertBase64ToUrl = (
    base64String: string,
    mimeType = "image/jpeg",
): string => {
    // Create a data URL from the base64 string
    return `data:${mimeType};base64,${base64String}`;
};

export const Picture = memo((props: PictureProps) => {
    const {
        style,
        value,
        onChange,
        shape = "picture",
        pictureWidth = 50,
        pictureHeight = 50,
        picturePreview = false,
        borderWidth = 2,
        borderRadius = BORDER_RADIUS,
        isEditable = false,
    } = props;

    // const [isLoading, setIsLoading] = useState(true);
    // const [isInitialized, setIsInitialized] = useState(false);
    const [srcValue, setSrcValue] = useState<string | undefined>(undefined);

    const dispatch = useAppDispatch();
    const { confirm } = App.useApp().modal;

    useEffect(() => {
        if (value) {
            // Стринговое значение
            if (typeof value === "string") {
                setSrcValue(value);
                // setIsInitialized(true);
                // setIsLoading(false);
            } else {
                // Если объект (значит PhotoEntity)
                if (typeof value === "object") {
                    const photo = value as PhotoEntity;

                    // Если есть идентификатор
                    if (photo?.id) {
                        // Если данные оригинала есть
                        if (photo?.data !== undefined) {
                            console.log("Picture", "setting photo.data...");
                            const url = convertBase64ToUrl(photo.data!);
                            setSrcValue(url);
                            console.log(
                                "Picture",
                                "photo.data has been set...",
                            );
                            // setIsInitialized(true);
                            // setIsLoading(false);
                        } else {
                            // Если есть предпросмотр изображения
                            if (photo?.thumbnail) {
                                console.log(
                                    "Picture",
                                    "setting photo.thumbnail... and dispatching photo...",
                                );
                                const url = convertBase64ToUrl(photo.thumbnail);
                                setSrcValue(url);

                                // simulateDelay(3000).then(() => {
                                dispatch(
                                    getPhotoByIdThunk({ id: photo.id }),
                                ).then((result) => {
                                    if (
                                        result.meta.requestStatus ===
                                        "fulfilled"
                                    ) {
                                        console.log(
                                            "Picture",
                                            "photo dispatched...",
                                        );
                                        const loadedPhoto =
                                            result.payload as ResponseData<PhotoEntity>;

                                        if (
                                            loadedPhoto.isOk &&
                                            loadedPhoto.data.data
                                        ) {
                                            console.log(
                                                "Picture",
                                                "setting photo.data after dispatched...",
                                            );
                                            const url = convertBase64ToUrl(
                                                loadedPhoto.data.data,
                                            );
                                            setSrcValue(url);
                                        }
                                    }
                                    // setIsInitialized(true);
                                    // setIsLoading(false);
                                });
                                // });
                            }
                        }
                    }
                    // Если идентификатора нет
                    else {
                        // Если есть оригинал изображения
                        if (photo?.data) {
                            const url = convertBase64ToUrl(photo.data);
                            setSrcValue(url);
                        } else {
                            // Если есть предпросмотр изображения
                            if (photo?.thumbnail) {
                                const url = convertBase64ToUrl(photo.thumbnail);
                                setSrcValue(url);
                            }
                        }

                        // setIsInitialized(true);
                        // setIsLoading(false);
                    }
                }
            }
        } else {
            setSrcValue(undefined);
            // setIsInitialized(true);
            // setIsLoading(false);
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

    // if (isLoading && !isInitialized) {
    // if (!isInitialized) {
    //     return (
    //         <div
    //             style={{
    //                 ...wrapperPictureStyle(
    //                     borderWidth,
    //                     borderRadius,
    //                     {
    //                         width: pictureWidth,
    //                         height: pictureHeight,
    //                     },
    //                     shape,
    //                 ),
    //             }}
    //         >
    //             <Skeleton.Node
    //                 style={{
    //                     width: pictureWidth,
    //                     height: pictureHeight,
    //                 }}
    //                 active
    //             />
    //         </div>
    //     );
    // }

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

    // if (isInitialized && !isLoading) {
    // if (isInitialized) {
    return (
        <Flex align={"center"} justify={"center"} vertical gap={4}>
            {isEditable ? (
                <Upload
                    showUploadList={false}
                    beforeUpload={async (file) => {
                        // TODO Здесь можно проверять различные параметры файлов
                        const arrayBufferView = new Uint8Array(
                            await file.arrayBuffer(),
                        );
                        const blob = new Blob([arrayBufferView], {
                            type: file.type,
                        });
                        const urlCreator = window.URL || window.webkitURL;
                        const objUrl = urlCreator.createObjectURL(blob);

                        const base64 = await convertFileToBase64(file);

                        const newValue: PhotoEntity = {
                            id: "",
                            type: file.type,
                            size: file.size,
                            thumbnail: "",
                            extension: "", // TODO - getFileExtension
                            data: base64,
                            isDefault: false,
                        };

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
                // <Button type={"link"} danger onClick={onClear}>
                //     {"Удалить"}
                // </Button>
            )}
        </Flex>
    );
    // }

    // return null;
});
