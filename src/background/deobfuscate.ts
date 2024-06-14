/**
 * Deobfuscate an obfuscated string using the key string.
 * @param obfuscatedStr The obfuscated string to deobfuscate.
 * @param key The key string used for obfuscation.
 * @param rotNum The number of rotations applied during obfuscation (defaults to 13).
 * @returns The deobfuscated (original) string.
 */
export async function deobfuscateString(
  obfuscatedStr: string,
  key: string,
  rotNum = 13,
): Promise<string> {
  const decoded = atob(obfuscatedStr);
  const unrotated = rotateString(decoded, -rotNum);
  const keyHash = await hashString(key);
  const deobfuscated = xorStrings(unrotated, keyHash);
  return deobfuscated;
}

/**
 * Hash a string using the Web Crypto API.
 * @param str The string to hash.
 * @returns The hash of the string as a hexadecimal string.
 */
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * XOR two strings of the same length.
 * @param str1 The first string.
 * @param str2 The second string.
 * @returns The result of XORing the two strings.
 */
function xorStrings(str1: string, str2: string): string {
  const result = [];
  for (let i = 0; i < str1.length; i++) {
    result.push(String.fromCharCode(str1.charCodeAt(i) ^ str2.charCodeAt(i)));
  }
  return result.join("");
}

/**
 * Rotate a string by a given number of positions (positive or negative).
 * @param str The string to rotate.
 * @param n The number of positions to rotate (positive for left rotation, negative for right rotation).
 * @returns The rotated string.
 */
function rotateString(str: string, n: number): string {
  const chars = str.split("");
  n = n % chars.length;
  if (n < 0) n += chars.length;
  return chars.slice(n).concat(chars.slice(0, n)).join("");
}
