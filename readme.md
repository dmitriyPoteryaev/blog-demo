# Blog Demo — Test Task (Laravel API + React Frontend)

Тестовое задание: SPA-приложение «Блог» с авторизацией, статьями и комментариями.

Проект реализован как **разделённая архитектура**:
- Backend — Laravel (API + Sanctum, миграции, сидеры)
- Frontend — React + TypeScript (UI)

Связь frontend ↔ backend осуществляется по HTTP.  
Frontend **НЕ встраивается в Laravel** и **НЕ использует Vite / Blade / asset pipeline Laravel**.

---

## Резюме

https://hh.ru/resume/57c4d90cff0fadcf5c0039ed1f6e6b72734536

---

## Репозиторий

```bash
git clone <repo>
cd <repo>

docker compose up -d --build

docker compose exec php composer install
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate
docker compose exec php php artisan db:seed


## После успешного выполнения смотреть в браузере
http://localhost:8090
