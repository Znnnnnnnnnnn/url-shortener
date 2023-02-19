import type { NextApiRequest, NextApiResponse } from "next";
import { addUrl } from "~/lib";
import { SqliteError } from "~/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    let errString = "Failed to add new url";

    try {
      await addUrl(data?.url);
      return res.status(200).json({ message: "Successfully added new url" });
    } catch (error) {
      const e = error as SqliteError;
      if (e.code === "SQLITE_CONSTRAINT") errString = "Url already exist";
    }

    return res.status(400).json({ message: errString });
  }
}
