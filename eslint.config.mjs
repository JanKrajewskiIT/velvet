import { createEslintConfig } from './config/eslint.mjs';

export default createEslintConfig({
  tsconfigRootDir: import.meta.dirname,
  ignorePaths: ['.tmp-tests', 'demo/dist'],
});
