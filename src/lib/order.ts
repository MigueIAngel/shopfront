/** Human-friendly, time-based order reference, e.g. `SF-MG4K2Z1A`. */
export function createOrderId(now: number = Date.now()): string {
  return `SF-${now.toString(36).toUpperCase()}`
}
