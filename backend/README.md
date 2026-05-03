# Backend

Minimální poznámky k backendu.

## Spuštění

- Spring Boot app v `BackendApplication.java`
- MariaDB nastavení v `src/main/resources/application.properties`

## Košík API (MVP)

- `GET /api/cart/{userId}`
- `POST /api/cart/{userId}/items` body: `{ "productId": 1, "quantity": 1 }`
- `PATCH /api/cart/{userId}/items/{itemId}` body: `{ "quantity": 2 }`
- `DELETE /api/cart/{userId}/items/{itemId}`
