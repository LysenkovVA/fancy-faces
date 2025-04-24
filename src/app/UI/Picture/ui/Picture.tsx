"use client";

import {
    CSSProperties,
    memo,
    useCallback,
    useLayoutEffect,
    useState,
} from "react";
import { Button, Flex, Image, Skeleton, Upload } from "antd";
import noImage from "../assets/no-image.png";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";
import { PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

const BORDER_RADIUS = 12;

function wrapperPictureStyle(
    borderWidth: number,
    size: { width: number | string; height: number },
    shape: "picture" | "avatar",
): CSSProperties {
    return {
        border: `solid ${borderWidth}px ${PRIMARY_COLOR}`,
        borderRadius: shape === "picture" ? BORDER_RADIUS : "50%",
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
    shape: "picture" | "avatar",
): CSSProperties {
    return {
        borderRadius: shape === "picture" ? BORDER_RADIUS - borderWidth : "50%",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        lineHeight: 0,
    };
}

export interface PictureProps {
    value?: string | PhotoEntity;
    onChange?: (value?: PhotoEntity) => void;
    shape: "picture" | "avatar";
    pictureWidth?: number | string;
    pictureHeight?: number;
    picturePreview?: boolean;
    borderWidth?: number;
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
        value,
        onChange,
        shape = "picture",
        pictureWidth = 50,
        pictureHeight = 50,
        picturePreview = false,
        borderWidth = 2,
        isEditable = false,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [srcValue, setSrcValue] = useState<string | undefined>(undefined);

    useLayoutEffect(() => {
        if (value) {
            if (typeof value === "string") {
                setSrcValue(value);
                setIsInitialized(true);
                setIsLoading(false);
            } else {
                if (typeof value === "object") {
                    const photo = value as PhotoEntity;

                    if (photo && photo.data) {
                        const url = convertBase64ToUrl(photo.data);
                        setSrcValue(url);
                        setIsInitialized(true);
                        setIsLoading(false);
                    } else {
                        setIsInitialized(true);
                        setIsLoading(false);
                    }
                }
            }
        } else {
            setSrcValue(undefined);
            setIsInitialized(true);
            setIsLoading(false);
        }
    }, [value]);

    const onClear = useCallback(() => {
        setSrcValue(undefined);
        onChange?.(undefined);
    }, [onChange]);

    if (isLoading && !isInitialized) {
        return (
            <div
                style={wrapperPictureStyle(
                    borderWidth,
                    {
                        width: pictureWidth,
                        height: pictureHeight,
                    },
                    shape,
                )}
            >
                <Skeleton.Node
                    style={{
                        width: pictureWidth,
                        height: pictureHeight,
                    }}
                    active
                />
            </div>
        );
    }

    const pictureContent = () => {
        return (
            <div
                style={wrapperPictureStyle(
                    borderWidth,
                    {
                        width: pictureWidth,
                        height: pictureHeight,
                    },
                    shape,
                )}
            >
                <Image
                    wrapperStyle={{
                        width: pictureWidth,
                        height: pictureHeight,
                    }}
                    style={pictureStyle(borderWidth, shape)}
                    alt={shape}
                    fallback={noImage.src}
                    src={srcValue ?? noImage.src}
                    preview={picturePreview}
                />
            </div>
        );
    };

    if (isInitialized && !isLoading) {
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
                    <Button type={"link"} danger onClick={onClear}>
                        {"Удалить"}
                    </Button>
                )}
            </Flex>
        );
    }

    return null;
});
