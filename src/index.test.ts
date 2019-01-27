import { resolve } from 'path';
import * as webpack from 'webpack';
import AppConfigPlugin, { rule } from './index';

test('test', async () => {
  process.chdir(resolve(__dirname, '../example'));
  const options = {
    entry: resolve(__dirname, '../example/src/index.js'),
    mode: 'development' as 'development', // weird?
    output: {
      path: resolve(__dirname, '../example/dist'),
      filename: 'main.js',
    },

    plugins: [
      new AppConfigPlugin(),
    ],

    module: {
      rules: [rule],
    },
  };

  await new Promise((resolve, reject) => {
    webpack([options], (err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toString());

      const { children: [{ modules }] } = stats.toJson();

      expect(modules.some(({ name, source }: any) => {
        return name === './.app-config.toml'
          && source.includes('export default {"apiURL":"http://localhost:8000"}');
      })).toBe(true);

      resolve();
    });
  });
});
