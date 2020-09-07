# Authless Client • ![](https://github.com/authless/authless-client/workflows/Node.js%20CI/badge.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/2c66981166edee3f475d/maintainability)](https://codeclimate.com/github/authless/authless-client/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/2c66981166edee3f475d/test_coverage)](https://codeclimate.com/github/authless/authless-client/test_coverage)

Node.js client for [authless-server][authless_server_repo] written in TypeScript.

## Install

```
yarn add @authless/client
# - or -
npm install @authless/client
```

## Usage

```typescript
import { Client } from '@authless/client'

// setup a client
const authlessClient = new Client({
  serverUri: 'http://example.com:4000',
  retries: 2,
});

// use it
authlessClient.url('https://example.com', { referer: 'optional', responseFormat: 'json' })
authlessClient.url('https://example.com', { responseFormat: 'png' })
```

[authless_server_repo]: https://github.com/authless/authless-core
