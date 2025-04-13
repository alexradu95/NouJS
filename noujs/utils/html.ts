// noujs/utils/html.ts - Utility function for HTML templating

/**
 * Custom HTML template tag for intellisense support and type safety
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = '';
  strings.forEach((string, i) => {
    result += string;
    if (i < values.length) {
      result += values[i];
    }
  });
  return result;
} 