import { memo } from "react";
import { version } from "../../../../../package.json";
import { Tag } from "antd";
import { PRIMARY_VARIANT_COLOR } from "@/app/lib/themes/primary-theme";

export const Version = memo(() => {
    return process.env.NODE_ENV === "production" ? (
        <Tag color={PRIMARY_VARIANT_COLOR}>{`Версия ${version}`}</Tag>
    ) : (
        <Tag
            color={PRIMARY_VARIANT_COLOR}
        >{`Версия ${version} (${process.env.NODE_ENV})`}</Tag>
    );
});
