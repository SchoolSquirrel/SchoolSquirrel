# Technologies

## Server
* NodeJS with [TypeScript](https://www.typescriptlang.org/) and [Express](http://expressjs.com/). [TypeOrm](http://expressjs.com/) for the database connection, [MariaDB](https://mariadb.org/) for the database.
* Shared classes with the frontend using [RedundancyJS](https://github.com/hrueger/redundancyjs), as Angular can't handle TypeORM's decorators.
* Deployed using docker and maybe [containerizer](https://github.com/hrueger/containerizer/).


## Frontend
* Shared [Angular](https://angular.io/) app with [NativeScript](https://www.nativescript.org/) and [Electron](https://www.electronjs.org/).
* Push messages using [FCM](https://firebase.google.com/docs/cloud-messaging) and a [custom relay server](https://github.com/SchoolSquirrel/SquirrelFcmRelay).


## Miscellaneous

* Changelogs with [ChangelogJS](https://github.com/hrueger/changelogjs), deploed to the GitHub pages site.
* Automatic builds with GitHub Actions.