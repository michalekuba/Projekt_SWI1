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

## Fakturační údaje

- `PUT /api/users/{userId}/profile` body: `{ "firstName": "Jan", "lastName": "Novák", "street": "Ulice 1", "city": "Praha", "postalCode": "11000", "email": "jan@example.com", "phone": "+420777000111" }`

## Objednávky API (MVP)

- `POST /api/orders/{userId}/from-cart` body: `{ "useProfile": true, "shippingMethod": "ZASILKOVNA" }` nebo `{ "useProfile": false, "firstName": "...", "lastName": "...", "street": "...", "city": "...", "postalCode": "...", "email": "...", "phone": "...", "shippingMethod": "ZASILKOVNA" }`
- `GET /api/orders/{userId}`
- `GET /api/orders/admin/{adminUserId}`
- `PATCH /api/orders/admin/{adminUserId}/{orderId}/status` body: `{ "status": "SHIPPED" }`
