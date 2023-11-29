Запуск сервисов docker-контейнерами

Для работы приложения необходимо поднять контейнеры с базой данных с помощью docker-compose. Для этого можно воспользоваться файлом, расположенном по пути `.docker/docker-compose-infra.yml`

Команда для запуска контейнеров с сервисами:

```bash
$ docker-compose -f ./.docker/docker-compose-infra.yml up -d
```

Может понадобиться создать `localhost` сеть командой:

```bash
$ docker network create localhost
```