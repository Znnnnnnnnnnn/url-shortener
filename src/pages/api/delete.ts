import type { NextApiRequest, NextApiResponse } from "next";
import { deleteUrl } from "~/lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    try {
      await deleteUrl(data?.uuid);
      return res.status(200).json({ message: "Successfully deleted url" });
    } catch {
      return res.status(400).json({ message: "Failed to delete url" });
    }
  }
}
