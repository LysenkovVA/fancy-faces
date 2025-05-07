"use client";

import React, { memo, ReactNode } from "react";
import { Layout } from "antd";
import {
    Content,
    Footer as AntFooter,
    Header as AntHeader,
} from "antd/es/layout/layout";
import {
    CONTENT_HEIGHT,
    CONTENT_PADDING_BOTTOM,
    CONTENT_PADDING_LEFT,
    CONTENT_PADDING_RIGHT,
    CONTENT_PADDING_TOP,
    CONTENT_WIDTH,
    FOOTER_HEIGHT,
    FOOTER_WIDTH,
    HEADER_HEIGHT,
    HEADER_WIDTH,
} from "../../config/consts";
import { Header } from "@/app/UI/AppLayout/ui/Header";
import { Footer } from "@/app/UI/AppLayout/ui/Footer/Footer";
import { BACKGROUND_COLOR } from "@/app/lib/themes/primary-theme";

export interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = memo(({ children }: AppLayoutProps) => {
    return (
        <Layout
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <AntHeader
                style={{
                    width: HEADER_WIDTH,
                    height: HEADER_HEIGHT,
                    background: BACKGROUND_COLOR,
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                }}
            >
                <Header />
            </AntHeader>
            <Content
                style={{
                    width: CONTENT_WIDTH,
                    height: CONTENT_HEIGHT,
                    paddingTop: CONTENT_PADDING_TOP,
                    paddingBottom: CONTENT_PADDING_BOTTOM,
                    paddingLeft: CONTENT_PADDING_LEFT,
                    paddingRight: CONTENT_PADDING_RIGHT,
                }}
            >
                {children}
            </Content>
            <AntFooter
                style={{
                    width: FOOTER_WIDTH,
                    height: FOOTER_HEIGHT,
                    background: BACKGROUND_COLOR,
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                }}
            >
                <Footer />
            </AntFooter>
        </Layout>
    );
});
