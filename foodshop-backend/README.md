# Food Shop Ordering Backend (Spring Boot)

## Quick start
1. Create MySQL database `foodshop` and update credentials in `src/main/resources/application.yml`.
2. Build & run:
   ```bash
   mvn clean spring-boot:run
   ```
3. Endpoints:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/menu` (public read)
   - `POST /api/admin/menu` (ADMIN)
   - `PUT /api/admin/menu/{id}` (ADMIN)
   - `DELETE /api/admin/menu/{id}` (ADMIN)
   - `POST /api/orders` (CUSTOMER)
   - `GET /api/orders/me` (CUSTOMER)
   - `GET /api/admin/orders?status=PENDING` (ADMIN)
   - `PUT /api/admin/orders/{id}/status?status=READY` (ADMIN)

## Notes
- Use the JWT from `/api/auth/login` as `Authorization: Bearer <token>` for protected endpoints.
- Default role for register is `CUSTOMER`. Seed an `ADMIN` by updating the user role in DB.
- Replace `app.security.jwt-secret` with a long random string in production.
