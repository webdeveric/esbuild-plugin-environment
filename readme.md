# `esbuild-plugin-environment`

[![Build Status](https://github.com/webdeveric/esbuild-plugin-environment/workflows/Node.js%20CI/badge.svg)](https://github.com/webdeveric/esbuild-plugin-environment/actions)

## Install

```sh
npm install esbuild-plugin-environment -D
```

## Usage

Add the plugin to your esbuild `plugins`.

Example `esbuild.config.cjs` file:

```js
const { environmentPlugin } = require('esbuild-plugin-environment');

module.exports = () => {
  const config = {
    bundle: true,
    sourcemap: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    outputFileExtension: '.mjs',
    environment: {},
    concurrency: 4,
    watch: {
      pattern: ['./src/**'],
      ignore: ['dist', 'node_modules'],
    },
    plugins: [
      // process.env key => default value
      environmentPlugin({
        BUILD_TIMESTAMP: new Date().toISOString(),
      }),
      // Array of process.env keys
      environmentPlugin(['PWD', 'npm_package_version']),
    ],
  };

  return config;
};
```
