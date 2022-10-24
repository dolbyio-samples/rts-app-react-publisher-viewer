export function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw Error(`No environment variable found for key ${key}`);
  }
  return value;
}
