import { createChunkedLintStagedConfig } from '@jankrajewskiit/configs/lint-staged';

export default createChunkedLintStagedConfig({
  ignorePaths: [/^(?:velvet\/|src\/styles\/(?:styles\.css$|components\/|tokens\/|fonts\/))/u],
});
