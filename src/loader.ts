import * as wp from 'webpack';
import { getOptions } from 'loader-utils';
import { loadValidated } from '@lcdev/app-config/dist/exports';

const loader: wp.loader.Loader = function() {
  if (this.cacheable) this.cacheable();
  const callback = this.async()!;

  const { headerInjection = false } = getOptions(this) || {};

  if (headerInjection) {
    return callback(
      null,
      `
      export default window._appConfig;
    `,
    );
  }

  // we only inject nonSecrets into bundles, for obvious reasons
  loadValidated()
    .then(({ nonSecrets, fileSource }) => {
      if (fileSource) {
        this.addDependency(fileSource);
      }

      callback(
        null,
        `
      export default ${JSON.stringify(nonSecrets)};
    `,
      );
    })
    .catch(err => callback(err));
};

export const test = /(^@(lcdev|servall)\/app-config)|(\.?app-config(\.\w+)?\.(toml|yml|yaml|json|json5))/;
export default loader;
