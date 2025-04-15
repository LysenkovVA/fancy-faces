"use client";

type HeaderMenuItem = {
    key: string;
    label: string;
    routePath: string;
};

type Route =
    | "DASHBOARD"
    | "CERTIFICATES"
    | "EMPLOYEES"
    | "DEPARTMENTS"
    | "CONSTRUCTION_OBJECTS"
    | "INSPECTIONS";

export const headerItems: Record<Route, HeaderMenuItem> = {
    DASHBOARD: { key: "0", label: "Главная", routePath: "/dashboard" },
    INSPECTIONS: {
        key: "1",
        label: "Проверки",
        routePath: "/inspections",
    },
    CERTIFICATES: {
        key: "2",
        label: "Удостоверения",
        routePath: "/certificates",
    },
    EMPLOYEES: { key: "3", label: "Сотрудники", routePath: "/employees" },
    DEPARTMENTS: {
        key: "4",
        label: "Подразделения",
        routePath: "/departments",
    },
    CONSTRUCTION_OBJECTS: {
        key: "5",
        label: "Объекты",
        routePath: "/construction-objects",
    },
};
