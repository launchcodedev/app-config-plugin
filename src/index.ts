import { Compiler } from 'webpack';
import { loadValidated } from '@servall/app-config/dist/exports';
import { Hooks } from 'html-webpack-plugin';

export { test as regex } from './loader';
export const loader = require.resolve('./loader');

type Options = { headerInjection?: boolean };

export default class AppConfigPlugin {
  headerInjection: boolean;

  constructor({ headerInjection = false }: Options = {}) {
    this.headerInjection = headerInjection;
  }

  apply(compiler: Compiler) {
    if (this.headerInjection) {
      this.injectHead(compiler);
    }

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

  injectHead(compiler: Compiler) {
    compiler.hooks.compilation.tap('AppConfigPlugin', (compilation) => {
      (compilation.hooks as Hooks)
        .htmlWebpackPluginAlterAssetTags.tapPromise('AppConfigPlugin', async (html) => {
          const { nonSecrets } = await loadValidated();

          return {
            ...html,
            head: [
              ...html.head,
              {
                tagName: 'script',
                attributes: { id: 'app-config' },
                voidTag: false,
                innerHTML: `window._appConfig = ${JSON.stringify(nonSecrets)}`,
              },
            ],
          };
        });
    });
  }
}
