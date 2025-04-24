import { memo } from "react";
import { version } from "../../../../../package.json";
import { Tag } from "antd";
import { PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

export const Version = memo(() => {
    return process.env.NODE_ENV === "production" ? (
        <Tag color={PRIMARY_COLOR}>{`Версия ${version}`}</Tag>
    ) : (
        <Tag
            color={"warning"}
        >{`Версия ${version} (${process.env.NODE_ENV})`}</Tag>
    );
});
