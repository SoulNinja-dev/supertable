import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  data: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ data: `hiii we're up` });
}
