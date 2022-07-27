# Avrioc-Nest-app

A Nest aplication with Mongoose setup that serves RESTfull API to interact with films, add/update a review/comment.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes for consideration

- The phot string can be saved in film module, and stored in a bucket (Amazon S3, Google) to have a robust service.

## env file template

- mongodb uri contains the path to connect to mongodb database
- you can use any avialble port to run this api on your local
- add a difficult secret-key that will be used in jwt strategy to sign the token

```
e.g.
MONGODB_URI= mongodb+srv://<your-user>:<your-password>@my-cluster.bahwy.mongodb.net/<your-collection-name>?retryWrites=true&w=majority
PORT= 3000
SECRET_KEY= <your-secret-key>
```

## Swagger Open Specification API

Swagger specification can be found in this path `<PUBLIC-HOSTING-URL>/api/v1`, visit this to get more information of the restful API with detailed input, output, or respective error messages for each available path.

## Logger

The in-built nestjs logger is used to log important messages on each services logging all database actions and reporting respective errors (if any).This logger can be extended based on the requirement to get a more easy/configured way of handling the logs for specific logging features.

Note: Winston logger can also be used for logging with an npm pakcage called `nest-winston`, more details can be found here
`https://github.com/gremo/nest-winston`

## Status Code used

standard status codes are used throughout the development as a good practice and easy debugging along with globally configured log messages

| error-type| status-code | error message causes |
| success | 200 | success on searching a resource |
| BAD_REUEST | 400 | any forbiddon error or bad requests |
| UN_AUTHORIZE | 401 | unauthorized resource |
| FORBIDDEN | 403 | permission denied error |
| NOT_FOUND | 404 | resource not found |

## Data Seeder

### Run through script

To seed some exemplary data, mongo-seeding npm package is used. Tips to run the seed script on your local environment after cloning the repository:

- update your env file as per template
- place your data in `src/__seederData` or update the seeder-config file path in `src/seeder/index.js`. Or use the same data checked-in in the cloned repository
- run the command
  `yarn run seed`

Note: we can easily extend this service by adding appropriate package.json script, to seed/delete the data as per environment (dev, staging or production) when in production.

aidditonal information can be found here:

```
https://github.com/pkosiec/mongo-seeding/blob/main/docs/import-data-definition.md
https://github.com/pkosiec/mongo-seeding/tree/main/examples/import-data
```

### Run through cli

To run the seeder through mongo-seeding-cli, install the package globally and run the following command:

```
npx seed --replace-id --set-timestamps --db-name films src/\_\_seedData
```

In the above command, update the checks ---replace-id or --drop-database according to your need.

## testing

the testing library implementing jest with nestjs is pending.

## Migration

Basic migration setup is created to run migrations. it is necessary to write migrations to do any database change (alter table, or creation, deletion of table or indexes).
TODO: using migrations, create indexes on unique columns (id, name)

## opportunity to enhance the system

There are a couple of things that can be implemented to enhance the application before moving to production. Some of them are listed here:

- adding Delete methos to delete them for all modules
- handlign the change user password
- extending the email validations to allow a strict email address
- writing test cases

and some more...

- use migration to create indexes on unique columns (id, name, etc)
- extend logger service to use winston to enhance logging
- add global configured error status code and messages
- make use of dto and controller comment to reduce some swagger-api decorator
- add more functionality or extend the schema to have more details/columns of a collection
- replace the static country column into it's own separate module

## Contributing

New features and bugfixes are always welcome! In order to contribute to this project, follow a few easy steps:

- Fork this repository and clone it on your machine
- Open the local repository with Visual Studio Code with the remote development feature enabled (install the Remote Development extension)
- Create a branch my-awesome-feature and commit to it
- Run npm run lint, npm run test (to be implemented) and npm run build and verify that they complete without errors
- Push my-awesome-feature branch to GitHub and open a pull request

## Thank you for your time!
