import type { QueryGroup, QueryRule } from '../patterns/QueryBuilder';
import { cellText, rowValue } from './rowData';

type QueryNode = QueryRule | QueryGroup;

/** Operators that need no operand. */
const VALUELESS_OPS = ['empty', 'not_empty', 'true', 'false'];

const isGroup = (node: QueryNode): node is QueryGroup => 'rules' in node;

const isActive = (node: QueryNode): boolean =>
  isGroup(node) ? node.rules.some(isActive) : VALUELESS_OPS.includes(node.op) || node.value !== '';

/** Number of rules that currently constrain the result. */
export const countActiveRules = (node: QueryNode): number => {
  if (isGroup(node)) return node.rules.reduce((n, rule) => n + countActiveRules(rule), 0);
  return isActive(node) ? 1 : 0;
};

const matchesRule = (rule: QueryRule, row: object): boolean => {
  const value = rowValue(row, rule.field);
  const text = cellText(value).toLowerCase();
  const operand = cellText(rule.value).toLowerCase();
  const number = parseFloat(cellText(value));
  const operandNumber = parseFloat(rule.value);
  const isNumber = typeof value === 'number';
  const isBlank = value == null || value === '';
  switch (rule.op) {
    case 'contains':
      return text.includes(operand);
    case 'not_contains':
      return !text.includes(operand);
    case 'eq':
      return isNumber ? number === operandNumber : text === operand;
    case 'neq':
      return isNumber ? number !== operandNumber : text !== operand;
    case 'starts':
      return text.startsWith(operand);
    case 'empty':
      return isBlank;
    case 'not_empty':
      return !isBlank;
    case 'gt':
      return number > operandNumber;
    case 'gte':
      return number >= operandNumber;
    case 'lt':
      return number < operandNumber;
    case 'lte':
      return number <= operandNumber;
    case 'on':
      return text.slice(0, 10) === operand;
    case 'before':
      return text < operand;
    case 'after':
      return text > operand;
    case 'true':
      return !!value;
    case 'false':
      return !value;
    default:
      return true;
  }
};

/** Whether `row` satisfies every (and) or any (or) active rule of the query tree. */
export const matchesQuery = (node: QueryNode, row: object): boolean => {
  if (!isGroup(node)) return matchesRule(node, row);
  const active = node.rules.filter(isActive);
  if (!active.length) return true;
  return node.combinator === 'or'
    ? active.some((r) => matchesQuery(r, row))
    : active.every((r) => matchesQuery(r, row));
};
