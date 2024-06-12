/**
 * Obfuscate a secret string using a key string.
 * @param secret The secret string to obfuscate.
 * @param key The key string used for obfuscation.
 * @param rotNum The number of rotations to apply (defaults to 13).
 * @returns The obfuscated string.
 */
async function obfuscateString(
  secret: string,
  key: string,
  rotNum = 13,
): Promise<string> {
  const keyHash = await hashString(key);
  const xored = xorStrings(secret, keyHash);
  const rotated = rotateString(xored, rotNum);
  return btoa(rotated);
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
    // @ts-expect-error Not sure why TypeScript doesn't like this, but I have a headache and this works
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

const secret = process.env.HONEYCOMB_KEY;
const key = process.env.VITE_OBFUSCATION_SECRET;
const rot = process.env.VITE_OBFUSCATION_ROT;

obfuscateString(secret!, key!, Number(rot!)).then(console.log);
