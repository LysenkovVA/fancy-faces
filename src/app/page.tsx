"use client";

import { redirect } from "next/navigation";

export default function EntryPoint() {
    // Проверка авторизации и редирект
    redirect("/login");
}
