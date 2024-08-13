export type LoggerOptions = {
  /**
   * The name of the logger.
   */
  name: string
}

export function useLogger({ name }: LoggerOptions) {
  /**
   * Logs an informational message.
   * @param message Message to log
   * @param args Optional arguments to log
   */
  function info(message: string, ...args: any[]) {
    console.log(`[${name}] ${message}`, ...args)
  }

  /**
   * Logs an error message.
   * @param message Message to log
   * @param args Optional arguments to log
   */
  function error(message: string, ...args: any[]) {
    console.error(`[${name}] ${message}`, ...args)
  }

  return {
    info,
    error,
  }
}