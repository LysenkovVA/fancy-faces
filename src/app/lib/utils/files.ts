import { promises as fs } from "fs";
import path from "path";
import { Blob } from "buffer";
import { URL } from "url";

export async function readFileFromPath(filePath: string): Promise<string> {
    try {
        // Resolve the full path
        const fullPath = path.resolve(filePath);

        // Read the file
        const fileContents = await fs.readFile(fullPath, "utf8");

        return fileContents;
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
}

export async function readFileAndCreateURL(filePath: string): Promise<string> {
    try {
        // Resolve the full path
        const fullPath = path.resolve(filePath);

        // Read the file
        const fileBuffer = await fs.readFile(fullPath);

        // Determine the MIME type (you might want to use a more robust method)
        const mimeType = getMimeType(path.extname(fullPath));

        // Create a Blob
        const blob = new Blob([fileBuffer], { type: mimeType });

        // Create a URL
        const url = URL.createObjectURL(blob);

        return url;
    } catch (error) {
        console.error("Error reading file or creating URL:", error);
        throw error;
    }
}

// Helper function to determine MIME type
function getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
        ".txt": "text/plain",
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
        // Add more as needed
    };

    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}
