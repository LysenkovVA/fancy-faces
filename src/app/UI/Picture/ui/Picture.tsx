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

function wrapperPictureStyle(
    borderWidth: number,
    size: { width: number | string; height: number },
    shape: "picture" | "avatar",
): CSSProperties {
    return {
        border: `solid ${borderWidth}px darkgray`,
        borderRadius: shape === "picture" ? 12 : "50%",
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

function pictureStyle(shape: "picture" | "avatar"): CSSProperties {
    return {
        borderRadius: shape === "picture" ? 12 : "50%",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        lineHeight: 0,
    };
}

export interface PictureProps {
    value?: string;
    onChange?: (value?: string) => void;
    shape: "picture" | "avatar";
    pictureWidth?: number | string;
    pictureHeight?: number;
    picturePreview?: boolean;
    borderWidth?: number;
    isEditable?: boolean;
}

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
            setSrcValue(value);
            setIsLoading(false);
            setIsInitialized(true);
            return;
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
                    style={pictureStyle(shape)}
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

                            // const newValue = {
                            //     // ...value,
                            //     fileUrl: objUrl,
                            // } as FileEntity;

                            setSrcValue(objUrl);
                            onChange?.(objUrl);

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
