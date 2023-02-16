import { createHmac } from "crypto";

export const hashUrl = (url: string, secret = "HASH_PASSWORD") =>
  createHmac("sha512", secret).update(url).digest("base64").slice(0, 10);
