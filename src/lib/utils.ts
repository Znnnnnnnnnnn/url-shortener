import short from "short-uuid";

/**
 *
 * With case sensitive alphanumeric character, which are total of 36,
 * should result in 6^36 possible uuid string if the length of the output
 * string is set to be 6. This should be sufficient to handle this project's need
 *
 * but in real world case, if more uuid is needed, then we have to increase
 * the output string length or use hashing function like e.g. sha256 which takes
 * in a secret key to hash a string so that more possible string can be created
 */
export const generateUUID = () => short.generate().slice(0, 6);
