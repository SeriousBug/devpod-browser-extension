/** A stringify function that is guaranteed to never throw.
 *
 * As a consequence, this function may return its results in any format. Only
 * use this for cases where the serialized data being gibberish is less of a
 * problem than this function throwing an error.
 */
export function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.debug("safeStringify failed to stringify value", error);
    try {
      return String(value);
    } catch (error) {
      console.debug("safeStringify fallback also failed", error);
      return "[ FAILED TO SERIALIZE ]";
    }
  }
}
