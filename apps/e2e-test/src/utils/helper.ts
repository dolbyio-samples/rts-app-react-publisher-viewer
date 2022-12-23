export function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw Error(`No environment variable found for key ${key}`);
  }
  return value;
}

export function delay(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function formatURL(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
