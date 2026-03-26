import type { JSX } from 'solid-js';

type RichTextValue = JSX.Element | string | number;

export function interpolateText(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;

  return template.replace(/\{([^}]+)\}/gu, (_match, token: string) => {
    const value = values[token];
    return value === undefined ? `{${token}}` : String(value);
  });
}

export function renderRichText(template: string, values: Record<string, RichTextValue>): RichTextValue[] {
  return template
    .split(/(\{[^}]+\})/gu)
    .filter((part) => part.length > 0)
    .map((part) => {
      const token = /^\{([^}]+)\}$/u.exec(part)?.[1];
      return token ? (values[token] ?? part) : part;
    });
}
