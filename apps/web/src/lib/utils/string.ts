export const replaceAll = (str: string, target: string, replacement: string): string => {
  return str.split(target).join(replacement);
};

export const stripQuotes = (text: string): string => {
  if (text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1);
  }
  return text;
};
