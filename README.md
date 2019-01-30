## App Config Webpack Plugin
```javascript
import AppConfigPlugin, { regex, loader } from '@servall/app-config-plugin';

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
