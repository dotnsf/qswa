# QSWA(Quite Simple Web Application)

## Overview

**Quite Simple Web Application** sample with document CRUD.


## How to run in CLI

- Install Node.js:

  - https://nodejs.org/

- Git clone or download source code:

  - https://github.com/dotnsf/qswa.git

- Install dependent libraries:

  - `$ npm install`

- Run with node command:

  - `$ node app`

  - If you want to run app with your selected port(8081, for example), set as port variable:

    - `$ port=8081 node app`

- Access to qswa

  - `http://localhost:8080/`

### How to run in docker

- Install docker:

  - `$ curl -sSL https://get.docker.com | sh`
  
  - `$ sudo usermod -a -G docker pi`

- Pull image

  - `$ docker pull dotnsf/qswa`
  
- Run image

  - `docker run --name qswa -d -p 8080:8080 dotnsf/qswa`

- Access to qswa

  - `http://localhost:8080/`

### How to run with Eclipse Orion editor in docker-compose ( for education purpose )

- Install docker:

  - `$ curl -sSL https://get.docker.com | sh`
  
  - `$ sudo usermod -a -G docker pi`

- Pull images

  - `$ docker pull dotnsf/qswa`
  
  - `$ docker pull cloudeity/orion`

- Build images

  - `$ docker-compose build`
  
- Run images

  - `docker-compose up -d`

- Access to qswa

  - `http://localhost:8080/`

- Access to orion

  - `http://localhost:8081/`


## REST API document

- Browse Swagger document:

  - `http://localhost:8080/_doc/`


## Files & Folders

```
|- api/            : Folder for APIs
|   |- db.js       : DB CRUD API
|
|- node_modules/   : Dependent Libraries(, which will be created after `$ npm install`)
|
|- public/         : Static files (JavaScript, CSS, Images, and Swagger documents)
|
|- views/          : HTML templates
|   |- doc.ejs     : To show single document
|   |- docs.ejs    : To show multiple documents list
|   |- edit.ejs    : To edit(create/update) single document
|   |- footer.ejs  : Common footer
|   |- header.ejs  : Common header
|   |- navi.ejs    : Common navigation
|
|- .cfignore       : Ignore files for Cloud Foundry deploy
|- .eslintignore   : Ignore files for lint
|- .eslintrc.js    : Resource files for lint
|- .gitignore      : Ignore files for Git
|- app.js          : Main file
|- Dockerfile      : Docker file
|- package.json    : Package file
|- README.md       : This file
|- settings.js     : Setting file

```

## Copyright

2020-2021 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
