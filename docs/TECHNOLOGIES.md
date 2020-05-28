# Technologies

## Server
* NodeJS with [TypeScript](https://www.typescriptlang.org/) and [Express](http://expressjs.com/). [TypeOrm](http://expressjs.com/) for the database connection, [MariaDB](https://mariadb.org/) for the database.
* Shared classes with the frontend using [RedundancyJS](https://github.com/hrueger/redundancyjs), as Angular can't handle TypeORM's decorators.
* Deployed using docker (using [containerizer](https://github.com/hrueger/containerizer/))


## Frontend
* Shared [Angular](https://angular.io/) app with [NativeScript](https://www.nativescript.org/) and [Electron](https://www.electronjs.org/).
* Push messages using [FCM](https://firebase.google.com/docs/cloud-messaging) and a [custom relay server](https://github.com/SchoolSquirrel/SquirrelFcmRelay).
* [NG Bootstrap](https://ng-bootstrap.github.io/#/home)
* CSS Styled scrollbars https://css-tricks.com/custom-scrollbars-in-webkit/
* [Syncfusion Angular Scheduler](https://www.syncfusion.com/angular-ui-components/angular-scheduler)


# Video Conferencing
Not sure yet ;-) see comparison below
| Library                                                   | Pros                                                              | Cons                                                 |
|-----------------------------------------------------------|-------------------------------------------------------------------|------------------------------------------------------|
| [OpenVidu](https://openvidu.io)                           | <ul><li>Easy api</li> <li>great UI samples</li></ul>              | <ul><li>TURN Server needed</li></ul>                 |
| [Jitsi](https://jitsi.org)                                | <ul><li>Wide adoption</li></ul>                                   | <ul><li>Implementation may be complicated</li></ul>  |
| [RtcMulticonnection](https://www.rtcmulticonnection.org/) | <ul><li>Peer2Peer</li> <li>No server ressources needed</li></ul>  | <ul><li>Reliability (?)</li></ul>                    |
| Pure WebRTC                                               | <ul><li>Peer2Peer</li> <li>Customizability</li></ul>              | <ul><li>Work</li></ul>                               |

# Online Office
| Software       | Pros                                                                                           | Cons                                                 |
|----------------|------------------------------------------------------------------------------------------------|------------------------------------------------------|
| Onlyoffice     | <ul><li>many Features</li><li>good MS Compatibility</li><li>fairly easy to implement</li></ul> | <ul><li>from questionable Company</li></ul>          |
| Collabora CODE | <ul><li>good enough Features</li><li>Open Source Spirit :)</li></ul>                           | <ul><li>not as many Features as Onlyoffice</li></ul> |

## Miscellaneous

* Changelogs with [ChangelogJS](https://github.com/hrueger/changelogjs), deploed to the GitHub pages site.
* Automatic builds with GitHub Actions.
