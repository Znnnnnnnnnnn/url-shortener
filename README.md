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
    <li><a href="#guide">Guide</a></li>
  </ol>
</details>

## Description

It is not uncommon to see someone need to share a long and complex URL with friends or colleagues, and he/she might copy or type the URL wrongly. If the URL has to be remembered, this can be more troublesome. Hence this application aims to allow anyone to shorten any URL and then keep the URLs managed all in this platform.

<br />

## Features

1. use node `crypto` module to perform sha512 hmac encryption on url string, it uses a secret key to hash the url string for generating a a digital signature. output is unique and not possible to be deciphered.
2. when user access shorten url, the web server will trigger a 307 temporary redirect using the original url. This is done in NextJS page component, with the help of its server side rendering, a 307 http response can be sent

## Tech Stack

## Setup

## Run Tests

## Guide
