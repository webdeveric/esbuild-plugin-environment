import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    unstubEnvs: true,
    coverage: {
      provider: 'v8',
    },
  },
});
