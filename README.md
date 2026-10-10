### How i am running the docker Image

case 1: running the server as it is but running the client build as docker container and it working.
COMMANDS:
docker build -t todo-client:lab ./client
docker run --rm --name todo-client-lab -p 3000:80 todo-client:lab
docker stop todo-client-lab

case 2: Server is running in terminal but this time the todo-client-lab is running via docker-compose.yml
COMMANDS:
docker compose -f labA-docker-compose.yml up
docker compose -f labA-docker-compose.yml down
