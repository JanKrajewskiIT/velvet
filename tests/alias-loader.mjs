import { register } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const fileUrl = pathToFileURL(path.resolve(process.cwd(), 'tests', 'alias-loader.mjs')).href;
if (!process.env.VELVET_ALIAS_LOADER_REGISTERED) {
  process.env.VELVET_ALIAS_LOADER_REGISTERED = '1';
  register(fileUrl, pathToFileURL(process.cwd()));
}

const tmpSrcRoot = path.resolve(process.cwd(), '.tmp-tests', 'src');

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('~/')) {
    const specPath = specifier.slice(2);
    const basePath = path.join(tmpSrcRoot, specPath);
    const candidates = [`${basePath}.js`, `${basePath}.jsx`, path.join(basePath, 'index.js'), path.join(basePath, 'index.jsx')];
    const mappedPath = candidates.find((candidate) => fs.existsSync(candidate)) ?? `${basePath}.js`;
    return {
      shortCircuit: true,
      url: pathToFileURL(mappedPath).href,
    };
  }

  return defaultResolve(specifier, context, defaultResolve);
}
