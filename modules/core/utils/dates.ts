export function formatDate(
  input: [number, number, number],
  locale: string = 'ru-RU'
): string {
  return new Date(
    Number(input[0]),
    Number(input[1])-1,
    Number(input[2])
  ).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}