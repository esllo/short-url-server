export function isValidURL(urlText: string): boolean {
  try {
    const { protocol } = new URL(urlText);
    return protocol === 'https:';
  } catch (e) {
    return false;
  }
}