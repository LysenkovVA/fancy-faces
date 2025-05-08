import sharp from "sharp";

export class ServerFiles {
    static async resizeBase64Image(width: number, base64: string) {
        try {
            const buffer = new Buffer(base64, "base64");

            if (!buffer) {
                return base64;
            }

            const resizedBuffer = await sharp(buffer)
                .resize({ width })
                .blur()
                .toBuffer();

            if (!resizedBuffer) {
                return "";
            }

            return resizedBuffer.toString("base64");
        } catch (error) {
            console.log("Error while resizing file", JSON.stringify(error));
            throw error;
        }
    }
}
