# Drawn - API Gateway

This API gateway is implemented by using Kong Gateway, open source API gateway, with some custom plugins.

## Dev Installation

- Build docker image of this gateway

```
docker build -t custom-gateway:1.0 .
```

- Create containers from docker compose config file

```
docker compose -f docker-compose-dev.yml up -d
```

- Import volume file to `api-gateway_kong_data`

## Production Installation

- Fill key and secret of JWT in `web_login_issuer` customer in `kong.yaml`
- Build docker image
```
docker build -t drawn-api-gateway .
```

- Create containers from docker compose config file

```
docker compose up -d
```

## Usage

- API entry point: port 8000
- Admin GUI: port 8002