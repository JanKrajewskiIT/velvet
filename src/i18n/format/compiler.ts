/**
 * Compile a parsed MessageFormat AST into a high-performance render function.
 *
 * The compiler walks each node once and produces a closure that, given
 * `(params, locale)`, returns the formatted string. Compiled functions are
 * cached per template string so repeated `t()` calls cost only a Map lookup
 * plus the closure invocation.
 */

import type { Locale, MessageParams } from '../types';
import { getDateTimeFormat, getNumberFormat, getPluralRules, resolveDateTimeStyle, resolveNumberStyle } from './intl';
import { type MessageNode, parseMessage } from './parser';

export type CompiledMessage = (params: MessageParams | undefined, locale: Locale) => string;

const compileCache = new Map<string, CompiledMessage>();

const coerceNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  return 0;
};

const coerceDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'number' || typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date(0);
};

const renderNodes = (
  nodes: ReadonlyArray<MessageNode>,
  params: MessageParams | undefined,
  locale: Locale,
  poundValue: string,
): string => {
  let out = '';
  for (const node of nodes) {
    out += renderNode(node, params, locale, poundValue);
  }
  return out;
};

const renderNode = (
  node: MessageNode,
  params: MessageParams | undefined,
  locale: Locale,
  poundValue: string,
): string => {
  switch (node.type) {
    case 'literal':
      return node.value;
    case 'pound':
      return poundValue;
    case 'argument': {
      const value = params?.[node.name];
      if (value === undefined || value === null) return `{${node.name}}`;
      return String(value);
    }
    case 'number': {
      const value = coerceNumber(params?.[node.name]);
      return getNumberFormat(locale, resolveNumberStyle(node.style)).format(value);
    }
    case 'date':
    case 'time': {
      const value = coerceDate(params?.[node.name]);
      return getDateTimeFormat(locale, resolveDateTimeStyle(node.type, node.style)).format(value);
    }
    case 'plural': {
      const value = coerceNumber(params?.[node.name]);
      const formatted = getNumberFormat(locale).format(value);
      const exactKey = `=${value}`;
      const exact = node.branches.find((b) => b.key === exactKey);
      if (exact) return renderNodes(exact.nodes, params, locale, formatted);
      const category = getPluralRules(locale).select(value);
      const branch = node.branches.find((b) => b.key === category) ?? node.branches.find((b) => b.key === 'other');
      return branch ? renderNodes(branch.nodes, params, locale, formatted) : formatted;
    }
    case 'select': {
      const raw = params?.[node.name];
      const key = raw === undefined || raw === null ? 'other' : String(raw);
      const branch = node.branches.find((b) => b.key === key) ?? node.branches.find((b) => b.key === 'other');
      return branch ? renderNodes(branch.nodes, params, locale, '') : '';
    }
  }
};

/**
 * Compile a template into a `(params, locale) => string` function, cached
 * by template identity. Templates without placeholders short-circuit to a
 * constant returner.
 */
export function compileMessage(template: string): CompiledMessage {
  const cached = compileCache.get(template);
  if (cached) return cached;

  if (!template.includes('{')) {
    const constant: CompiledMessage = () => template;
    compileCache.set(template, constant);
    return constant;
  }

  let nodes: ReadonlyArray<MessageNode>;
  try {
    nodes = parseMessage(template);
  } catch {
    const passthrough: CompiledMessage = () => template;
    compileCache.set(template, passthrough);
    return passthrough;
  }

  const compiled: CompiledMessage = (params, locale) => renderNodes(nodes, params, locale, '');
  compileCache.set(template, compiled);
  return compiled;
}
