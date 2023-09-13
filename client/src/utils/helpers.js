const formats = [
  { type: "id", method: (string) => string.replace(/-/g, " ") },
  { type: "date", method: (string) => string.replace(/-/g, ".") },
  { type: "title", method: (string) => string.charAt(0).toUpperCase() + string.slice(1)}
];

export const format = (string, type) => {
  if (!string) {
    return
  }

  const format = formats.find((obj) => obj.type === type);
  return format ? format.method(string) : string;
};