export function createLintStagedConfig({
  eslintTarget = '*.{ts,tsx}',
  prettierTarget = '*.{css,json,md}',
} = {}) {
  return {
    [eslintTarget]: ['eslint --fix --no-warn-ignored', 'prettier --write'],
    [prettierTarget]: ['prettier --write'],
  };
}

export const lintStagedConfig = createLintStagedConfig();

export default lintStagedConfig;
