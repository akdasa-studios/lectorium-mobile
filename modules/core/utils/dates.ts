export function formatDate(
  input: [number, number?, number?],
  locale: string = 'ru-RU'
): string {
  if (input.length === 1) {
    return input[0].toString()
  } else if (input.length === 2) {
    return new Date(
      Number(input[0]),
      Number(input[1])-1,
    ).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
    })
  } else if (input.length === 3) {
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
  return ""
}