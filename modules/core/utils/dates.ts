export function formatDate(input: string): string {
  if (input.length === 8) {
    // Extract year, month, and day
    const year = input.substring(0, 4);
    const month = input.substring(4, 6);
    const day = input.substring(6, 8);

    // Format the date as YYYY mm dd
    return `${year} ${month} ${day}`;
  } else {
    return input
  }
}