## App Config Webpack Plugin
[![Licensed under MPL 2.0](https://img.shields.io/badge/license-MPL_2.0-green.svg)](https://www.mozilla.org/en-US/MPL/2.0/)
[![Build Status](https://github.com/launchcodedev/app-config-plugin/workflows/CI/badge.svg)](https://github.com/launchcodedev/app-config-plugin/actions)
[![npm](https://img.shields.io/npm/v/@lcdev/app-config-plugin.svg)](https://www.npmjs.com/package/@lcdev/app-config-plugin)

```javascript
import AppConfigPlugin, { regex, loader } from '@lcdev/app-config-plugin';

// in your plugins:
plugins: [
  new AppConfigPlugin(),
]

// in your loaders:
module: {
  rules: [
    { test: regex, use: { loader } },
  ],
},
```

Need `window` injection support?

```javascript
plugins: [
  // this injects the configuration into <head> at build time
  new AppConfigPlugin({ headerInjection: true }),
]

module: {
  rules: [
    {
      test: regex,
      use: {
        loader,
        options: {
          // this reads the configuration from <head> instead of injecting it at build time
          headerInjection: true,
        },
      },
    },
  ],
},
```
