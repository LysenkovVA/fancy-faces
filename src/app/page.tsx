"use client";
import { GendersDropDownList } from "@/app/(private-routes)/(genders)";
import { ViewTypesDropDownList } from "@/app/(private-routes)/(view-types)";
import { Flex } from "antd";
import { AntropologicalTypesDropDownList } from "@/app/(private-routes)/(antropological-types)";
import { SubgroupsDropDownList } from "@/app/(private-routes)/(subgroups)";
import { Picture } from "@/app/UI/Picture";
import { useState } from "react";
import { PhotoEntity } from "@/app/(private-routes)/(photos)";

export default function Home() {
    const [pictureValue, setPictureValue] = useState<PhotoEntity | undefined>(
        undefined,
    );

    return (
        <Flex
            style={{ width: "100%" }}
            align={"center"}
            justify={"center"}
            vertical={true}
            gap={8}
        >
            <GendersDropDownList />
            <ViewTypesDropDownList />
            <AntropologicalTypesDropDownList />
            <SubgroupsDropDownList />
            <Picture
                shape={"picture"}
                value={pictureValue}
                pictureWidth={"auto"}
                pictureHeight={300}
                onChange={(value) => setPictureValue(value)}
                isEditable
                borderWidth={2}
            />
        </Flex>
    );
}
