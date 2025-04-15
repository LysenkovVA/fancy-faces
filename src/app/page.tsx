import { GendersDropDownList } from "@/app/(private-routes)/(genders)";
import { ViewTypesDropDownList } from "@/app/(private-routes)/(view-types)";
import { Flex } from "antd";
import { AntropologicalTypesDropDownList } from "@/app/(private-routes)/(antropological-types)";
import { SubgroupsDropDownList } from "@/app/(private-routes)/(subgroups)";

export default function Home() {
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
        </Flex>
    );
}
