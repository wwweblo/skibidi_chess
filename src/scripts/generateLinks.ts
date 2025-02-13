const Database = require('better-sqlite3');
const { Chess } = require('chess.js');

const DB_PATH = 'src/data/chess_openings.db';
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

// Создаем таблицу, если её нет
function createLinksTable(): void {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS position_links (
            parent_id INTEGER,
            child_id INTEGER,
            move TEXT,
            PRIMARY KEY (parent_id, child_id),
            FOREIGN KEY (parent_id) REFERENCES Openings(id),
            FOREIGN KEY (child_id) REFERENCES Openings(id)
        )
    `).run();
    console.log("Таблица position_links проверена/создана.");
}

type Position = {
    id: number;
    fen: string;
};

function getPositions(): Position[] {
    return db.prepare("SELECT id, fen FROM Openings").all() as Position[];
}

function getLinkedPositions(parentId: number): Set<number> {
    const rows = db.prepare("SELECT child_id FROM position_links WHERE parent_id = ?").all(parentId) as { child_id: number }[];
    return new Set(rows.map(row => row.child_id));
}

function getPositionId(fen: string): number | null {
    const result = db.prepare("SELECT id FROM Openings WHERE fen = ?").get(fen) as { id: number } | undefined;
    return result ? result.id : null;
}

function insertPositionLink(parentId: number, childId: number, move: string): void {
    db.prepare("INSERT OR IGNORE INTO position_links (parent_id, child_id, move) VALUES (?, ?, ?)")
        .run(parentId, childId, move);
}

function checkAndGenerateLinks(): void {
    createLinksTable(); // Убедимся, что таблица существует
    const positions = getPositions();

    for (const position of positions) {
        const { id, fen } = position;
        const linkedIds = getLinkedPositions(id);

        const chess = new Chess(fen);
        for (const move of chess.moves()) {
            chess.move(move);
            const newFen = chess.fen();
            const childId = getPositionId(newFen);
            if (childId && !linkedIds.has(childId)) {
                insertPositionLink(id, childId, move);
                console.log(`Связь добавлена: ${id} -> ${childId} (${move})`);
            }
            chess.undo();
        }
    }

    console.log("Обновление связей завершено.");
}

checkAndGenerateLinks();
