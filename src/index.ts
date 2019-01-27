import { Compiler } from 'webpack';
import { loadValidated } from '@servall/app-config/dist/exports';

import { test } from './loader';
export const loader = require.resolve('./loader');
export const rule: { test: RegExp, loader: string } = { test, loader };

export default class AppConfigPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap('AppConfigPlugin', (factory) => {
      factory.hooks.beforeResolve.tapPromise('AppConfigPlugin', async (resolve) => {
        if (!resolve) return;

        if (resolve.request === '@servall/app-config' || resolve.request === 'app-config') {
          const { fileSource } = await loadValidated();
          resolve.request = fileSource;
        }

        return resolve;
      });
    });
  }
}
