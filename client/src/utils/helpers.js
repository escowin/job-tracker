export const format = {
  id: (string) => string ? string.replace(/-/g, " ") : string,
  date: (string) => string ? string.replace(/-/g, ".") : string,
  title: (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : string,
  today: () => new Date().toISOString().split("T")[0]
}