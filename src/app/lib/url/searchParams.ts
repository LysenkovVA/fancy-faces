"use client";

/**
 * Функция добавления параметров строки запроса в URL
 * @param params
 * @deprecated Пока нигде не используется
 */
export async function addQueryParams(params: Record<string, string>) {
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([name, value]) => {
        if (value !== undefined) {
            searchParams.set(name, value);
        }
    });

    window.history.pushState(null, "", `?${searchParams.toString()}`);
}
