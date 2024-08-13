export function formatDate(input: string): string {
  if (input.length === 8) {
    // Extract year, month, and day
    const year = input.substring(0, 4);
    const month = input.substring(4, 6);
    const day = input.substring(6, 8);

    // Format the date according to locale
    return new Date(Number(year), Number(month), Number(day))
      .toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'numeric', day: 'numeric'
      });
  } else {
    return input
  }
}