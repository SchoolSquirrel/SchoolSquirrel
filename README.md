# SchoolSquirrel
[![Available on Docker Hub](https://img.shields.io/badge/available_on-Docker_Hub-blue?logo=docker)](https://hub.docker.com/repository/docker/schoolsquirrel/schoolsquirrel)
[![Production build](https://github.com/SchoolSquirrel/SchoolSquirrel/workflows/Build/badge.svg)](https://github.com/SchoolSquirrel/SchoolSquirrel/actions)
[![Lint](https://github.com/SchoolSquirrel/SchoolSquirrel/workflows/Lint/badge.svg)](https://github.com/SchoolSquirrel/SchoolSquirrel/actions)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE.md)
[![GitHub last commit](https://img.shields.io/github/last-commit/SchoolSquirrel/SchoolSquirrel?color=brightgreen)](https://github.com/SchoolSquirrel/SchoolSquirrel/commits)
[![Maintenance](https://img.shields.io/maintenance/yes/2021)](https://github.com/SchoolSquirrel/SchoolSquirrel/commits)

The main repo for SchoolSquirrel

## Development

### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Angular CLI](https://cli.angular.io/)

For the mobile app:
- [NativeScript](https://docs.nativescript.org/angular/start/quick-setup#step-1-install-nodejs-and-nativescript-cli)

### API
1. Create a MySQL Database
2. `npm i` and then `npm start` in `api` folder
3. Insert DB credentials in `/app/config/config.json`
4. Restart api (Ctrl+C and `npm start`)

### Frontend Web
1. `npm i` and `ng serve` in `SchoolSquirrel` folder
2. Open browser to [http://localhost:4200](http://localhost:4200)
3. The domain for the login is `http://localhost:3000`

### Frontend Mobile
`npm i` and `npm run mobile:android:run` in `SchoolSquirrel` folder

### Frontend Desktop
`npm i` and `npm run web:run` in `SchoolSquirrel` folder, then `npm run desktop:run` in a second terminal

### Docs
`pip install mkdocs-material mkdocs-exclude` and `mkdocs serve` in `docs` folder

## Build / Deploy
> all done automatically using [GitHub Actions](.github/workflows)

### Docker Container
`sudo bash ./build.sh` in `docker` folder (works only on linux!)

### API
`npm run build` in `api` folder

### Frontend Web
`npm run web:build` in `SchoolSquirrel` folder

### Frontend Mobile
`npm run mobile:android:build` in `SchoolSquirrel` folder

### Frontend Desktop
`npm run desktop:build` in `SchoolSquirrel` folder

### Docs
`mkdocs build` in `docs` folder

## Linting
### API
`npm run lint` in `api` folder

### Frontend (Web, Mobile & Desktop)
`npm run lint` in `SchoolSquirrel` folder

## License
MIT
