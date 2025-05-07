import { ThemeConfig } from "antd";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";

// Header/Footer
export const PRIMARY_COLOR = "#CCCCCC";
// Границы Header/Footer
export const PRIMARY_VARIANT_COLOR = "#757575";
// Кнопки
export const SECONDARY_COLOR = "#CCCCCC";
// Границы, цвет под указаетелем мыши
export const SECONDARY_VARIANT_COLOR = "#757575";
// Фон
export const BACKGROUND_COLOR = "#f9f9fb";
// Фон контролов
export const SURFACE_COLOR = "#FFFFFF";
export const ERROR_COLOR = "#B00020";
export const WARNING_COLOR = "#c88240";
export const SUCCESS_COLOR = "#43ae3b";
// Текст Header/Footer
export const ON_PRIMARY_COLOR = "#000000";
// Альтернативный текст Header/Footer
export const ON_SECONDARY_COLOR = "#000000";
// Текст на фоне
export const ON_BACKGROUND_COLOR = "#000000";
// Текст на фоне контролов
export const ON_SURFACE_COLOR = "#000000";
export const ON_ERROR_COLOR = "#FFFFFF";

export const BOX_SHADOW_WIDTH = 5;
export const BOX_SHADOW = `0px 0px ${BOX_SHADOW_WIDTH}px ${PRIMARY_VARIANT_COLOR}`;

export const primaryTheme: ThemeConfig = {
    token: {},
    components: {
        Layout: {
            // Component token
            bodyBg: BACKGROUND_COLOR,
            footerBg: PRIMARY_COLOR,
            footerPadding: "24px 50px",
            headerBg: PRIMARY_COLOR,
            headerColor: ON_PRIMARY_COLOR,
            headerHeight: HEADER_HEIGHT,
            headerPadding: "0 50px",
            lightSiderBg: "#ffffff",
            lightTriggerBg: "#ffffff",
            lightTriggerColor: "rgba(0,0,0,0.88)",
            siderBg: "#001529",
            triggerBg: "#002140",
            triggerColor: "#fff",
            triggerHeight: 48,
            zeroTriggerHeight: 40,
            zeroTriggerWidth: 40,
            // Global token
            colorText: ON_PRIMARY_COLOR,
            fontSize: 14,
        },
        Button: {
            // Primary
            primaryColor: ON_SECONDARY_COLOR,
            colorPrimary: SECONDARY_COLOR,
            colorPrimaryHover: SECONDARY_VARIANT_COLOR,
            defaultBorderColor: SECONDARY_VARIANT_COLOR,
            defaultActiveBorderColor: SECONDARY_VARIANT_COLOR,
            defaultActiveColor: SECONDARY_VARIANT_COLOR,
            // defaultShadow: `0px 0px 1px 1px ${SECONDARY_VARIANT_COLOR}`,
            // primaryShadow: `0px 0px 1px 1px ${SECONDARY_VARIANT_COLOR}`,
            // Global token
        },
        FloatButton: {
            // Primary
            colorPrimary: SECONDARY_COLOR,
            colorPrimaryHover: SECONDARY_VARIANT_COLOR,
            colorBgElevated: SECONDARY_VARIANT_COLOR,
        },
        Card: {
            // Component token
            actionsBg: SURFACE_COLOR,
            actionsLiMargin: "12px 0",
            bodyPadding: 24,
            bodyPaddingSM: 12,
            extraColor: ON_SURFACE_COLOR,
            headerBg: SURFACE_COLOR,
            headerFontSize: 16,
            headerFontSizeSM: 14,
            headerHeight: 56,
            headerHeightSM: 38,
            headerPadding: 24,
            headerPaddingSM: 12,
            tabsMarginBottom: -17,
            // Global token
            colorBorderSecondary: PRIMARY_COLOR,
        },
        Tabs: {
            cardBg: PRIMARY_COLOR,
            cardGutter: 10,
            cardHeight: 40,
            cardPadding: "8px 16px",
            cardPaddingLG: "8px 16px 6px",
            cardPaddingSM: "6px 16px",
            horizontalItemGutter: 32,
            // horizontalItemMargin
            // horizontalItemMarginRTL
            horizontalItemPadding: "12px 0",
            horizontalItemPaddingLG: "16px 0",
            horizontalItemPaddingSM: "8px 0",
            horizontalMargin: "0 0 16px 0",
            inkBarColor: "#1677ff", // Color of indicator
            itemActiveColor: "#0958d9", // Text color of active tab
            itemColor: "rgba(0,0,0,0.88)", // Text color of tab
            itemHoverColor: "#4096ff", // Text color of hover tab
            itemSelectedColor: "#1677ff", // Text color of selected tab
            titleFontSize: 14,
            titleFontSizeLG: 16,
            titleFontSizeSM: 14,
            verticalItemMargin: "16px 0 0 0",
            verticalItemPadding: "8px 24px",
            zIndexPopup: 1050,
            // Global token
            colorBorder: PRIMARY_COLOR,
            colorBorderSecondary: PRIMARY_VARIANT_COLOR,
        },
        Input: {
            // Component token
            activeBorderColor: SECONDARY_COLOR,
            hoverBorderColor: SECONDARY_VARIANT_COLOR,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
            // boxShadow: `0px 1px 5px ${PRIMARY_VARIANT_COLOR}`,
        },
        DatePicker: {
            // Component token
            activeBorderColor: SECONDARY_COLOR,
            hoverBorderColor: SECONDARY_VARIANT_COLOR,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Select: {
            // Component token
            activeBorderColor: SECONDARY_COLOR,
            hoverBorderColor: SECONDARY_VARIANT_COLOR,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Tree: {
            // Component token
            indentSize: 24,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Collapse: {
            contentPadding: "8px 8px",
            headerBg: SURFACE_COLOR,
            headerPadding: "12px 8px",
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Carousel: {
            dotOffset: -8,
            colorBgContainer: PRIMARY_VARIANT_COLOR,
        },
    },
};
