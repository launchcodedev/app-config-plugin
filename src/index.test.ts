import { resolve } from 'path';
import * as webpack from 'webpack';
import * as HtmlPlugin from 'html-webpack-plugin';
import AppConfigPlugin, { regex, loader } from './index';

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
      new HtmlPlugin(),
      new AppConfigPlugin(),
    ],

    module: {
      rules: [
        { test: regex, use: { loader } },
      ],
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

test('test inject head', async () => {
  process.chdir(resolve(__dirname, '../example'));
  const options = {
    entry: resolve(__dirname, '../example/src/index.js'),
    mode: 'development' as 'development',
    output: {
      path: resolve(__dirname, '../example/dist'),
      filename: 'main.js',
    },

    plugins: [
      new HtmlPlugin(),
      new AppConfigPlugin({ headerInjection: true }),
    ],

    module: {
      rules: [
        {
          test: regex,
          use: {
            loader,
            options: {
              headerInjection: true,
            },
          },
        },
      ],
    },
  };

  await new Promise((resolve, reject) => {
    webpack([options], (err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toString());

      const { children: [{ modules }] } = stats.toJson();

      expect(modules.some(({ name, source }: any) => {
        return name === './.app-config.toml'
          && source.includes('export default window._appConfig;');
      })).toBe(true);

      resolve();
    });
  });
});
