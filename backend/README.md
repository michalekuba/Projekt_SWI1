# Backend

Minimalni poznamky k backendu.

## Spusteni

- Spring Boot app v `BackendApplication.java`
- MariaDB nastaveni v `src/main/resources/application.properties`

## Kosik API (MVP)

- `GET /api/cart/{userId}`
- `POST /api/cart/{userId}/items` body: `{ "productId": 1, "quantity": 1 }`
- `PATCH /api/cart/{userId}/items/{itemId}` body: `{ "quantity": 2 }`
- `DELETE /api/cart/{userId}/items/{itemId}`

