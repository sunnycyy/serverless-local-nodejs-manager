# Serverless Local Node.js Manager
Simple [Serverless][link-serverless] plugin for validating local installed Node.js version before packaging and deployment.

[![serverless](http://public.serverless.com/badges/v3.svg)][link-serverless]
[![license](https://img.shields.io/npm/l/serverless-local-nodejs-manager)](./LICENSE)
[![npm](https://img.shields.io/npm/v/serverless-local-nodejs-manager)](https://www.npmjs.com/package/serverless-local-nodejs-manager)

## Installation
**Install via Serverless**
```shell
serverless plugin install -n serverless-local-nodejs-manager
```

**Install via NPM**

Install the plugin via NPM:
```shell
npm install --save-dev serverless-local-nodejs-manager
```
Then register it in the `plugin` section of `servereless.yml`:
```yaml
# serverless.yml file

plugins:
  - serverless-local-nodejs-manager
```

## Configuration
Add `localNodejsVersion` value in the `custom` section of `serverless.yml`, specify the target installed Node.js version with one of the following format:
- `x` (allow any minor and patch versions under specific major version)
- `x.y` (allow any patch versions under specific major and minor version)
- `x.y.z` (ONLY allow specific version)

For example:
```yaml
# serverless.yml file

custom:
  localNodejsVersion: '16.18.1'
```

## Usage
When running `serverless package`, `serverless deploy` or `serverless deploy function`,
local installed Node.js version will be checked to make sure it matches the target installed version specified.
Exception will be thrown when running the above commands if the installed Node.js version does not match the target installed version specified.

For example:

If `localNodejsVersion` is set to `16`:

| Installed Node.js version | Allow? |
|:-------------------------:|:------:|
|         `16.18.0`         |   ⭕    |
|         `16.18.1`         |   ⭕    |
|         `16.19.1`         |   ⭕    |
|         `14.21.3`         |   ❌    |
|         `18.15.0`         |   ❌    |

If `localNodejsVersion` is set to `16.18`:

| Installed Node.js version | Allow? |
|:-------------------------:|:------:|
|         `16.18.0`         |   ⭕    |
|         `16.18.1`         |   ⭕    |
|         `16.17.1`         |   ❌    |
|         `16.19.1`         |   ❌    |

If `localNodejsVersion` is set to `16.18.1`:

| Installed Node.js version | Allow? |
|:-------------------------:|:------:|
|         `16.18.1`         |   ⭕    |
|         `16.18.0`         |   ❌    |

[link-serverless]: https://www.serverless.com/