import { defineConfig } from 'father';

export default defineConfig({
  cjs: undefined,
  esm: {
    output: 'dist',
    transformer: 'babel',
  },
});
