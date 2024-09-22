import { build, type PluginBuild } from 'esbuild';

import { describe, expect, it, vi } from 'vitest';

import { environmentPlugin, PLUGIN_NAME } from './plugin.js';

describe.concurrent('environmentPlugin()', () => {
  it('Returns an esbuild plugin', () => {
    expect(environmentPlugin({})).toMatchObject({
      name: PLUGIN_NAME,
    });
  });

  it('Modifies initialOptions.define', async () => {
    const pluginBuild: Partial<PluginBuild> = {
      initialOptions: {
        define: {},
      },
    };

    await environmentPlugin({ test: 'test' }).setup(pluginBuild as PluginBuild);

    expect(pluginBuild.initialOptions?.define).toMatchObject({
      'process.env.test': '"test"',
    });
  });

  it('Accepts array of process.env keys', async () => {
    const pluginBuild: Partial<PluginBuild> = {
      initialOptions: {
        define: {},
      },
    };

    await environmentPlugin(['PWD']).setup(pluginBuild as PluginBuild);

    expect(pluginBuild.initialOptions?.define).toMatchObject({
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

  it('Environment variable values are strings', async () => {
    const results = await build({
      write: false,
      stdin: {
        contents: 'console.log(process.env.UNDEFINED_VAR)',
      },
      plugins: [
        environmentPlugin({
          UNDEFINED_VAR: JSON.stringify(process.env.UNDEFINED_VAR),
        }),
      ],
    });

    expect(results.outputFiles.at(0)?.text.trim()).toBe('console.log("undefined");');
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

    it('Defined environment variables are used', async () => {
      vi.stubEnv('PLUGIN_TEST', 'true');

      const results = await build({
        write: false,
        stdin: {
          contents: 'console.log(process.env.PLUGIN_TEST)',
        },
        plugins: [environmentPlugin(['PLUGIN_TEST'])],
      });

      expect(results.outputFiles.at(0)?.text.trim()).toBe('console.log("true");');
    });
  });
});
