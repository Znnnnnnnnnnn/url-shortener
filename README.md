<br />
<div align="center">
  <h3 align="center">URL Shortener</h3>

  <p align="center">
    A platform with simplistic interface where you can easily shorten any URL.
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
    <li><a href="#user-guide">User Guide</a></li>
  </ol>
</details>

## Description

It is not uncommon to see someone need to share a long and complex URL with friends or colleagues, and he/she might copy or type the URL wrongly. If the URL has to be remembered, this can be more troublesome. Hence this application aims to allow anyone to shorten any URL and then keep the URLs managed all in this platform.

<br />

## Features

1. use [short-uuid](https://github.com/oculus42/short-uuid) npm package to create a 6 charater-long case sensitive alphanumic string. It is used to map url only when databse record shows that the generated UUID has not been used before.
2. when users access shorten url, the web server will trigger a 307 temporary redirect using the original url. This is done in NextJS page component, with the help of its server side rendering, a 307 http response can be sent.

<br />

## Tech Stack

<br />

## Setup

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

## User Guide
