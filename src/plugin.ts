import { definePlugin } from 'esbuild-plugin-define';

import type { Plugin } from 'esbuild';

export const PLUGIN_NAME = 'environment-plugin';

export const environmentPlugin = (
  data: string[] | Record<string, string | number | boolean | bigint | undefined | null>,
): Plugin => ({
  name: PLUGIN_NAME,
  async setup(build) {
    const entries = Array.isArray(data) ? data.map((key) => [key, '']) : Object.entries(data);

    const env: Record<string, string> = Object.fromEntries(
      entries.map(([key, defaultValue]) => [key, String(process.env[key] ?? defaultValue)]),
    );

    await definePlugin({ process: { env } }).setup(build);
  },
});
