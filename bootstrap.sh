#!/usr/bin/env bash
set -e

docker compose up -d --build

cp backend/.env.example backend/.env

docker compose exec -T php composer install
docker compose exec -T php php artisan key:generate
docker compose exec -T php php artisan migrate --force
docker compose exec -T php php artisan db:seed --force

cd frontend
rm -rf build
yarn
yarn build
cd ..

docker compose restart nginx
