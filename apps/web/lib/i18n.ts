import idMessages from '../messages/id.json';

type NestedRecord = { [key: string]: string | NestedRecord };

export function t(key: string): string {
  const parts = key.split('.');
  let current: string | NestedRecord | undefined = idMessages as NestedRecord;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return key;
    }
  }
  return typeof current === 'string' ? current : key;
}

export { idMessages };
