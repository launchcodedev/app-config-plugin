import { test as regex } from './loader';

test('regex matches lcdev', () => {
  expect(regex.exec('')).toBeFalsy();
  expect(regex.exec('@lcdev/app-config')).toBeTruthy();
  expect(regex.exec('.app-config.yml')).toBeTruthy();
  expect(regex.exec('app-config.yml')).toBeTruthy();
  expect(regex.exec('.app-config.toml')).toBeTruthy();
  expect(regex.exec('app-config.toml')).toBeTruthy();
});

test('regex matches servall', () => {
  expect(regex.exec('')).toBeFalsy();
  expect(regex.exec('@servall/app-config')).toBeTruthy();
  expect(regex.exec('.app-config.yml')).toBeTruthy();
  expect(regex.exec('app-config.yml')).toBeTruthy();
  expect(regex.exec('.app-config.toml')).toBeTruthy();
  expect(regex.exec('app-config.toml')).toBeTruthy();
});
