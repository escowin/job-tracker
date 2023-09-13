export const format = {
  id: (string) => string ? string.replace(/-/g, " ") : string,
  date: (string) => string.replace(/-/g, "."),
  title: (string) => string.charAt(0).toUpperCase() + string.slice(1)
}