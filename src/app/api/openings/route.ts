import { NextResponse } from "next/server";
import Database from "better-sqlite3";

// Подключаем базу данных
const db = new Database("src/data/chess_openings.db");

// Получение всех записей (GET) или поиск по FEN
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const fen = searchParams.get("fen");

        if (fen) {
            // Если передан FEN, ищем запись по нему
            const opening = db.prepare("SELECT * FROM Openings WHERE fen = ?").get(fen);
            if (!opening) {
                return NextResponse.json({ error: "Открытие не найдено" }, { status: 404 });
            }
            return NextResponse.json(opening, { status: 200 });
        }

        // Если FEN не передан, возвращаем все записи
        const openings = db.prepare("SELECT * FROM Openings").all();
        return NextResponse.json(openings, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Ошибка получения данных", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// Добавление новой записи (POST)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name_en, name_ru, parents, move, fen } = body;

        const stmt = db.prepare(
            "INSERT INTO Openings (name_en, name_ru, fen) VALUES (?, ?, ?)"
        );
        const info = stmt.run(name_en, name_ru, fen);
        return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Ошибка добавления записи", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// Обновление записи (PUT)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name_en, name_ru, parents, move, fen } = body;

        const stmt = db.prepare(
            "UPDATE Openings SET name_en = ?, name_ru = ?, fen = ? WHERE id = ?"
        );
        stmt.run(name_en, name_ru, fen, id);
        return NextResponse.json({ message: "Запись обновлена" }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Ошибка обновления", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// Удаление записи (DELETE)
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        const stmt = db.prepare("DELETE FROM Openings WHERE id = ?");
        stmt.run(id);
        return NextResponse.json({ message: "Запись удалена" }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Ошибка удаления", details: (error as Error).message },
            { status: 500 }
        );
    }
}