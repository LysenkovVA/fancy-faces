import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log(`>>> Добавление данных в БД...`);

    await prisma.gender.createMany({
        data: [{ name: "Женский" }, { name: "Мужской" }],
    });

    await prisma.viewType.createMany({
        data: [{ name: "Анфас" }, { name: "Профиль" }],
    });

    console.log(`>>> БД создана!`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(
            `Неизвестная ошибка: ${error instanceof Error ? error.message : String(error)}`,
        );
        await prisma.$disconnect();
        process.exit(1);
    });
