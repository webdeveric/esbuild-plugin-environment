import { build, PluginBuild } from 'esbuild';

import { describe, expect, it } from 'vitest';

import { environmentPlugin, PLUGIN_NAME } from './plugin';

describe.concurrent('environmentPlugin()', () => {
  it('Returns an esbuild plugin', () => {
    expect(environmentPlugin({})).toMatchObject({
      name: PLUGIN_NAME,
    });
  });

  it('Modifies initialOptions.define', async () => {
    const build: Partial<PluginBuild> = {
      initialOptions: {
        define: {},
      },
    };

    await environmentPlugin({ test: 'test' }).setup(build as PluginBuild);

    expect(build.initialOptions?.define).toMatchObject({
      'process.env.test': '"test"',
    });
  });

  it('Accepts array of process.env keys', async () => {
    const build: Partial<PluginBuild> = {
      initialOptions: {
        define: {},
      },
    };

    await environmentPlugin(['PWD']).setup(build as PluginBuild);

    expect(build.initialOptions?.define).toMatchObject({
      'process.env.PWD': JSON.stringify(process.cwd()),
    });
  });
});

describe('Usage with esbuild', () => {
  it('Specifying default values', async () => {
    const results = await build({
      write: false,
      stdin: {
        contents: 'console.log(process.env.PLUGIN_TEST)',
      },
      plugins: [
        environmentPlugin({
          PLUGIN_TEST: 'true',
        }),
      ],
    });

    expect(results.outputFiles.at(0)?.text.trim()).toBe('console.log("true");');
  });

  describe('Specifying array of environment variable names', () => {
    it('Undefined environment variables default to empty string', async () => {
      const results = await build({
        write: false,
        stdin: {
          contents: 'console.log(process.env.PLUGIN_TEST)',
        },
        plugins: [environmentPlugin(['PLUGIN_TEST'])],
      });

      expect(results.outputFiles.at(0)?.text.trim()).toBe('console.log("");');
    });

    it('Undefined environment variables default to empty string', async () => {
      process.env.PLUGIN_TEST = 'true';

      const results = await build({
        write: false,
        stdin: {
          contents: 'console.log(process.env.PLUGIN_TEST)',
        },
        plugins: [environmentPlugin(['PLUGIN_TEST'])],
      });

      delete process.env.PLUGIN_TEST;

      expect(results.outputFiles.at(0)?.text.trim()).toBe('console.log("true");');
    });
  });
});
