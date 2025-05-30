"use client";

import React, { useMemo } from "react";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";
import { Carousel } from "antd";
import { Picture } from "@/app/UI/Picture";

export interface PicturesCarouselProps {
    pictureWidth: string | number | undefined;
    pictureHeight: number | undefined;
    entities: PhotoEntity[] | undefined;
    picturePreview?: boolean;
}

export const PicturesCarousel = (props: PicturesCarouselProps) => {
    const {
        pictureHeight = 50,
        pictureWidth = 50,
        entities,
        picturePreview = false,
    } = props;

    const content = useMemo(() => {
        return entities && entities.length > 0 ? (
            entities.map((entity) => (
                <Picture
                    key={entity.id}
                    shape={"picture"}
                    value={entity}
                    pictureWidth={pictureWidth}
                    pictureHeight={pictureHeight}
                    borderWidth={0}
                    picturePreview={picturePreview}
                />
            ))
        ) : (
            <Picture
                shape={"picture"}
                borderWidth={0}
                pictureWidth={pictureWidth}
                pictureHeight={pictureHeight}
            />
        );
    }, [entities, pictureHeight, picturePreview, pictureWidth]);

    return (
        <Carousel
            style={{
                width: pictureWidth,
                height: pictureHeight,
            }}
            dots={true}
        >
            {content}
        </Carousel>
    );
};
