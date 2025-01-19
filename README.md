### Setup

```
pnpm install
```

### Run

Copy .env.example to .env and fill in the values
`cp .env.example .env`

Dev
`docker-compose -f docker-compose.dev.yml up -d`

Prod: 
`docker-compose up -d`


Clean up mikro and migrations
```
rm -rf src/migrations/ && rm -rf temp/ && npx mikro-orm migration:create && npx mikro-orm migration:up  
```