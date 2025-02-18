# Chess.skibidi
Course cork for programming collage.

## 🛜 API

All api code is located at `src/app/api` and runs automaticly with `npm run dev`

### Endpoints
- `POST /api/auth/login` - login
- `POST api/auth/register` - registration
- `POST /api/auth/logout` - logout from current account

- `GET api/chat/messages` - get all messages
- `POST api/chat/send` - send a message

- `GET /api/openings` - get all chess openings
- `GET /api/openings?fen=<FEN>` - search for chess opening name by fen
- `POST /api/openings` - create new chess openings

**body**
```json
{
  "name_en": "Ruy-Lopez",
  "name_ru": "Испанская партия",
  "fen": "rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1"
}
```
- `PUT /api/openings` - update chess opening

**body**
```json
{
  "id": 3,
  "name_en": "Updated Name",
  "name_ru": "Обновлённое имя",
  "fen": "rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1"
}
```

- `DELETE /api/openings` - delete opening

**body**
```json
{
  "id": 3
}
```

## 📄 Data

### ♟️ Chess Openings

![ERD](public/readme/erd_openings.drawio.png)

Original database (`src/data/chess_openings_backup`) is the smallest and the easiest. It contains only `Openings` table.

If you need to build a tree of openings you need to generate links between positions. So run `npm run generate-links` to do so. It will run [generateLinks.ts](src/scripts/generateLinks.ts) and add an extra table `position_links` to the database

### 👨 Users

![ERD](public/readme/erd_users.drawio.png)
