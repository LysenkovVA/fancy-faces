import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log(`>>> Добавление данных в БД...`);

    const adminRole = await prisma.userRole.create({
        data: {
            name: "ADMIN",
        },
    });

    const userRole = await prisma.userRole.create({
        data: {
            name: "USER",
        },
    });

    await prisma.user.createMany({
        data: [
            {
                login: "admin",
                hashedPassword: bcrypt.hashSync("111", 10),
                surname: "Лысенков",
                name: "Виктор",
                patronymic: "Андреевич",
                userRoleId: adminRole.id,
            },
            {
                login: "vlada",
                hashedPassword: bcrypt.hashSync("111", 10),
                surname: "Белогорцева",
                name: "Влада",
                patronymic: "Владимировна",
                userRoleId: userRole.id,
            },
            {
                login: "tanya",
                hashedPassword: bcrypt.hashSync("111", 10),
                surname: "Овдиенко",
                name: "Татьяна",
                patronymic: "Васильевна",
                userRoleId: userRole.id,
            },
        ],
    });

    await prisma.gender.createMany({
        data: [{ name: "Женский" }, { name: "Мужской" }],
    });

    await prisma.viewType.createMany({
        data: [{ name: "Анфас" }, { name: "Профиль" }],
    });

    await prisma.antropologicalType.createMany({
        data: [
            { name: "Европеойд" },
            { name: "Негройд" },
            { name: "Монголойд" },
        ],
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
