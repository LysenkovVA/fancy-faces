export enum ConsoleColor {
    Red = "\u001b[1;31m",
    Green = "\u001b[1;32m",
    Yellow = "\u001b[1;33m",
    Blue = "\u001b[1;34m",
    Purple = "\u001b[1;35m",
    Cyan = "\u001b[1;36m",
    Default = "\u001b[0m",
}

export const ConsoleLog = (
    message: string,
    color: ConsoleColor = ConsoleColor.Green,
) => {
    console.log(`${color}${message}${ConsoleColor.Default}`);
};

export class Console {
    _message: string;

    constructor(message: string) {
        this._message = message;
    }

    static Log(message: string) {
        ConsoleLog(message, ConsoleColor.Blue);
    }

    static Error(message: string) {
        ConsoleLog(message, ConsoleColor.Red);
    }

    static Warning(message: string) {
        ConsoleLog(message, ConsoleColor.Yellow);
    }

    static Success(message: string) {
        ConsoleLog(message, ConsoleColor.Green);
    }
}
