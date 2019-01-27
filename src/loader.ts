import * as wp from 'webpack';
import { loadConfigSync, loadValidated } from '@servall/app-config/dist/exports';

const loader: wp.loader.Loader = function (source) {
  if (this.cacheable) this.cacheable();
  const callback = this.async()!;

  // we only inject nonSecrets into bundles, for obvious reasons
  loadValidated().then(({ nonSecrets }) => {
    callback(null, `
      export default ${JSON.stringify(nonSecrets)};
    `);
  }).catch(err => callback(err));

  return source;
};

export const test = /($@servall\/app-config)|(\.?app-config\.(toml|yml|json|json5))/;
export default loader;
