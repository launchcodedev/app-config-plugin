import * as wp from 'webpack';
import { getOptions } from 'loader-utils';
import { loadConfigSync, loadValidated } from '@servall/app-config/dist/exports';

const loader: wp.loader.Loader = function (source) {
  if (this.cacheable) this.cacheable();
  const callback = this.async()!;

  const { headerInjection = false } = getOptions(this) || {};

  if (headerInjection) {
    return callback(null, `
      export default window._appConfig;
    `);
  }

  // we only inject nonSecrets into bundles, for obvious reasons
  loadValidated().then(({ nonSecrets, fileSource }) => {
    if (fileSource) {
      this.addDependency(fileSource);
    }

    callback(null, `
      export default ${JSON.stringify(nonSecrets)};
    `);
  }).catch(err => callback(err));
};

export const test = /($@servall\/app-config)|(\.?app-config\.(toml|yml|json|json5))/;
export default loader;
