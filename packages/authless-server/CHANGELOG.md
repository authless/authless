## [@authless/server-v3.0.1](https://github.com/authless/authless/compare/@authless/server-v3.0.0...@authless/server-v3.0.1) (2020-10-05)


### Bug Fixes

* **server:** improve error handling ([fa86cf4](https://github.com/authless/authless/commit/fa86cf48cdd3ec3cd64d12fa78a699401261ae92))

## [@authless/server-v3.0.0](https://github.com/authless/authless/compare/@authless/server-v2.0.0...@authless/server-v3.0.0) (2020-10-01)


### ⚠ BREAKING CHANGES

* **server:** to fix lerna + semantic-release issues

### Bug Fixes

* **server:** always close browser ([5770303](https://github.com/authless/authless/commit/5770303c60fae4c50292bcadf7c04a45044f8a8e))

## [@authless/server-v2.0.0](https://github.com/authless/authless/compare/@authless/server-v1.0.0...@authless/server-v2.0.0) (2020-10-01)


### ⚠ BREAKING CHANGES

* uses lerna monorepo now

### Features

* add @authless/common ([25715e5](https://github.com/authless/authless/commit/25715e542e10f94721ff548bbde578bb5aef82da))

## @authless/server-v1.0.0 (2020-10-01)


### Bug Fixes

* **core:** bump @authless/core to 1.4.1 ([2964617](https://github.com/authless/authless/commit/296461772f0772c0f52b6617ae378148d979c819))
* **server:** bump @authless/core to 1.4.0 ([8a8340a](https://github.com/authless/authless/commit/8a8340ad7bb0aa8d85e902771968f0f50260ab49))
* add lazy redis connect ([eb15cd4](https://github.com/authless/authless/commit/eb15cd47d83006a8d3801f1a33405e3eef4d00a7))

### [1.0.2](https://github.com/authless/authless-server/compare/v1.0.1...v1.0.2) (2020-09-25)


### Bug Fixes

* **core:** bump @authless/core to 1.4.1 ([f5dbf00](https://github.com/authless/authless-server/commit/f5dbf00662c1e409254bc9f2b0f6eb01adc7237b))

### [1.0.1](https://github.com/authless/authless-server/compare/v1.0.0...v1.0.1) (2020-09-25)


### Bug Fixes

* **server:** bump @authless/core to 1.4.0 ([5eb0118](https://github.com/authless/authless-server/commit/5eb0118d619646a7dce7bda55b0431c230ba0a61))

## [1.0.0](https://github.com/authless/authless-server/compare/v0.1.4...v1.0.0) (2020-09-25)


### ⚠ BREAKING CHANGES

* complete rewrite

### Features

* create Server based on core v1.3 ([37322c1](https://github.com/authless/authless-server/commit/37322c173eb49a08a7671ee45390a87a10c455db))

### [2.0.1](https://github.com/authless/authless-client/compare/v2.0.0...v2.0.1) (2020-09-24)


### Bug Fixes

* **client:** improve error reporting ([b992a60](https://github.com/authless/authless-client/commit/b992a602567544405b3c3baed80df9e92016bb39))

## [2.0.0](https://github.com/authless/authless-client/compare/v1.2.0...v2.0.0) (2020-09-07)


### ⚠ BREAKING CHANGES

* **client:** exports single `Client` (removes LowLevel and HighLevelClient) and removes Cache functionality.

### Features

* **client:** simplify client; removes high-level & cache ([6bc8cc6](https://github.com/authless/authless-client/commit/6bc8cc6cc39c86bda98a6fee90854d3308d9edcf))

## [1.2.0](https://github.com/authless/authless-client/compare/v1.1.1...v1.2.0) (2020-08-17)


### Features

* use @authless/core v1.1.0 ([6042b1e](https://github.com/authless/authless-client/commit/6042b1ee17a14156b9c14413993d6127e5b2af99))

### [1.1.1](https://github.com/authless/authless-client/compare/v1.1.0...v1.1.1) (2020-06-12)


### Bug Fixes

* **package:** add prepublish build hook ([963de02](https://github.com/authless/authless-client/commit/963de020492bda4926cd14e0115ecd33d21ed746))
* **package:** fix types path ([2b5527a](https://github.com/authless/authless-client/commit/2b5527a6e0b4fe54a6837cff7a3f8f7d9453529f))

## [1.1.0](https://github.com/authless/authless-client/compare/v1.0.4...v1.1.0) (2020-05-28)


### Features

* **typescript:** initiate typescript conversion ([f6c08c9](https://github.com/authless/authless-client/commit/f6c08c926bc1c819abd44ed67f151470786c9ed7))


### Bug Fixes

* **test:** create dummy cache with correct type-signature ([2ae842d](https://github.com/authless/authless-client/commit/2ae842d7c17fd5771068098fa229e02b14ec6c44))
