declare const config: {
  getJSON: NonNullable<import('vite').CSSModulesOptions['getJSON']>;
  // eslint-disable-next-line no-unused-vars -- Vite's CSS Modules callback has two positional inputs.
  generateScopedName: (name: string, filename: string) => string;
};
export default config;
