# tomisha-mvp-backend

### Prerequisites
Must be installed:
- [Docker](https://www.docker.com/get-started) (v20.10.11 and higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.2.1 and higher)
- [Git](https://git-scm.com/downloads) (v2.32.0 and higher)
- [Node.js](https://nodejs.org/en/download/) (v14.17.4 and higher)
- npm (v6.14.14 and higher, comes with Node.js)

### Tech stack
- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/#/)
- [PostgreSQL](https://www.postgresql.org/) as the Docker image
- [Redis](https://redis.io/) as the Docker image

### Installation
1. Clone the repository: `git clone https://gitlab.com/tomisha/quang-tomisha-mvp-backend.git`
2. Change directory to the cloned repository: `cd quang-tomisha-mvp-backend`
3. Install dependencies: `npm i`
4. Build and run the Docker container: `npm run composer`
5. Run migrations and seeds: `npm run typeorm migration:run`
6. Run the app: `npm run dev`

**Shortcut:**
```
git clone https://gitlab.com/tomisha/quang-tomisha-mvp-backend.git && cd quang-tomisha-mvp-backend && npm i && npm run composer && npm run typeorm migration:run && npm run dev
```
---
### Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Installation

```bash
npm install
```

### Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
---
### Git
```bash
# Update
git pull

# Add all
git add -A

# Comment
git commit -m "Commit-Nachricht"

# push
git push
```