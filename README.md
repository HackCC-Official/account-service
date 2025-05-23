# HackCC 2025's Account Service

## Overview

The main Account Service API for services to use in HackCC.


The application service also helps with
- providing meals for hacker.
- keeping track of attendance at workshops.

The application built with [Nest.js](https://nestjs.com/). For other libraries or tools, the list of documentation below should be referenced:
- [Docker Compose](https://docs.docker.com/compose/intro/compose-application-model/)

## Getting Started
To run the app locally, follow the instructions below

### Prequisites
Requirements to deploy and run this project
- [Node.js v17 or higher.](https://nodejs.org/en/about/previous-releases)
- [Npm latest release](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Extension Requirement
Please use the following extension in order to comply to the project's stand
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Installation
At the location of where you want to place this project at, clone the repository using the command below
```bash
git clone git@github.com:HackCC-Official/account-service.git
```

Then enter directory and install the dependencies
```bash
cd account-service
npm install
```

### Environment Variable
Use the following env template or the one found `.env.example`.
```
# account api
# account api
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_PORT=
DATABASE_DB=
PORT=
ACCOUNT_EXCHANGE=
RABBITMQ_URL=

# rabbitmq
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
```

## Running the application locally (the L version)
to run the application locally without the usage of any docker toolings
```bash
cd account-service
npm run start:dev
```

## Running the application locally (The better version)
Before running the application locally, make sure to create a `.env.local` file wihin the project source folder and fill the environmental variables from `.env.example` correctly. 

To run the application locally, use docker-compose to create a container of it
```bash
npm run start:docker
```

in some cases, such as environmental variable changes, you probably want to rebuild the container
```bash
npm run start:rebuild
```

Having the [Docker desktop](https://www.docker.com/) application will help immensely in this project

## Live Deployment
TBA

