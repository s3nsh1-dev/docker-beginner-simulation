### How i am running the docker Image

case 1: running the server as it is but running the client build as docker container and it working.
COMMANDS:
docker build -t todo-client:lab ./client
docker run --rm --name todo-client-lab -p 3000:3000 todo-client:lab
docker stop todo-client-lab

case 2: Server is running in terminal but this time the todo-client-lab is running via docker-compose.yml
COMMANDS:
docker compose -f labA-docker-compose.yml up
docker compose -f labA-docker-compose.yml down

case 3: Client is running in terminal (or stopped) and server runs as a standalone docker container
COMMANDS:
docker build -t todo-server:lab ./server
docker run --rm --name todo-server-lab -p 5000:5000 --env-file ./server/.env -e PORT=5000 todo-server:lab
docker stop todo-server-lab

case 4: Server runs via isolated docker-compose
COMMANDS:
docker compose -f labB-docker-compose.yml up
docker compose -f labB-docker-compose.yml down

case 5: Full Stack Orchestration (Client + Server both running in containers)
COMMANDS:
docker compose up --build
docker compose down

Case 6: When testing the app without touching the NEON db but postgres-alpine image. -v is to scrap old and use new volume every time
COMMANDS:
docker compose -f docker-compose.test.yml up -d --wait
docker compose -f docker-compose.test.yml down -v
