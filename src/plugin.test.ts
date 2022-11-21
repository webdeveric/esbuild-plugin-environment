import type { PluginBuild } from 'esbuild';

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
