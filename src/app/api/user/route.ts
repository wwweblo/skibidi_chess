import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userLogin = searchParams.get("userLogin");

        if (!userLogin) {
            return NextResponse.json({ error: "Не указан userLogin" }, { status: 400 });
        }

        // Получаем последних собеседников
        const lastMessages = await prisma.message.findMany({
            where: {
                chat: {
                    messages: {
                        some: {
                            userLogin
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            distinct: ["userLogin"],
            select: {
                userLogin: true,
                createdAt: true
            }
        });

        // Сортируем пользователей по последнему времени сообщения
        lastMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const sortedUserLogins = lastMessages.map(msg => msg.userLogin);

        // Получаем пользователей по этим логинам
        const users = await prisma.user.findMany({
            where: {
                login: {
                    in: sortedUserLogins
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Ошибка загрузки пользователей", details: (error as Error).message },
            { status: 500 }
        );
    }
}
