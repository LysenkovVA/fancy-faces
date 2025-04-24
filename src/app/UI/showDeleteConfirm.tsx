import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { Modal } from "antd";

const { confirm } = Modal;

export function showDeleteConfirm(
    title: string,
    description: string,
    okCallback: ((...args: any[]) => any) | undefined,
) {
    if (!confirm) {
        alert("No modal!");
    }

    confirm({
        title: title,
        icon: <DeleteOutlined style={{ color: "red" }} />,
        content: description,
        okText: "Да",
        okType: "danger",
        cancelText: "Нет",
        onOk() {
            okCallback?.();
        },
        onCancel() {
            // Нет колбэка
        },
    });
}
