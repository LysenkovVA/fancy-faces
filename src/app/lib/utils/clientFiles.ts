"use client";

import { PhotoEntity } from "@/app/(private-routes)/(photos)";

/**
 * Класс для работы с файлами на стороне клиента
 */
export class ClientFiles {
    /**
     * Конвертирование файла в Base64
     * @param file
     */
    static async convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,")
                // We can either keep it or remove it based on your needs
                const base64String = reader.result as string;
                const base64WithoutPrefix = base64String.split(",")[1];
                resolve(base64WithoutPrefix);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    /**
     * Конвертирование Base64 в URL
     * @param base64String
     * @param mimeType
     */
    static convertBase64ToUrl(
        base64String: string,
        mimeType = "image/jpeg",
    ): string {
        // Create a data URL from the base64 string
        return `data:${mimeType};base64,${base64String}`;
    }

    static getExtension(fileName: string) {
        if (fileName.includes(".")) return fileName.split(".").pop();

        return "";
    }

    /**
     * Конвертирование файла в PhotoEntity
     * @param file
     */
    static async convertFileToPhotoEntity(file: File): Promise<PhotoEntity> {
        const base64 = await this.convertFileToBase64(file);

        return {
            id: "",
            type: file.type,
            size: file.size,
            extension: file.name.includes(".")
                ? (file.name.split(".").pop() ?? "")
                : "",
            thumbnail: "", // В этом поле нет смысла, т.к. поле data существует
            data: base64,
            isDefault: false,
        } as PhotoEntity;
    }
}
