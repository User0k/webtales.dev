/**
 * Catches languages and rules in {}, where languages are required and rules are optional.
 * Example: `tsx {1,3-6}`
 * @type {RegExp}
 */
export const CODE_BLOCK_HEADER_REGEX = /```(\w+)\s*(?:\{(.*?)\}\s*)?\n/g;
