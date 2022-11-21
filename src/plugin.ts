import type { Plugin } from 'esbuild';

import { definePlugin } from 'esbuild-plugin-define';

export const PLUGIN_NAME = 'environment-plugin';

type StringRecord = Record<string, string>;

type StringTuple = [key: string, value: string];

export const environmentPlugin = (data: string[] | StringRecord): Plugin => ({
  name: PLUGIN_NAME,
  async setup(build) {
    const entries = Array.isArray(data) ? data.map<StringTuple>(key => [key, '']) : Object.entries(data);

    const env: StringRecord = Object.fromEntries(
      entries.map(([key, defaultValue]) => {
        return [key, process.env[key] ?? defaultValue];
      }),
    );

    await definePlugin({ process: { env } }).setup(build);
  },
});
