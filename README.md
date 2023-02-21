<br />
<div align="center">
  <h3 align="center">URL Shortener</h3>

  <p align="center">
    A platform with simplistic interface where you can easily shorten and manage URLs.
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#description">Description</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#run-tests">Run Tests</a></li>
    <li><a href="#cicd">CICD</a></li>
    <li><a href="#database">Database</a></li>
    <li><a href="#further-improvement">Further Improvement</a></li>
  </ol>
</details>

## Description

It is not uncommon to see someone need to share a long and complex URL with friends or colleagues, and he/she might copy or type the URL wrongly. If the URL has to be remembered, this can be more troublesome. Hence this application aims to allow anyone to shorten any URL and then keep the URLs managed all in this platform.

<br />

## Features

1. use [short-uuid](https://github.com/oculus42/short-uuid) npm package to create a 6 charater-long case sensitive alphanumic string. It is used to map url only when databse record shows that the generated UUID has not been used before.
2. when users access shorten url, the web server will trigger a 307 temporary redirect using the original url. This is done in NextJS page component, with the help of its server side rendering, a 307 http response can be sent.
3. User is able to add and delete url in the url listing page

<br />

## Tech Stack

| Tech          | Description                                                                                                                                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NextJS        | NextJS is a meta framework for building web application, which essentially means it can develop both client and server side functionalities easily. In this app, it is used to develop client side interfaces, support few API routes for frontend user interaction, and most importantly handle url redirect. |
| React         | Since NextJS is React-based, so the web UI are all done using React, which makes it easy to develop highly interactive stateful web interfaces.                                                                                                                                                                |
| Sqlite DB     | Sqlite DB is lightweight, file based Database, so it is chosen in this application since there is no need to develop any complicated database schema and migrations.                                                                                                                                           |
| ChakraUI      | ChakraUI is a popular UI library for React application, there is no particular reason why i chose it, just wanted to give it a try!                                                                                                                                                                            |
| Docker        | Containerisation is considered very helpful when developing web application, and docker is kind of like the de facto for it. It is used because it provides good containerisation of the application building environment and also the ease of deployment.                                                     |
| Github action | Github action is a popular CICD pipeline tool, and i chose it because i wanted to learn how it works and also setup the pipeline to ensure the smooth auto deployment of this application                                                                                                                      |
| AWS ec2       | EC2 is a popular virtual server instance service provided by Amazon, it is chosen because i need a server that the CICD can deploy the application to.                                                                                                                                                         |

<br />

## Setup

NOTE: _Since ther is no Dockerfile set up for the local development, this is to guide on how local environment can be set up_

Simply clone the project by running

```
git clone https://github.com/leonardlzn/url-shortener.git
```

Make sure you have Node(should be fine as long as its above version 14) and yarn installed in your machine, after which, install the dependencies by running

```
yarn
```

And spin up the app by running

```
yarn dev
```

Now the application can be access in `localhost:3000`

<br />

## Run Tests

### Unit test

There are [tests](https://github.com/leonardlzn/url-shortener/blob/main/src/utils/index.test.ts) to cover the requirements on the uuid generation function and they can be run locally(after following the [setup](https://github.com/leonardlzn/url-shortener#setup) step) by running this in terminal

```
yarn run test:unit
```

### e2e test

There is also [test](https://github.com/leonardlzn/url-shortener/blob/main/e2e/redirect.spec.ts) to simulate the browser accessing the shorten url. Run the test by typing this in terminal

```
yarn run test:e2e
```

<br />

## CICD

Mainly three components involved in CICD:

1. [github action](https://github.com/leonardlzn/url-shortener/blob/main/.github/workflows/deploy.yml) for the pipeline
2. docker for application build
3. aws ec2 t2.micro instance for hosting the application(free tier :) )

<br />

There are mainly three stages in the pipeline

1. unit and e2e tests are run
2. build the application image and push to docker hub
3. ssh into ec2 instance to pull the latest docker image and re-create the container

<br />

NOTE: _This pipeline is triggered whenever there is new commit pushed to **main** branch_

<br />

## Database

Mainly three components

1. sqlite DB
2. docker volume

As a lightweight database, sqlite3 serve this application well by providing persistence to the data submitted by the user. However, in the CICD pipeline a new database(sqlite db file) is created in the docker image everytime when there is a deployment, which defeat the purpose of using database. Hence, docker volume is used to persist the database to the host level, so that even when container is recreated, the same DB file can be used

<br />

## Further Improvement

1. Make use of memory caching (e.g. redis) to cache the access of original url to reduce the lookup to database.
2. UUID duplication check on every new url adding request
3. URL format validation
4. Separate redirecting and dashboard services
5. Authentiation and authorisation
6. Logging and monitoring
7. Load balancing on the the shortened URL access'
8. Handle hot reload
9. Blue green deployment
