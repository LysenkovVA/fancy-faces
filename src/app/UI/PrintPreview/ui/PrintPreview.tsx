"use client";

import { memo, useRef } from "react";
import { Button, Flex } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import styles from "./PrintPreview.module.css";
import { lorem } from "next/dist/client/components/react-dev-overlay/ui/utils/lorem";

export interface PrintPreviewProps {
    style?: React.CSSProperties;
    pageSize: "A4";
    children?: React.ReactNode;
}

export const PrintPreview = memo((props: PrintPreviewProps) => {
    const { style, pageSize, children } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        // bodyClass: styles,
        contentRef,
        documentTitle: "Test",
    });

    return (
        <Flex
            style={{ width: "100%" }}
            align={"center"}
            justify={"start"}
            gap={8}
            vertical
        >
            <Flex style={{ width: "100%" }} align={"center"} justify={"start"}>
                <Button
                    icon={<PrinterOutlined />}
                    onClick={() => reactToPrintFn()}
                >
                    {"Печать"}
                </Button>
            </Flex>
            <div
                style={{ ...styles, margin: 40, height: "100vh" }}
                // style={{
                //     width: "21cm",
                //     height: "29.7cm",
                //     padding: "1.5cm",
                //     // margin: "1cm auto",
                //     border: "1px #d3d3d3 solid",
                //     borderRadius: "5px",
                //     background: "white",
                //     boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                // }}
                ref={contentRef}
            >
                <div style={{ margin: 20 }}>
                    {lorem}
                    {lorem}
                </div>
                <div style={{ margin: 20 }}>{lorem}</div>
                {/*{children}*/}
            </div>
        </Flex>
    );
});
